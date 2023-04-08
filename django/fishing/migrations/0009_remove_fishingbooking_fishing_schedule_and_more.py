# Generated by Django 4.1.5 on 2023-02-08 00:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fishing', '0008_alter_fishingschedule_table'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='fishingbooking',
            name='fishing_schedule',
        ),
        migrations.AddField(
            model_name='fishingbooking',
            name='date',
            field=models.DateField(default=1),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='FishingSchedule',
        ),
    ]
