# Generated by Django 4.2.3 on 2023-10-09 20:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flowers', '0008_flowervariant_media'),
    ]

    operations = [
        migrations.AddField(
            model_name='flowervariant',
            name='is_using_flower_image',
            field=models.BooleanField(default=True),
        ),
    ]
