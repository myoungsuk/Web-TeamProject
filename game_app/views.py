from django.shortcuts import render

from game_app.models import MyModel


# Create your views here.
def index(request):
    return render(request, 'game_app/index.html')

def my_view(request):
    obj = MyModel.objects.get(id=1)
    return render(request, 'game_app/index.html', {'obj': obj})


def game1(request):
    return render(request, 'game_app/game1.html')
def game2(request):
    return render(request, 'game_app/game2.html')
def game3(request):
    return render(request, 'game_app/game3.html')
def game4(request):
    return render(request, 'game_app/game4.html')
def game5(request):
    return render(request, 'game_app/game5.html')
def game6(request):
    return render(request, 'game_app/game6.html')

