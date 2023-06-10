from django.urls import path, include
from . import views


app_name = 'main_app'

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.login, name="login"),
    path('createAccount', views.createAccount, name='createAccount'),
]

