# Generated by Django 4.2.3 on 2023-08-10 17:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0006_customer_address'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='postcode',
            field=models.CharField(max_length=8),
        ),
    ]