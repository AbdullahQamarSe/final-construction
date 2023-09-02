from django.urls import path ,include
from .views import SignupAPIView, LoginAPIView,Product_Add,CartView,OrderView,OrderView1,Product_Add_New,Category_APi,Area_APi,SignData,BiddingData,Bidding_View_Data,Job_View
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
from .views import UserDetailAPIView
from .views import EmailVerificationAPIView,FeedBack_View,PayPalPaymentView

router.register('FeedBack_View',FeedBack_View , basename='FeedBack_View')
router.register('Job_View',Job_View , basename='Job_View')
router.register('Bidding_View_Data',Bidding_View_Data , basename='Bidding_View_Data')
router.register('BiddingData',BiddingData , basename='BiddingData')
router.register('OrderView',OrderView1 , basename='Contact2')
router.register('ProductNew',Product_Add_New , basename='Contact')
router.register('Category_APi',Category_APi , basename='Category_APi')
router.register('Area_APi',Area_APi , basename='Area_APi')
router.register('SignData',SignData , basename='SignData')

urlpatterns = [
    path('payment/', PayPalPaymentView.as_view(), name='paypal-payment'),
    path('OrderView/', OrderView.as_view(), name='OrderView'),
    path('Signup/', SignupAPIView.as_view(), name='Signup'),
    path('Login/', LoginAPIView.as_view(), name='Login'),
    path('Product_Add/', Product_Add.as_view(), name='Product_Add'),
    path('cart_view/', CartView.as_view(), name='cart_view'),
    path('users/<str:email>/', UserDetailAPIView.as_view(), name='user-detail'),
    path('verify-email/', EmailVerificationAPIView.as_view(), name='verify_email'),
    path('order/',include(router.urls)), 
]