# Generated by Django 4.2.3 on 2024-02-05 06:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flowers', '0010_remove_headcategory_display_photo_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='headcategory',
            name='display_image_flower',
        ),
        migrations.AddField(
            model_name='headcategory',
            name='display_photo',
            field=models.ImageField(blank=True, null=True, upload_to='category_media'),
        ),
    ]