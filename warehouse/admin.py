from django.contrib import admin
from .models import Category, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'user']
    list_filter = ['user']
    search_fields = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['sku', 'name', 'category', 'quantity', 'price', 'min_stock_level', 'user']
    list_filter = ['category', 'user']
    search_fields = ['sku', 'name']
    readonly_fields = ['created_at', 'updated_at']