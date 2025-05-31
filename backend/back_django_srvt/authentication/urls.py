from django.urls import path
from . import views

app_name = 'authentication'

urlpatterns = [
    path('', views.home, name='login'),
    path("logout", views.logout_view),
]