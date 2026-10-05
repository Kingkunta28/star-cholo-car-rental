from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from accounts.models import Owner
from .models import Car, CarImage
from .serializers import CarSerializer


class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.select_related('owner').prefetch_related('gallery').all()
    serializer_class = CarSerializer

    def get_permissions(self):
        return [AllowAny()]

    def get_queryset(self):
        queryset = Car.objects.select_related('owner').prefetch_related('gallery').all()

        if self.action == 'list':
            queryset = queryset.filter(availability='Available')

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(make__icontains=search)
                | Q(model__icontains=search)
                | Q(location__icontains=search)
            )

        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)

        make = self.request.query_params.get('make')
        if make:
            queryset = queryset.filter(make__icontains=make)

        model = self.request.query_params.get('model')
        if model:
            queryset = queryset.filter(model__icontains=model)

        max_price = self.request.query_params.get('max_price')
        if max_price:
            queryset = queryset.filter(price_per_day__lte=max_price)

        transmission = self.request.query_params.get('transmission')
        if transmission:
            queryset = queryset.filter(transmission=transmission)

        fuel_type = self.request.query_params.get('fuel_type')
        if fuel_type:
            queryset = queryset.filter(fuel_type__icontains=fuel_type)

        seats = self.request.query_params.get('seats')
        if seats:
            queryset = queryset.filter(seats=seats)

        availability = self.request.query_params.get('availability')
        if availability:
            queryset = queryset.filter(availability=availability)

        return queryset

    def perform_create(self, serializer):
        owner = self.request.user if self.request.user.is_authenticated else Owner.objects.order_by('id').first()
        if owner is None:
            owner = Owner.objects.create_user(
                email='default-owner@local.test',
                password='admin123456',
                full_name='Default Owner',
                phone='0000000000',
            )
        serializer.save(owner=owner)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def my_cars(self, request):
        cars = self.get_queryset().filter(owner=request.user) if request.user.is_authenticated else self.get_queryset()[:10]
        serializer = self.get_serializer(cars, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def add_gallery_image(self, request, pk=None):
        car = self.get_object()
        image = request.FILES.get('image')
        if not image:
            return Response({'detail': 'Image is required.'}, status=status.HTTP_400_BAD_REQUEST)
        car_image = CarImage.objects.create(car=car, image=image)
        return Response({'id': car_image.id, 'image': request.build_absolute_uri(car_image.image.url)}, status=status.HTTP_201_CREATED)
