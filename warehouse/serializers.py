from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
        read_only_fields = ['user']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    total_value = serializers.ReadOnlyField()
    is_low_stock = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'sku', 'name', 'category', 'category_name',
            'quantity', 'price', 'min_stock_level',
            'total_value', 'is_low_stock',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

class ProductListSerializer(serializers.ModelSerializer):
    """Упрощённый сериализатор для списка (без created_at и updated_at)"""
    category_name = serializers.ReadOnlyField(source='category.name')
    total_value = serializers.ReadOnlyField()
    is_low_stock = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'sku', 'name', 'category', 'category_name',
            'quantity', 'price', 'min_stock_level',
            'total_value', 'is_low_stock'
        ]