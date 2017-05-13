from collections import Counter
import json
import nltk
from nltk.stem import WordNetLemmatizer
from django.shortcuts import render
from .models import Corpus, Color


def home(request):
    return render(request, 'gothiccolors/home.html', {})

def results(request):
    colors = Color.objects.all()
    corpora = Corpus.objects.all()
    data = []

    for i in range(0, len(corpora)):
        if corpora[i].color_list != "[]":
            new_dict = {}
            name = corpora[i].title
            new_dict[name] = {}
            cd = Counter(json.loads(corpora[i].color_dict))
            new_dict[name]['cd'] = cd
            cl = json.loads(corpora[i].color_list)
            new_dict[name]['cl'] = cl

            new_dict[name]['author'] = corpora[i].author
            new_dict[name]['year'] = corpora[i].year
            new_dict[name]['mode'] = corpora[i].mode
            new_dict[name]['nationality'] = corpora[i].nationality
            new_dict[name]['role'] = corpora[i].role

            for color in new_dict[name]['cl']:
                color_name = color[0]
                try:
                    color_data = colors.filter(name=color_name)[0]
                    color.append(color_data.hex_name)
                    color.append(color_data.family)
                except:
                    lemmatizer = WordNetLemmatizer()
                    color_name = lemmatizer.lemmatize(color_name)
                    if colors.filter(name=color_name)[0]:
                        color.append(color_data.hex_name)
                        color.append(color_data.family)
            print(new_dict)
    data.append(new_dict)
    return render(request, 'gothiccolors/results.html', {'data': data})
