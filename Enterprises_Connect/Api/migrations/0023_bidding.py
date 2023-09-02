# Generated by Django 4.1.7 on 2023-06-06 05:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Api', '0022_alter_product_vemail'),
    ]

    operations = [
        migrations.CreateModel(
            name='Bidding',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Title', models.CharField(max_length=255)),
                ('Price', models.CharField(max_length=255)),
                ('Description', models.CharField(max_length=255)),
                ('email', models.CharField(max_length=255)),
                ('identity', models.CharField(max_length=255)),
                ('image1', models.ImageField(blank=True, null=True, upload_to='media/')),
            ],
        ),
    ]
