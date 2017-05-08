import json
from django.shortcuts import render
from .models import Corpus, Color


def home(request):
    return render(request, 'gothiccolors/home.html', {})

def results_shelley(request):
    colors = Color.objects.all()
    corpora = Corpus.objects.filter(author="Shelley, Mary")
    data = []
    for i in range(0, len(corpora)):
        title = corpora[i].title
        color_list = json.loads(corpora[i].color_list)
        print(type(color_list))
        title = {}
        title['author'] = corpora[i].author
        title['year'] = corpora[i].year
        title['mode'] = corpora[i].mode
        title['nationality'] = corpora[i].nationality
        title['genre'] = corpora[i].genre
        title['role'] = corpora[i].role
        title['color_list'] = []

        for color in color_list:
            color_data = colors.filter(name=color)
            hex_name = color_data.first().hex_name
            family = color_data.first().family
            title['color_list'] = title['color_list'].append((color, hex_name, family))
        print (title)
    # color_data = {}
    # for i in range(0, len(corpora)):
    #     title = corpora[i].title
    #     print(title)
    #     color_data[title] = {}
    #     data = json.loads(corpora[i].color_list) # list of ordered color words
    #     for color in data:
    #

    #
    #         color_data[title][color] = [color, hex_name, year]
    #         print(title, color_data[title])
            # # sub dicts for each title: keys are color words, values are object from db
            # color_data[title][color] = [hex_name]
            # print(title, color, color_data[title][color])

    return render(request, 'gothiccolors/results_shelley.html', {'data': data})
