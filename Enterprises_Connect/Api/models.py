from django.db import models
from django.contrib.auth.models import AbstractUser
from .manager import UserManager
from django.utils import timezone
import re
from django.core.validators import RegexValidator

class signup(AbstractUser):
    username=None
    email=models.CharField(max_length=122,unique='True')
    name=models.CharField(max_length=122)
    password=models.CharField(max_length=122)
    address=models.CharField(max_length=122)
    select_area=models.CharField(max_length=122)
    UserType=models.CharField(max_length=122)
    image1 = models.ImageField(upload_to='media/',null=True, blank=True)
    Shop_name=models.CharField(max_length=122,null=True, blank=True)
    Phone=models.CharField(max_length=122,null=True, blank=True)

    objects = UserManager()
    USERNAME_FIELD= 'email'
    REQUIRED_FIELDS=[]

class product(models.Model):
    productName=models.CharField(max_length=122,null=True, blank=True)
    quantity=models.CharField(max_length=122,null=True, blank=True)
    productCode=models.CharField(max_length=122,null=True, blank=True)
    description=models.CharField(max_length=122,null=True, blank=True)
    price=models.CharField(max_length=122,null=True, blank=True)
    category=models.CharField(max_length=122,null=True, blank=True)
    vemail=models.CharField(max_length=122,null=True, blank=True)

    image1 = models.ImageField(upload_to='media/',null=True, blank=True)
    image2 = models.ImageField(upload_to='media/',null=True, blank=True)
    image3 = models.ImageField(upload_to='media/',null=True, blank=True)
    image4 = models.ImageField(upload_to='media/',null=True, blank=True)
    image5 = models.ImageField(upload_to='media/',null=True, blank=True)
    image6 = models.ImageField(upload_to='media/',null=True, blank=True)

class cart(models.Model):
   useremail=models.CharField(max_length=122)
   price=models.CharField(max_length=122)
   productcode=models.CharField(max_length=122)
   productName=models.CharField(max_length=122)
   quantity=models.CharField(max_length=122)
   vemail=models.CharField(max_length=122)



class Order_Now(models.Model):
    email = models.CharField(max_length=255,null=True, blank=True)
    productName = models.JSONField(null=True, blank=True)
    price = models.JSONField(null=True, blank=True)
    quantity = models.JSONField(null=True, blank=True)
    code = models.JSONField(null=True, blank=True)
    vemail=models.JSONField(null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50, default='Delivered')

    def save(self, *args, **kwargs):
        if not self.pk and not self.date:
            self.date = timezone.now().date()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.date} - {self.status}"

class Category(models.Model):
   Category=models.CharField(max_length=122)
   CategoryDes=models.CharField(max_length=122)
   image1 = models.ImageField(upload_to='media/',null=True, blank=True)

class Area(models.Model):
    Area=models.CharField(max_length=122)

class Bidding(models.Model):
   Title=models.CharField(max_length=255)
   Price=models.CharField(max_length=255)
   Description=models.CharField(max_length=255)
   email=models.CharField(max_length=255)   
   identity=models.CharField(max_length=255) 
   image1 = models.ImageField(upload_to='media/',null=True, blank=True)


class Bidding_View(models.Model):
   identity=models.CharField(max_length=255)
   Message=models.CharField(max_length=255)
   email=models.CharField(max_length=255)
   name=models.CharField(max_length=255)   
   Phone=models.CharField(max_length=255) 

class Job(models.Model):
   Title=models.CharField(max_length=122)
   Phone=models.CharField(max_length=122)
   image1 = models.ImageField(upload_to='media/',null=True, blank=True)

class FeedBack(models.Model):
    email_vendors=models.CharField(max_length=255)
    email_customer=models.CharField(max_length=255)
    drop_down=models.CharField(max_length=255)
    message=models.CharField(max_length=255)