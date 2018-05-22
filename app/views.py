from django.shortcuts import render, redirect

from .models import CNC


def index(request):
    return redirect('overview')


def details(request, pk):
    cnc = CNC.objects.get(pk=pk)
    return render(request, 'app/details.html', {'cnc': cnc})


def overview(request):
    cncs = CNC.objects.all()
    return render(request, 'app/overview.html', {'cncs': cncs})
