import os
from email.message import EmailMessage
import ssl
import smtplib
from dotenv import load_dotenv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage

from flowers.models import Flower


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
    items: dict in form item_id : quantity
    to: recipient
    user: details of the user (name, subtotal, shipping, address)
    """
    load_dotenv()

    email_sender = 'glamdefleursnotifications@gmail.com'
    email_password = os.environ["EMAIL_PASSWORD"]

    html_file = open("glamdefleurs_api/email_service/email/index.html", 'r')
    content = html_file.read()
    html_file.close()

    message = MIMEMultipart('alternative')

    # create item html
    items_html = ""

    template = """
            <tr>
               <div style="padding:25px; display:flex; justify-content: space-between; align-items: center">
                    <img class="adapt-img p_image" src="{photo}" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border-radius:10px" width="195">
                    <table cellpadding="0" cellspacing="0" width="100%" height:"100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-left:1px solid #000000;border-right:1px solid #000000;border-top:1px solid #000000;border-bottom:1px solid #000000;border-radius:10px" role="presentation">
                      <td align="left" class="es-m-txt-c" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:25px;padding-bottom:25px"><h3 class="p_name" style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:Raleway, Arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#000000">{name}</h3><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;line-height:24px;color:#4D4D4D;font-size:16px">QTY:&nbsp;{quantity}</p><h3 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:Raleway, Arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#000000" class="p_price">{price}</h3></td>
                    </table>
               </div>
            </tr>

               """


    for item_id in items.keys():
        flower = Flower.objects.get(pk=item_id)
        data = {
            "name": flower.name + (f"({flower.variant_name})" if flower.variant_name else ""),
            "quantity": items[item_id],
            "price": "${:.2f}".format(items[item_id] * float(flower.price)),
            "photo": flower.photo
        }

        item_html = template.format(**data)
        items_html += item_html

    # format address for html
    address = details.pop("address")
    address = f"{address['address1']}<br>" + ( f"{address['address2']}<br>" if address['address2'] != "" else "") + address["city"] + "<br>" + address["province"] + "<br>" + address["postcode"]

    # add flower data to html
    content = content.format(**details, address=address, items=items_html)

    content = MIMEText(content, 'html')

    message.attach(content)

    # set images

    file = open("glamdefleurs_api/email_service/email/images/glamdefleurs.png", 'rb')
    img = MIMEImage(file.read())
    img.add_header('Content-ID', '<glamdefleurs>')
    message.attach(img)

    file = open("glamdefleurs_api/email_service/email/images/facebook2x.png", 'rb')
    img = MIMEImage(file.read())
    img.add_header('Content-ID', '<facebook2x>')
    message.attach(img)

    file = open("glamdefleurs_api/email_service/email/images/instagram2x.png", 'rb')
    img = MIMEImage(file.read())
    img.add_header('Content-ID', '<instagram2x>')
    message.attach(img)

    message['To'] = to
    message['From'] = 'glamdefleursnotifications@gmail.com'
    message['Subject'] = 'Glam de Fleurs: Thank you for your purchase!'

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        smtp.login(email_sender, email_password)
        smtp.sendmail(email_sender, to, message.as_string())