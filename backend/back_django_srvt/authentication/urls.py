from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='auth_login'),
    path('logout/', views.logout_view, name='auth_logout'),
    path('check/', views.check_auth, name='auth_check'),
    path('csrf/', views.csrf_token_view, name='csrf_token'),
]
