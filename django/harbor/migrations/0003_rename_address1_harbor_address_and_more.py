# Generated by Django 4.1.5 on 2023-02-08 18:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('harbor', '0002_rename_place_harbor_sea'),
    ]

    operations = [
        migrations.RenameField(
            model_name='harbor',
            old_name='address1',
            new_name='address',
        ),
        migrations.RemoveField(
            model_name='harbor',
            name='address2',
        ),
        migrations.RemoveField(
            model_name='harbor',
            name='address3',
        ),
    ]
