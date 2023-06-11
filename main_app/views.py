from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'main_app/index.html')

def login(request):
    return render(request, 'main_app/login.html')

def createAccount(request):
    return render(request, 'main_app/createAccount.html')
