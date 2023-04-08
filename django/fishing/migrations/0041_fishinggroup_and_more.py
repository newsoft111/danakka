# Generated by Django 4.1.5 on 2023-02-20 15:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        (
            "fishing",
            "0040_fishingcrawler_remove_fishing_crawled_business_name_and_more",
        ),
    ]

    operations = [
        migrations.CreateModel(
            name="FishingGroup",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
            ],
            options={
                "db_table": "fishing_group",
            },
        ),
        migrations.RemoveField(
            model_name="fishingcrawler",
            name="crawler_business_name",
        ),
        migrations.AlterField(
            model_name="fishing",
            name="fishing_crawler",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="fishing.fishingcrawler",
            ),
        ),
        migrations.AddField(
            model_name="fishing",
            name="fishing_group",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="fishing.fishinggroup",
            ),
        ),
    ]
