import json
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
    temp_list = ['snow', 'straw', 'blue', 'natural', 'natural', 'natural', 'natural', 'white', 'natural', 'natural', 'natural', 'natural', 'natural', 'natural', 'black', 'natural', 'natural', 'natural', 'natural', 'natural', 'natural', 'natural', 'yellow', 'yellow', 'black', 'pearly', 'black', 'livid', 'yellow', 'white', 'black', 'blue', 'blue', 'rosy', 'natural', 'natural', 'natural', 'verdant', 'black', 'blue', 'pitchy', 'black', 'white', 'snowy', 'imperial', 'natural', 'white', 'white', 'white', 'black', 'black', 'raven', 'black', 'black', 'green', 'red', 'green', 'straw', 'blue', 'golden', 'black', 'green', 'black', 'verdant', 'white', 'natural', 'natural', 'green', 'white', 'natural', 'stony', 'angry', 'black', 'black', 'black', 'blue', 'black', 'yellow', 'angry', 'green', 'blue', 'black', 'white', 'blue', 'sunny', 'wan', 'white']
    colors = []
    for item in temp_list:
        data = Color.objects.filter(name=item)
        colors.append(data[0].hex_name)
    print (colors)


    return render(request, 'gothiccolors/results_shelley.html', {'data': corpora, 'colors': colors})
