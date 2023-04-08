# Generated by Django 4.1.5 on 2023-02-13 19:29

from django.db import migrations, models
import fishing.models


class Migration(migrations.Migration):

    dependencies = [
        ("fishing", "0024_alter_fishing_thumbnail"),
    ]

    operations = [
        migrations.AlterField(
            model_name="fishing",
            name="thumbnail",
            field=models.FileField(null=True, upload_to=fishing.models.upload_to),
        ),
    ]
