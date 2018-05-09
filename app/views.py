from django.shortcuts import render


def index(request):
    return render(request, 'app/index.html', {})


def other_html(request):
    return render(request, 'app/' + request.path.split('/')[-2], {})
