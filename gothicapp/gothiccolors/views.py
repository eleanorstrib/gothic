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
    for corpus in corpora:
        color_dict_convert = corpus.color_dict.replace("'", "\"")
        color_dict_update = json.loads(color_dict_convert)
        corpus.color_dict = color_dict_update
        print(type(corpus.color_dict))
        print(type(color_dict_update))

    return render(request, 'gothiccolors/results_shelley.html', {'data': corpora})
