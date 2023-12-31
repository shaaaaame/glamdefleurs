# Generated by Django 4.2.3 on 2023-09-19 17:22

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ContactForm',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('email', models.EmailField(max_length=254)),
                ('subject', models.TextField(max_length=997)),
                ('phone_number', models.CharField(blank=True, max_length=20, null=True)),
                ('preferred_contact_method', models.CharField(max_length=100)),
                ('message', models.TextField()),
                ('date_created', models.DateField(auto_now_add=True)),
            ],
            options={
                'ordering': ['date_created'],
            },
        ),
    ]
