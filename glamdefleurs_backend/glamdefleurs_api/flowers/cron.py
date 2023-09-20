import ast
import os
from decimal import Decimal
from flowers.utils.sheet_utils import get_photo_url, extract_photo_drive_id
from urllib import request
from django.core.files import File
import gc
import uuid

from flowers.serializers import FlowerSerializer, FlowerVariantSerializer, FlowerMediaSerializer
from flowers.models import Flower, FlowerMedia,FlowerVariant, Category, FlowerVariant
from glamdefleurs_api.sheets_service.sheets_service_v2 import read_spreadsheet, write_to_spreadsheet, write_multiple_ranges, clear_spreadsheet
from glamdefleurs_api.drive_service.drive_service import download_file

# The ID and range of a sample spreadsheet.
SPREADSHEET_ID = '1_imuOcVRVfw8gWX9ilDGvHSoBNw5sr7UcyV0SqZDZEE'
INITIAL_RANGE_NAME = 'flowers!A:H'
WRITE_RANGE_NAME = 'current!A:L'
ID_RANGE_NAME = 'flowers!A:A'
POPULAR_RANGE_NAME = 'popular!A:A'
ERROR_RANGE_NAME = 'errors!A2:E'

def main():
    write_new()
    set_popular()

def set_popular():
    rows = read_spreadsheet(SPREADSHEET_ID, POPULAR_RANGE_NAME)
    Flower.objects.all().update(is_popular=False)

    for row in rows:
        flower = Flower.objects.get(external_id=row[0])
        flower.is_popular = True
        flower.save()

def write_new():
    external_ids, errors = read_to_db()


    # # write to "current" spreadsheet
    # write_to_spreadsheet(SPREADSHEET_ID, WRITE_RANGE_NAME, write_rows)
    # gc.collect()

    # write external ids in to "flowers" spreadsheet
    write_multiple_ranges(SPREADSHEET_ID, external_ids)
    gc.collect()

    # write errors to errors spreadsheet
    clear_spreadsheet(SPREADSHEET_ID, ERROR_RANGE_NAME)
    write_to_spreadsheet(SPREADSHEET_ID, ERROR_RANGE_NAME, errors)
    gc.collect()

def compile_errors():
    raise NotImplementedError

def is_float(string):
    try:
        float(string)
        return True
    except ValueError:
        return False

def read_to_db():
    """
    Read the spreadsheet and add everything to the database

    Returns the dictionary of external ids and their cell in A1 notation, in the form
    ( cell : external id)
    Also returns list of error messages.
    """
    errors = []
    external_ids = {}

    rows = read_spreadsheet(SPREADSHEET_ID, INITIAL_RANGE_NAME)

    for i in range(len(rows)):
        try:
            external_id = parse_flower(rows[i])
            external_ids[f"flowers!A{i + 2}"] = [[ external_id.hex ]]
        except Exception as err:
            error_message = parse_error_detail(err)
            errors.append([error_message])


    return (external_ids, errors)

def parse_error_detail(exception):
    """
    Takes exception and returns an error message
    """
    name, error_detail = exception.args
    return_string = name + " : "

    for error in error_detail.keys():
        return_string += error_detail[error][0].title() + ", "

    return return_string

def parse_flower(row):
    """
    Takes in a row in read spreadsheet.
    Parses it into a 'flowers.Flower' object and saves in db.
    If flower exists (external_id row filled), update the flower object.

    parameters:
    row: contents of row

    returns:
    external_id of newly added flower

    """
    external_id = uuid.UUID(row[0]) if row[0] != "" else ""
    categories = row[1].split("/")
    has_variants = True if row[3].lower() == "yes" else False
    require_contact = True if row[4].lower() == "yes" else False

    if has_variants:
        price = ast.literal_eval("{" + row[5] + "}")
    elif not require_contact:
        price = Decimal(row[5])
    else:
        price = row[5]

    media = [url.strip() for url in row[6].split(",")]

    flower_data = {
        "external_id": row[0],
        "categories": categories,
        "name": row[2],
        "has_variants": has_variants,
        "require_contact": require_contact,
        "price": price,
        "media": media,
        "description": row[7]
    }

    # check if flower in db
    if flower_data["external_id"] != "" and len(Flower.objects.filter(external_id=flower_data["external_id"])) > 0:
        update_flower(**flower_data)
    else:
        external_id = add_flower(**flower_data)

    return external_id

def get_media(urls, alt):
    """
    Create FlowerMedia objects based on given urls.
    If url already exists, get that object's id instead.

    Returns list of object ids
    """

    media_ids = []
    for url in urls:

        media_data = {
            "alt": alt,
            "external_url": get_photo_url(url)
        }

        # check if image with matching url already exists
        filtered_flowers = FlowerMedia.objects.filter(**media_data)

        if len(filtered_flowers) > 0:
            media_ids.append(filtered_flowers[0].id)
        else:
            media_serializer = FlowerMediaSerializer(
                data=media_data
            )

            if media_serializer.is_valid():
                m = media_serializer.save()
                photo_id = extract_photo_drive_id(url)

                file = download_file(photo_id)

                m.image.save(
                    "flower.png",
                    File(file),
                    save=True
                )
                m.save()
                media_ids.append(m.id)
            else:
                raise Exception('media', media_serializer.errors)

    return media_ids

def create_variants(price, has_variants, require_contact):
    """
    Create FlowerVariant objects based on given prices

    Returns list of object ids
    """
    variant_ids = []

    if has_variants:
        for variant_name in price.keys():
            variant_data = {
                "price": None if require_contact else price[variant_name] ,
                "name": variant_name
            }
            variant_serializer = FlowerVariantSerializer(data=variant_data)
            if variant_serializer.is_valid():
                variant = variant_serializer.save()
                variant_ids.append(variant.id)
            else:
                raise Exception('variant', variant_serializer.errors)
    else:
        variant_data = {
            "price": None if require_contact else price,
            "name": ""
        }
        variant_serializer = FlowerVariantSerializer(data=variant_data)
        if variant_serializer.is_valid():
            variant = variant_serializer.save()
            variant_ids.append(variant.id)
        else:
            raise Exception('variant', variant_serializer.errors)

    return variant_ids

def add_flower(external_id, categories, name, has_variants, require_contact, price, media, description):
    """
    Adds a flower to the database given flower info

    Returns [ external_ids ] (of variants)
    """
    price_text = price if require_contact else ""

    # always create media, then variants, and then Flower object

    # create media
    media_ids = get_media(media, name)

    # creating variants
    variant_ids = create_variants(price, has_variants, require_contact)

    flower_data = {
        "name": name,
        "categories": categories,
        "media": media_ids,
        "description": description,
        "has_variants": has_variants,
        "default_variant": variant_ids[0],
        "require_contact": require_contact,
        "price_text": price_text
    }

    # add external id if provided
    if external_id != "":
        flower_data['external_id'] = external_id

    flower_serializer = FlowerSerializer(data=flower_data)

    if flower_serializer.is_valid():
        flower = flower_serializer.save()
        external_id = flower.external_id
    else:
        raise Exception(name, flower_serializer.errors)

    for variant_id in variant_ids:
        variant = FlowerVariant.objects.get(id=variant_id)
        variant.flower = flower
        variant.save()

    return external_id


def update_flower(external_id, categories, name, has_variants, require_contact, price, media, description):
    """
    Updates a flower in the db given flower data
    """
    price_text = price if require_contact else ""

    # create media
    media_ids = get_media(media, name)

    # creating variants
    variant_ids = create_variants(price, has_variants, require_contact)
    FlowerVariant.objects.filter(flower__external_id=external_id).exclude(id__in=variant_ids).delete()


    flower_data = {
        "name": name,
        "categories": categories,
        "media": media_ids,
        "description": description,
        "has_variants": has_variants,
        "default_variant": variant_ids[0],
        "require_contact": require_contact,
        "price_text": price_text
    }

    try:
        flower = Flower.objects.get(external_id=external_id)
        flower_serializer = FlowerSerializer(instance=flower, data=flower_data)
        if flower_serializer.is_valid():
            flower_serializer.save()
        else:
            raise Exception()
    except:
        raise Exception("Flower does not exist! Check the external ID")
main()