from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path('ws/details/device_<int:pk>/', consumers.CNCConsumer),
]
