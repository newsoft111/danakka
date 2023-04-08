# Generated by Django 4.1.5 on 2023-04-07 19:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("fishing", "0063_remove_fishing_species"),
    ]

    operations = [
        migrations.AddField(
            model_name="fishing",
            name="species",
            field=models.ManyToManyField(
                blank=True,
                related_name="fishing_species_set",
                through="fishing.FishingSpecies",
                to="fishing.fishingspeciesitem",
            ),
        ),
    ]
