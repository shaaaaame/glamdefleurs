# Generated by Django 4.2.3 on 2023-07-21 17:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contact', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contactform',
            name='phone_country',
        ),
    ]
