# Generated by Django 4.2.3 on 2024-02-05 06:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('flowers', '0009_flowervariant_is_using_flower_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='headcategory',
            name='display_photo',
        ),
        migrations.AddField(
            model_name='headcategory',
            name='display_image_flower',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='flowers.flower'),
        ),
    ]
