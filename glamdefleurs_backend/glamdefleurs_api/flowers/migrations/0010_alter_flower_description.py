# Generated by Django 4.2.3 on 2023-08-18 09:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flowers', '0009_alter_flower_description_alter_flower_variants'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flower',
            name='description',
            field=models.TextField(default='', max_length=10000),
        ),
    ]