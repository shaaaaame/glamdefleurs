# Generated by Django 4.2.2 on 2023-07-03 23:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField(max_length=10000)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='HeadCategory',
            fields=[
                ('id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField(max_length=10000)),
                ('subcategories', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='flowers.headcategory')),
            ],
        ),
        migrations.CreateModel(
            name='Flower',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('price', models.DecimalField(decimal_places=2, max_digits=6)),
                ('photo', models.URLField()),
                ('description', models.TextField(max_length=10000)),
                ('is_popular', models.BooleanField(default=False)),
                ('categories', models.ManyToManyField(to='flowers.category')),
            ],
            options={
                'ordering': ['name'],
            },
        ),
    ]
