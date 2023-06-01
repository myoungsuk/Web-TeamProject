from django.urls import path
from . import views


app_name = 'introduce_app'

urlpatterns = [
    path('', views.introduce, name='introduce')
]
