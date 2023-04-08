# Generated by Django 4.1.5 on 2023-02-08 18:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fishing', '0016_rename_name_fishing_business_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='fishing',
            name='business_address',
            field=models.CharField(default=1, max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='fishing',
            name='referrer',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='fishing',
            name='price',
            field=models.DecimalField(decimal_places=2, default=1, max_digits=14),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='fishing',
            name='seat',
            field=models.PositiveIntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='fishing',
            name='site_url',
            field=models.CharField(default=1, max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='fishingbooking',
            name='additional_person',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
