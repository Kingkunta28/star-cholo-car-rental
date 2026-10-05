from rest_framework import serializers

from .models import Car, CarImage


class CarImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarImage
        fields = ('id', 'image')


class CarSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()
    gallery = CarImageSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Car
        fields = (
            'id', 'owner', 'title', 'make', 'model', 'year', 'registration_number', 'price_per_day',
            'location', 'transmission', 'fuel_type', 'seats', 'description', 'image', 'image_url',
            'availability', 'gallery', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'owner', 'created_at', 'updated_at')

    def get_owner(self, obj):
        return {
            'id': obj.owner.id,
            'full_name': obj.owner.full_name,
            'email': obj.owner.email,
            'phone': obj.owner.phone,
            'whatsapp': obj.owner.whatsapp,
        }

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None
