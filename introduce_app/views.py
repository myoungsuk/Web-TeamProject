from django.shortcuts import render

# Create your views here.
def introduce(request):
    return render(request, 'introduce_app/introduce.html')

def login(request):
    return render(request, 'introduce_app/login.html')

def createAccount(request):
    return render(request, 'introduce_app/createAccount.html')
