import json
from django.shortcuts import render
from .models import Corpus, Color


def home(request):
    return render(request, 'gothiccolors/home.html', {})

def results_shelley(request):
    colors = Color.objects.all()
    corpora = Corpus.objects.filter(author="Stoker, Bram")
    data = []
    for i in range(0, len(corpora)):
        title = corpora[i].title
        title = {}
        color_list = json.loads(corpora[i].color_list)

        title['name'] = corpora[i].title # using the title var creates a circular reference
        title['author'] = corpora[i].author
        title['year'] = corpora[i].year
        title['mode'] = corpora[i].mode
        title['nationality'] = corpora[i].nationality
        title['role'] = corpora[i].role
        title['color_dict'] = json.loads(corpora[i].color_dict)
        title['color_list'] = []

        data_list = []
        for color in color_list:
            color_data = colors.filter(name=color)
            hex_name = color_data.first().hex_name
            family = color_data.first().family
            data_list.append((color, hex_name, family))

        title['color_list'] = data_list
        data.append(title)

    return render(request, 'gothiccolors/results_shelley.html', {'data': data})
