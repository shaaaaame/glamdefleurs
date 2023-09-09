import ast
import re
from decimal import Decimal
import uuid
import gc

from flowers.serializers import FlowerSerializer
from flowers.models import Flower, Category
from glamdefleurs_api.sheets_service.sheets_service_v2 import read_spreadsheet, write_to_spreadsheet, write_multiple_ranges, clear_spreadsheet

# The ID and range of a sample spreadsheet.
SPREADSHEET_ID = '1M9taW0jW7_b3_sZbSRC7U7PoJIXtB080iPAQeMPHJR4'
INITIAL_RANGE_NAME = 'flowers!A:F'
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
    """
    Reads the "flower" sheet and adds everything into the db.
    """
    write_rows = [['id', 'external id', 'name', 'categories', 'price', 'price_text', 'photo', 'description', 'is popular', 'variants', 'variant name', 'require contact']]
    rows = read_spreadsheet(SPREADSHEET_ID, INITIAL_RANGE_NAME)

    # external ids to add, in the form "row : external id"
    external_ids = {}
    included_ids = []

    # errors that need to be added to error sheet
    errors = []

    for i in range(len(rows)):
        # parse record in sheet and add to db
        external_id = ""

        try:
            sheet_rows, external_id = parse_flower(rows[i])
            for sheet_row in sheet_rows:
                sheet_row = [str(x) for x in sheet_row]
                write_rows.append(sheet_row)

                try:
                    id_dict = ast.literal_eval(external_id)
                    for id in id_dict.values():
                        included_ids.append(id)
                except:
                    included_ids.append(external_id)

            # write the external ids
            external_ids[f"flowers!A{i + 2}"] = [[ external_id ]]

        except Exception as err:
            if rows[i][0]:
                included_ids.append(rows[i][0])

            error_row = [rows[i][2], str(err)]
            errors.append(error_row)

    Flower.objects.all().exclude(external_id__in=included_ids).delete()


    # write to "current" spreadsheet
    write_to_spreadsheet(SPREADSHEET_ID, WRITE_RANGE_NAME, write_rows)
    gc.collect()

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

def get_photo_url(drive_url):
    """
    Converts a drive url to a photo url.
    """

    if "file" in drive_url:
        photo_id = re.search('drive.google.com/file/d/(.*)/view', drive_url).group(1)
        photo = f"https://drive.google.com/uc?export=view&id={photo_id}"
    else:
        return drive_url

    return photo


def parse_flower(row):
    """
    Takes in a row in read spreadsheet.
    Parses it into a flowers.Flower object and saves in db.
    Returns
    (
        array of rows to add to sheets. (sheet_rows),
        external_id of flower that's just added
    )

    row: contents of row
    num: row number
    errors: list of errors if any
    """
    sheet_rows = []
    external_id = {}

    flower_ex_id = row[0]
    categories = row[1].split('/')
    name = row[2]
    prices = row[3]
    # if row[4] (photos) is a dict, multiple photos for multiple variants.
    try:
        photos = ast.literal_eval("{" + row[4] + "}")
    except:
        photos = get_photo_url(row[4])
    description = row[5]

    # if multiple prices, variants exist.
    # create multiple Flowers.

    if not is_float(prices):

        try:
            # case where prices are multiple variants
            prices = ast.literal_eval("{" + prices + "}")
            all_flowers = []

            for price_name in prices.keys():
                if isinstance(photos, str):
                    photo = photos
                else:
                    photo = get_photo_url(photos[price_name])

                data = {
                    "categories": categories,
                    "name": name,
                    "price": prices[price_name],
                    "photo": photo,
                    "description": description,
                    "variants": [],
                    "variant_name": price_name
                }

                # check if flower already exists in database
                if flower_ex_id:
                    try:
                        flower_ex_id = ast.literal_eval(row[0])
                    except:
                        raise Exception("external_id")

                    if price_name in flower_ex_id.keys():
                        flowers = Flower.objects.filter(external_id=flower_ex_id[price_name])
                        # manually update categories
                        flowers[0].categories.clear()
                        for category in categories:
                            flowers[0].categories.add(Category.objects.get(pk=category))
                        data.pop("categories")

                        # manually update variants
                        flowers[0].variants.clear()
                        data.pop("variants")

                        flowers.update(**data)
                        all_flowers.append(flowers[0])
                    else:
                        serializer = FlowerSerializer(data=data)
                        if serializer.is_valid():
                            flower = serializer.save()
                            all_flowers.append(flower)
                        else:
                            raise TypeError(serializer.errors)
                else:
                    serializer = FlowerSerializer(data=data)
                    if serializer.is_valid():
                        flower = serializer.save()
                        all_flowers.append(flower)
                    else:
                        raise TypeError(serializer.errors)

            # adding relationships
            for i in range(len(all_flowers)):
                for j in range(i + 1, len(all_flowers)):
                    all_flowers[i].variants.add(all_flowers[j])

            # add flowers to be written as rows in google sheets
            for f in all_flowers:
                serializer = FlowerSerializer(instance=f)
                sheet_row = list(serializer.data.values())
                sheet_rows.append(sheet_row)

                external_id[f.variant_name] = f.external_id.hex

            external_id = str(external_id).replace(', ',',\n')
        except:
            # case where price is invalid, set require_contact = True
            data = {
                "categories": categories,
                "name": name,
                "price": '0.00',
                "photo": photos,
                "description": description,
                "variants": [],
                "require_contact": True,
                "price_text": prices
            }

            if flower_ex_id:
                flower_ex_id = row[0]

                flowers = Flower.objects.filter(external_id=flower_ex_id)

                # manually update categories
                flowers[0].categories.clear()
                for category in categories:
                    flowers[0].categories.add(Category.objects.get(pk=category))
                data.pop("categories")

                # manually update variants
                flowers[0].variants.clear()
                data.pop("variants")

                flowers.update(**data)

                flowers[0].save()

                serializer = FlowerSerializer(instance=flowers[0])
                sheet_rows.append(list(serializer.data.values()))
                external_id = flowers[0].external_id.hex
            else:
                serializer = FlowerSerializer(data=data)
                if serializer.is_valid():
                    flower = serializer.save()
                else:
                    raise TypeError(serializer.errors)

                sheet_rows.append(list(serializer.data.values()))
                external_id = flower.external_id.hex

    else:
        data = {
            "categories": categories,
            "name": name,
            "price": Decimal(row[3]),
            "photo": photos,
            "variants": [],
            "description": description,
            "price_text": ""
        }

        if flower_ex_id != "":
            flowers = Flower.objects.filter(external_id=flower_ex_id)

            print(flowers)

            # manually update categories
            flowers[0].categories.clear()
            for category in categories:
                flowers[0].categories.add(Category.objects.get(pk=category))
            data.pop("categories")

            # manually update variants
            flowers[0].variants.clear()
            data.pop("variants")

            flowers.update(**data)
            flowers[0].save()

            # add data to sheets
            serializer = FlowerSerializer(instance=flowers[0])
            sheet_rows.append(list(serializer.data.values()))
            external_id = flowers[0].external_id.hex
        else:
            serializer = FlowerSerializer(data=data)
            if serializer.is_valid():
                flower = serializer.save()
            else:
                raise TypeError(serializer.errors)

            sheet_rows.append(list(serializer.data.values()))
            external_id = flower.external_id.hex

    return ( sheet_rows, external_id )

main()