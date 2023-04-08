# Generated by Django 4.1.5 on 2023-02-08 18:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('harbor', '0002_rename_place_harbor_sea'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('fishing', '0014_remove_fishingbooking_fishing_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Fishing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('site_url', models.CharField(max_length=255, null=True)),
                ('thumbnail', models.CharField(max_length=255, null=True)),
                ('introduce', models.CharField(max_length=255, null=True)),
                ('seat', models.CharField(max_length=255, null=True)),
                ('price', models.CharField(max_length=255, null=True)),
            ],
            options={
                'db_table': 'fishing',
            },
        ),
        migrations.CreateModel(
            name='FishingSpeciesItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
            options={
                'db_table': 'fishing_species_item',
            },
        ),
        migrations.CreateModel(
            name='FishingType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
            options={
                'db_table': 'fishing_type',
            },
        ),
        migrations.CreateModel(
            name='FishingSpecies',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fishing', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='fishing.fishing')),
                ('fishing_species_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='fishing.fishingspeciesitem')),
            ],
            options={
                'db_table': 'fishing_species',
            },
        ),
        migrations.CreateModel(
            name='FishingBooking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('additional_person', models.CharField(max_length=255, null=True)),
                ('fishing', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='fishing.fishing')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'fishing_booking',
            },
        ),
        migrations.AddField(
            model_name='fishing',
            name='fishing_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='fishing.fishingtype'),
        ),
        migrations.AddField(
            model_name='fishing',
            name='harbor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='harbor.harbor'),
        ),
    ]
