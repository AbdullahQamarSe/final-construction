from django.contrib import admin
from .models import signup, product, cart, Order_Now, Category, Area, Bidding, Bidding_View, Job, FeedBack


@admin.register(signup)
class SignupAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'address', 'select_area', 'UserType', 'Shop_name', 'Phone')
    search_fields = ('email', 'name', 'address', 'Shop_name', 'Phone')


@admin.register(product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('productName', 'quantity', 'productCode', 'description', 'price', 'category', 'vemail')
    search_fields = ('productName', 'productCode', 'category')


@admin.register(cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('useremail', 'price', 'productcode', 'productName', 'quantity', 'vemail')
    search_fields = ('useremail', 'productcode', 'productName')


@admin.register(Order_Now)
class OrderNowAdmin(admin.ModelAdmin):
    list_display = ('email', 'get_product_names', 'get_product_prices', 'get_product_quantities', 'get_product_codes', 'vemail', 'date', 'status')
    list_filter = ('status',)
    search_fields = ('email', 'vemail')

    def get_product_names(self, obj):
        return ", ".join(obj.productName)
    get_product_names.short_description = 'Product Names'

    def get_product_prices(self, obj):
        return ", ".join(obj.price)
    get_product_prices.short_description = 'Prices'

    def get_product_quantities(self, obj):
        return ", ".join(obj.quantity)
    get_product_quantities.short_description = 'Quantities'

    def get_product_codes(self, obj):
        return ", ".join(obj.code)
    get_product_codes.short_description = 'Product Codes'


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('Category', 'CategoryDes')


@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    list_display = ('Area',)


@admin.register(Bidding)
class BiddingAdmin(admin.ModelAdmin):
    list_display = ('Title', 'Price', 'Description', 'email', 'identity')


@admin.register(Bidding_View)
class BiddingViewAdmin(admin.ModelAdmin):
    list_display = ('identity', 'Message', 'email', 'Phone')


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('Title', 'Phone')


@admin.register(FeedBack)
class FeedBackAdmin(admin.ModelAdmin):
    list_display = ('email_vendors', 'email_customer', 'drop_down', 'message')
    search_fields = ('email_vendors', 'email_customer', 'drop_down')


