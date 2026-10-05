from django.conf import settings
from django.db import models


class Car(models.Model):
    AVAILABILITY_CHOICES = [
        ('Available', 'Available'),
        ('Unavailable', 'Unavailable'),
    ]

    TRANSMISSION_CHOICES = [
        ('Automatic', 'Automatic'),
        ('Manual', 'Manual'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cars')
    title = models.CharField(max_length=200)
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    registration_number = models.CharField(max_length=60)
    price_per_day = models.DecimalField(max_digits=12, decimal_places=2)
    location = models.CharField(max_length=120)
    transmission = models.CharField(max_length=20, choices=TRANSMISSION_CHOICES)
    fuel_type = models.CharField(max_length=50)
    seats = models.PositiveIntegerField()
    description = models.TextField()
    image = models.ImageField(upload_to='cars/main/', blank=True, null=True)
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default='Available')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class CarImage(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='gallery')
    image = models.ImageField(upload_to='cars/gallery/')

    def __str__(self):
        return f'{self.car.title} image'
