from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import Owner


class OwnerRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Owner
        fields = ('id', 'full_name', 'email', 'phone', 'password', 'confirm_password', 'whatsapp')

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})

        validate_password(password)

        email = attrs.get('email')
        if Owner.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': 'A user with that email already exists.'})

        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        password = validated_data.pop('password')
        return Owner.objects.create_user(password=password, **validated_data)


class OwnerLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(request=self.context.get('request'), email=attrs['email'], password=attrs['password'])
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('This account is inactive.')
        return {'user': user}


class OwnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = ('id', 'full_name', 'email', 'phone', 'whatsapp', 'profile_image')
        read_only_fields = ('id', 'email')
