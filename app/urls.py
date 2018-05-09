from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    re_path(r'^.*\.html', views.other_html, name='other_html')
]
