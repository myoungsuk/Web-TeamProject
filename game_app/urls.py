from django.urls import path
from . import views

app_name = 'game_app'

urlpatterns = [
    path('', views.game, name='game')
    # path('login_django', views.login_django, name='login_django'),
    # path('login_success', views.login_success, name='login_success'),
]