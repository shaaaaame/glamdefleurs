# Generated by Django 4.2.3 on 2023-07-20 04:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flowers', '0004_headcategory_display_photo'),
    ]

    operations = [
        migrations.AddField(
            model_name='flower',
            name='variants',
            field=models.ManyToManyField(to='flowers.flower'),
        ),
    ]
