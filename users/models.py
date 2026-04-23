from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('manager', 'Менеджер склада'),
        ('worker', 'Кладовщик'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='worker')
    bio = models.TextField("О себе", max_length=500, blank=True, null=True)
    avatar = models.ImageField("Аватар", upload_to='avatars/', blank=True, null=True)
    
    def __str__(self):
        return self.username