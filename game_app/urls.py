from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views

app_name = 'game_app'

urlpatterns = [
    path('', views.index, name='index'),
    path('game1', views.game1, name='game1'),
    path('game2', views.game2, name='game2'),
    path('game3', views.game3, name='game3'),
    path('game4', views.game4, name='game4'),
    path('game5', views.game5, name='game5'),
    path('game6', views.game6, name='game6'),
    path('login', auth_views.LoginView.as_view(template_name ='game_app/login.html'), name ='login'),
    path('logout', auth_views.LogoutView.as_view(), name = 'logout'),
    # path('login_django', views.login_django, name='login_django'),
    # path('login_success', views.login_success, name='login_success'),
]

if settings.DEBUG: # new
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)