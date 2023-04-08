# Generated by Django 4.1.5 on 2023-02-07 22:55

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('fishing', '0003_delete_fishingitem'),
    ]

    operations = [
        migrations.CreateModel(
            name='FishingItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('business_name', models.CharField(max_length=255)),
                ('harbor', models.CharField(max_length=255)),
                ('fishing_type', models.CharField(max_length=255)),
                ('fish_species', models.CharField(max_length=255)),
                ('url', models.CharField(max_length=255, null=True)),
                ('thumbnail', models.CharField(max_length=255, null=True)),
                ('introduce', models.CharField(max_length=255, null=True)),
                ('admit', models.CharField(max_length=255, null=True)),
            ],
            options={
                'db_table': 'fishing_item',
            },
        ),
    ]
