# Generated by Django 4.1.5 on 2023-02-20 14:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("fishing", "0038_rename_is_changed_crawled_business_name_fishing_is_display"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="fishing",
            name="is_display",
        ),
        migrations.AddField(
            model_name="fishing",
            name="is_deleted",
            field=models.BooleanField(default=True),
        ),
    ]
