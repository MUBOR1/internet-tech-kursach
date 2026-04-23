from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, Q, F  # ← Добавь F здесь
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer, ProductListSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    """API для категорий"""
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']
    ordering = ['name']

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ProductViewSet(viewsets.ModelViewSet):
    """API для товаров на складе"""
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'sku']
    ordering_fields = ['name', 'quantity', 'price', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Product.objects.filter(user=self.request.user).select_related('category')
        
        # Фильтр по категории
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # Фильтр по признаку "мало осталось"
        low_stock = self.request.query_params.get('low_stock')
        if low_stock and low_stock.lower() == 'true':
            queryset = queryset.filter(quantity__lte=F('min_stock_level'))
        
        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Статистика склада"""
        products = self.get_queryset()
        
        total_products = products.count()
        total_quantity = products.aggregate(total=Sum('quantity'))['total'] or 0
        total_value = sum(p.total_value for p in products)
        low_stock_count = products.filter(quantity__lte=F('min_stock_level')).count()
        
        # Товары с низким остатком
        low_stock_items = products.filter(quantity__lte=F('min_stock_level'))[:5]
        low_stock_data = ProductListSerializer(low_stock_items, many=True).data
        
        # По категориям
        categories_stats = []
        categories = Category.objects.filter(user=request.user)
        for cat in categories:
            cat_products = products.filter(category=cat)
            if cat_products.exists():
                categories_stats.append({
                    'category_id': cat.id,
                    'category_name': cat.name,
                    'products_count': cat_products.count(),
                    'total_quantity': cat_products.aggregate(total=Sum('quantity'))['total'] or 0,
                    'total_value': sum(p.total_value for p in cat_products)
                })
        
        return Response({
            'total_products': total_products,
            'total_quantity': total_quantity,
            'total_value': total_value,
            'low_stock_count': low_stock_count,
            'low_stock_items': low_stock_data,
            'categories_stats': categories_stats
        })