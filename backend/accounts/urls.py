from django.urls import path

from .views import login_owner, logout_owner, profile_view

urlpatterns = [
    path('login/', login_owner, name='login-owner'),
    path('logout/', logout_owner, name='logout-owner'),
    path('profile/', profile_view, name='owner-profile'),
]
