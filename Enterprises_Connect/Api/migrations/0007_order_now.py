# Generated by Django 4.1.7 on 2023-05-12 05:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Api', '0006_cart_price'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order_Now',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.CharField(max_length=122)),
                ('productName', models.CharField(max_length=122)),
                ('price', models.CharField(max_length=122)),
                ('quantity', models.CharField(max_length=122)),
                ('code', models.CharField(max_length=122)),
            ],
        ),
    ]
