# Generated by Django 4.2.3 on 2023-08-27 18:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flowers', '0017_alter_flower_external_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='flower',
            name='require_contact',
            field=models.BooleanField(default=False),
        ),
    ]