from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser
from rest_framework import status
from rest_framework.response import Response
from .models import signup,product,Order_Now
from .serializer import signup_serializer,product_serializer,cart_serializer,Order_Now_serializer,Category_serializer,Area_serializer,Bidding_serializer,Bidding_View_serializer,Job_serializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import cart,Category,Area,Bidding,Bidding_View,Job


class SignupAPIView(APIView):
    def post(self, request):
        serializer = signup_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework import status

class LoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        requestData = request.data
        Account = requestData["email"]
        Password = requestData["password"]
        notfound = "Email Not Found"
        
        try:
            user = signup.objects.get(email=Account, password=Password)
            serializer = signup_serializer(user)
            return Response(serializer.data)
        except signup.DoesNotExist:
            return Response("Email or Password is Wrong")

    


class Product_Add(APIView):
    def post(self, request):
        try:
            # get the data from the request
            serializer = product_serializer(data=request.data)

            if serializer.is_valid():
                # save the instance to the database
                serializer.save()

                # return a success response
                return Response({
                    'status': 'success',
                    'message': 'Data added successfully'
                }, status=status.HTTP_201_CREATED)
            else:
                # return an error response if the serializer is not valid
                return Response({
                    'status': 'error',
                    'message': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # return an error response if there was an exception
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            # get all instances of the model from the database
            queryset = product.objects.all()

            # serialize the data
            serializer = product_serializer(queryset, many=True)

            # return a success response with the serialized data
            return Response({
                'status': 'success',
                'data': serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            # return an error response if there was an exception
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            # get the instance of the model with the given primary key from the database
            instance = product.objects.get(pk=pk)

            # update the instance with the new data from the request
            serializer = product_serializer(instance, data=request.data)

            if serializer.is_valid():
                # save the updated instance to the database
                serializer.save()

                # return a success response
                return Response({
                    'status': 'success',
                    'message': 'Data updated successfully'
                }, status=status.HTTP_200_OK)
            else:
                # return an error response if the serializer is not valid
                return Response({
                    'status': 'error',
                    'message': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

        except product.DoesNotExist:
            # return a 404 error if the instance does not exist
            return Response({
                'status': 'error',
                'message': 'Data not found'
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            # return an error response if there was an exception
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            # get the instance of the model with the given primary key from the database
            instance = product.objects.get(pk=pk)

            # delete the instance from the database
            instance.delete()

            # return a success response
            return Response({
                'status': 'success',
                'message': 'Data deleted successfully'
            }, status=status.HTTP_204_NO_CONTENT)

        except product.DoesNotExist:
            # return a 404 error if the instance does not exist
            return Response({
                'status': 'error',
                'message': 'Data not found' }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # return an error response if there was an exception
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        


class CartView(APIView):
    def post(self, request):
        # Add item to cart
        serializer = cart_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True})
        else:
            return Response(serializer.errors, status=400)

    def delete(self, request):
        # Delete item from cart
        cart_id = request.GET.get('cart_id')

        # Get the cart item and delete it
        try:
            cart_item = cart.objects.get(id=cart_id)
            cart_item.delete()
            return Response({'success': True})
        except cart.DoesNotExist:
            return Response({'success': False, 'error': 'Cart item not found'}, status=404)

    def get(self, request):
        try:
            # get all instances of the model from the database
            queryset = cart.objects.all()

            # serialize the data
            serializer = cart_serializer(queryset, many=True)

            # return a success response with the serialized data
            return Response({
                'status': 'success',
                'data': serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            # return an error response if there was an exception
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        


class OrderView(APIView):
    def post(self, request):
        # Add item to cart
        serializer = Order_Now_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True})
        else:
            return Response(serializer.errors, status=400)

    def delete(self, request):
        cart_id = request.GET.get('cart_id')
        try:
            cart_item = Order_Now.objects.get(id=cart_id)
            if request.method == 'DELETE':
                cart_item.delete()
            elif request.method == 'PUT':
                cart_item.status = 'Delivered'  # Update the status to 'Delivered'
                cart_item.save()
            return Response({'success': True})
        except Order_Now.DoesNotExist:
            return Response({'success': False, 'error': 'Cart item not found'}, status=404)



    def get(self, request):
        try:
            # get all instances of the model from the database
            queryset = Order_Now.objects.all()

            # serialize the data
            serializer = Order_Now_serializer(queryset, many=True)

            # return a success response with the serialized data
            return Response({
                'status': 'success',
                'data': serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            # return an error response if there was an exception
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


from rest_framework import status
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .serializer import Order_Now_serializer
from .models import Order_Now


class OrderView1(viewsets.ViewSet):    
    def list(self, request):
        orders = Order_Now.objects.all()
        serializer = Order_Now_serializer(orders, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = Order_Now_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset = Order_Now.objects.all()
        order = get_object_or_404(queryset, pk=pk)
        serializer = Order_Now_serializer(order)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        order = Order_Now.objects.get(pk=pk)
        serializer = Order_Now_serializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        order = Order_Now.objects.get(pk=pk)
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

    
class Product_Add_New(viewsets.ViewSet):    
    def list(self, request):
        orders = product.objects.all()
        serializer = product_serializer(orders, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = product_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset = product.objects.all()
        order = get_object_or_404(queryset, pk=pk)
        serializer = product_serializer(order)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        order = product.objects.get(pk=pk)
        serializer = product_serializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        order = product.objects.get(pk=pk)
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response

User = get_user_model()

class UserDetailAPIView(APIView):
    def get(self, request, email):
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        data = {
            "username": user.username,
            "name": user.name,
            "email": user.email,
            "address": user.address,
            "select_area": user.select_area,
            "UserType": user.UserType,
        }
        return Response(data)


class Category_APi(viewsets.ViewSet):    
    def list(self, request):
        orders = Category.objects.all()
        serializer = Category_serializer(orders, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = Category_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset = Category.objects.all()
        order = get_object_or_404(queryset, pk=pk)
        serializer = Category_serializer(order)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        order = Category.objects.get(pk=pk)
        serializer = Category_serializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        order = Category.objects.get(pk=pk)
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class Area_APi(viewsets.ViewSet):    
    def list(self, request):
        orders = Area.objects.all()
        serializer = Area_serializer(orders, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = Area_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset = Area.objects.all()
        order = get_object_or_404(queryset, pk=pk)
        serializer = Area_serializer(order)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        order = Area.objects.get(pk=pk)
        serializer = Area_serializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        order = Area.objects.get(pk=pk)
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
import random

class EmailVerificationAPIView(APIView):
    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('otp')

        if email:

            send_mail(
                'Verification Code',
                f'Your verification code is: {code}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )

            return Response({'message': 'Verification code sent successfully.'}, status=200)
        else:
            return Response({'error': 'Email address is required.'}, status=400)


class SignData(viewsets.ViewSet):
    def list(self, request):
        orders = signup.objects.all()
        serializer = signup_serializer(orders, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = signup_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset = signup.objects.all()
        order = get_object_or_404(queryset, pk=pk)
        serializer = signup_serializer(order)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        order = signup.objects.get(pk=pk)
        serializer = signup_serializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        try:
            order = signup.objects.get(pk=pk)
            order.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except signup.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    



class BiddingData(viewsets.ViewSet):    
    def list(self, request):
        orders = Bidding.objects.all()
        serializer = Bidding_serializer(orders, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = Bidding_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset = Bidding.objects.all()
        order = get_object_or_404(queryset, pk=pk)
        serializer = Bidding_serializer(order)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        order = Bidding.objects.get(pk=pk)
        serializer = Bidding_serializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        order = Bidding.objects.get(pk=pk)
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class Bidding_View_Data(viewsets.ViewSet):    
    def list(self, request):
        orders = Bidding_View.objects.all()
        serializer = Bidding_View_serializer(orders, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = Bidding_View_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset = Bidding_View.objects.all()
        order = get_object_or_404(queryset, pk=pk)
        serializer = Bidding_View_serializer(order)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        order = Bidding_View.objects.get(pk=pk)
        serializer = Bidding_View_serializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        order = Bidding_View.objects.get(pk=pk)
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class Job_View(viewsets.ViewSet):    
    def list(self, request):
        orders = Job.objects.all()
        serializer = Job_serializer(orders, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = Job_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset = Job.objects.all()
        order = get_object_or_404(queryset, pk=pk)
        serializer = Job_serializer(order)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        order = Job.objects.get(pk=pk)
        serializer = Job_serializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        order = Job.objects.get(pk=pk)
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

from .models import FeedBack
from .serializer import FeedBack_serializer

class FeedBack_View(viewsets.ViewSet):    
    def list(self, request):
        orders = FeedBack.objects.all()
        serializer = FeedBack_serializer(orders, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = FeedBack_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset = FeedBack.objects.all()
        order = get_object_or_404(queryset, pk=pk)
        serializer = FeedBack_serializer(order)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        order = FeedBack.objects.get(pk=pk)
        serializer = FeedBack_serializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        order = FeedBack.objects.get(pk=pk)
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

import stripe
from rest_framework.views import APIView
from rest_framework.response import Response
import stripe

class PayPalPaymentView(APIView):
    def post(self, request):
        amount = request.data.get('amount')
        card_number = request.data.get('token')

        stripe.api_key = settings.STRIPE_SECRET_KEY

        try:
            # Create a customer with the card information
            customer = stripe.Customer.create(
                source=card_number,
            )

            # Charge the customer with the specified amount
            charge = stripe.Charge.create(
                customer=customer.id,
                amount=amount,
                currency='usd',
                description='Payment'
            )

            # If the charge was successful, return a success message
            if charge['paid']:
                return Response({'message': 'Payment successful'})

        except stripe.error.CardError as e:
            # If there was an error with the card, return an error message
            body = e.json_body
            err = body.get('error', {})
            return Response({'message': f"Card error: {err.get('message')}"}, status=400)

        except stripe.error.StripeError as e:
            # If there was a general Stripe error, return an error message
            body = e.json_body
            err = body.get('error', {})
            return Response({'message': f"Stripe error: {err.get('message')}"}, status=400)

        # If the charge was not successful, return an error message
        return Response({'message': 'Payment failed'}, status=400)