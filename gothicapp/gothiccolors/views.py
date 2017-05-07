from django.shortcuts import render
from .models import Corpus, Color


def home(request):
    return render(request, 'gothiccolors/home.html', {})

def results_shelley(request):
    colors = Color.objects.all()
    color_names=[]
    for x in range(0, len(colors)):
        color_names.append(colors[x].name)
    corpora = Corpus.objects.filter(author="Shelley, Mary")

    return render(request, 'gothiccolors/results_shelley.html', {'data': corpora})
