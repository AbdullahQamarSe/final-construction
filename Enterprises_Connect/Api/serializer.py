from rest_framework import serializers
from .models import signup,product,cart,Order_Now,Category,Area,Bidding,Bidding_View,Job,FeedBack

class FeedBack_serializer(serializers.ModelSerializer):
    class Meta:
        model = FeedBack
        fields ='__all__'

class Bidding_View_serializer(serializers.ModelSerializer):
    class Meta:
        model = Bidding_View
        fields ='__all__'

class Job_serializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields ='__all__'

class Category_serializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields ='__all__'

class Area_serializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields ='__all__'

class signup_serializer(serializers.ModelSerializer):
    class Meta:
        model = signup
        fields ='__all__'


class product_serializer(serializers.ModelSerializer):
    class Meta:
        model = product
        fields ='__all__'


class cart_serializer(serializers.ModelSerializer):
    class Meta:
        model = cart
        fields ='__all__'

class Order_Now_serializer(serializers.ModelSerializer):
    class Meta:
        model = Order_Now
        fields ='__all__'

class Bidding_serializer(serializers.ModelSerializer):
    class Meta:
        model = Bidding
        fields ='__all__'