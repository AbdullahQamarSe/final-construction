# Generated by Django 4.1.7 on 2023-06-02 06:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Api', '0015_alter_signup_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='signup',
            name='email',
            field=models.CharField(max_length=122, unique='True'),
        ),
    ]
