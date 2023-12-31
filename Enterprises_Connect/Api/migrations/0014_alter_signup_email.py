# Generated by Django 4.1.7 on 2023-05-25 11:10

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Api', '0013_area_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='signup',
            name='email',
            field=models.CharField(error_messages={'unique': 'A user with this phone number already exists.'}, max_length=13, unique=True, validators=[django.core.validators.RegexValidator(message="Phone number must be in the format: '+92xxxxxxxxx'.", regex='^\\+92\\d{9}$')]),
        ),
    ]
