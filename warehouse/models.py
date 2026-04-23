from django.db import models
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='categories')

    class Meta:
        verbose_name_plural = "Categories"
        unique_together = ['name', 'user']

    def __str__(self):
        return self.name

class Product(models.Model):
    sku = models.CharField("Артикул", max_length=50, unique=True)
    name = models.CharField("Наименование", max_length=200)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    quantity = models.PositiveIntegerField("Количество на складе", default=0)
    price = models.DecimalField("Цена закупки (за шт)", max_digits=10, decimal_places=2, null=True, blank=True)
    min_stock_level = models.PositiveIntegerField("Мин. остаток", default=5)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='products')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.sku})"

    @property
    def total_value(self):
        """Общая стоимость позиции на складе"""
        if self.price is None:
            return 0
        return self.quantity * self.price

    @property
    def is_low_stock(self):
        """Флаг: пора заказывать?"""
        return self.quantity <= self.min_stock_level