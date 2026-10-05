from django.contrib.auth import login, logout
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Owner
from .serializers import OwnerLoginSerializer, OwnerProfileSerializer, OwnerRegistrationSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register_owner(request):
    serializer = OwnerRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'Owner registered successfully.',
            'user': {
                'id': user.id,
                'full_name': user.full_name,
                'email': user.email,
                'phone': user.phone,
                'whatsapp': user.whatsapp,
            },
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_owner(request):
    serializer = OwnerLoginSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        return Response({
            'message': 'Login successful.',
            'user': {
                'id': user.id,
                'full_name': user.full_name,
                'email': user.email,
                'phone': user.phone,
                'whatsapp': user.whatsapp,
            },
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_owner(request):
    logout(request)
    return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    if request.method == 'GET':
        serializer = OwnerProfileSerializer(request.user)
        return Response(serializer.data)

    serializer = OwnerProfileSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
