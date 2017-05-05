from django.shortcuts import render
from .models import Corpus

def home(request):
    return render(request, 'gothiccolors/home.html', {})

def results_shelley(request):
    data = Corpus.objects.filter(author="Shelley, Mary")
    for item in data:
        print(item)
    return render(request, 'gothiccolors/results_shelley.html', {'data': data})
