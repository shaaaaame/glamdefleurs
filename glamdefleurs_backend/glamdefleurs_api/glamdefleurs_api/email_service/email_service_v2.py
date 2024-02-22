import os
from email.message import EmailMessage
import ssl
import smtplib
from dotenv import load_dotenv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from string import Template

from flowers.models import Flower, FlowerVariant


def send_email(content, to, subject=""):
    """
    Create and send an email message
    Print the returned  message id
    Returns: Message object, including message id
    """

    load_dotenv()

    email_sender = 'glamdefleursnotifications@gmail.com'
    email_password = os.environ["EMAIL_PASSWORD"]

    message = EmailMessage()

    message['To'] = to
    message['From'] = 'glamdefleursnotifications@gmail.com'
    message['Subject'] = subject
    message.set_content(content)


    context = ssl.create_default_context()

    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        smtp.login(email_sender, email_password)
        smtp.sendmail(email_sender, to, message.as_string())

def send_html_email(content, to, subject=""):
    """
    Create and send an email message
    Print the returned  message id
    Returns: Message object, including message id
    """

    load_dotenv()

    email_sender = 'glamdefleursnotifications@gmail.com'
    email_password = os.environ["EMAIL_PASSWORD"]

    message = MIMEMultipart('alternative')
    content = MIMEText(content, 'html')


    message['To'] = to
    message['From'] = 'glamdefleursnotifications@gmail.com'
    message['Subject'] = subject
    message.attach(content)

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        smtp.login(email_sender, email_password)
        smtp.sendmail(email_sender, to, message.as_string())

def send_purchase_email(items, to, details):
    """
    Send a html email message about successful purchase.

    Parameters:
    items: dict in form variant_id : quantity
    to: recipient
    user: details of the user (name, subtotal, shipping, address)
    """
    load_dotenv()

    email_sender = 'glamdefleursnotifications@gmail.com'
    email_password = os.environ["EMAIL_PASSWORD"]

    if details["delivery_method"] == "delivery":
        html_file = open("glamdefleurs_api/email_service/email/email.html", 'r')
    else:
        html_file = open("glamdefleurs_api/email_service/email/email_pickup.html", 'r')
    content = html_file.read()
    html_file.close()

    message = MIMEMultipart('alternative')

    # create item html
    items_html = ""

    template = """
                    <tr>
                        <div class="item">
                            <img class='item-img' src="cid:{id}" alt="flower"/>
                            <table>
                                <tr><h2>{name}</h2></tr>
                                <tr><h3>QTY: {quantity}</h3></tr>
                                <tr><h3>PRICE: {price}</h3></tr>
                            </table>
                        </div>
                    </tr>
               """


    for item_id in items.keys():
        variant = FlowerVariant.objects.get(pk=item_id)
        flower = variant.flower
        data = {
            "id": item_id,
            "name": flower.name + (f"({variant.name})" if variant.name else ""),
            "quantity": items[item_id],
            "price": "${:.2f}".format(items[item_id] * float(variant.price)),
        }


        file = open(os.getcwd() + flower.media.all()[0].image.url, 'rb')
        img = MIMEImage(file.read())
        img.add_header('Content-ID', f'<{item_id}>')
        message.attach(img)

        item_html = template.format(**data)
        items_html += item_html

    # format address for html
    address = details.pop("address")
    address = f"{address['address1']}<br>" + ( f"{address['address2']}<br>" if address['address2'] != "" else "") + address["city"] + "<br>" + address["province"] + "<br>" + address["postcode"]

    # add flower data to html
    content = Template(content).safe_substitute(**details, address=address, items=item_html)

    content = MIMEText(content, 'html')

    message.attach(content)

    # set images

    file = open("glamdefleurs_api/email_service/email/images/glamdefleurs.png", 'rb')
    img = MIMEImage(file.read())
    img.add_header('Content-ID', '<glamdefleurs>')
    message.attach(img)

    file = open("glamdefleurs_api/email_service/email/images/facebook.png", 'rb')
    img = MIMEImage(file.read())
    img.add_header('Content-ID', '<facebook>')
    message.attach(img)

    file = open("glamdefleurs_api/email_service/email/images/instagram.png", 'rb')
    img = MIMEImage(file.read())
    img.add_header('Content-ID', '<instagram>')
    message.attach(img)

    file = open("glamdefleurs_api/email_service/email/images/mail.png", 'rb')
    img = MIMEImage(file.read())
    img.add_header('Content-ID', '<mail>')
    message.attach(img)

    message['To'] = to
    message['From'] = 'glamdefleursnotifications@gmail.com'
    message['Subject'] = 'Glam de Fleurs: Thank you for your purchase!'

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        smtp.login(email_sender, email_password)
        smtp.sendmail(email_sender, to, message.as_string())