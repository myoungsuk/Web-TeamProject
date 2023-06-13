from django.shortcuts import render

# Create your views here.
def album(request):
  return render(request, 'album_app/album.html')

def login(request):
    return render(request, 'album_app/login.html')


def createAccount(request):
  return render(request, 'album_app/createAccount.html')
