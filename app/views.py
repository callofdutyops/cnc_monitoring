from django.shortcuts import render
from .models import CNC


def index(request):
    cncs = CNC.objects.all()
    return render(request, 'app/overview.html', {'cncs': cncs})


def details(request, pk):
    return render(request, 'app/details.html', {'pk': pk})


def overview(request):
    return render(request, 'app/overview.html', {})
