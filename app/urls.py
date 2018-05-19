from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('overview', views.overview, name='overview'),
    path('details/<int:pk>', views.details, name='details'),
]
