# Generated by Django 4.1.5 on 2023-02-20 16:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("fishing", "0047_fishing_fishing_group"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="fishing",
            name="fishing_group",
        ),
        migrations.DeleteModel(
            name="FishingGroup",
        ),
    ]
