# Generated by Django 4.2.3 on 2023-09-19 21:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('flowers', '0002_remove_flowervariant_external_id_flower_external_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flowervariant',
            name='flower',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='flower', to='flowers.flower'),
        ),
    ]
