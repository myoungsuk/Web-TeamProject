from django.urls import path
from . import views


app_name = 'album_app'

urlpatterns = [
    path('', views.album, name='album')
]
