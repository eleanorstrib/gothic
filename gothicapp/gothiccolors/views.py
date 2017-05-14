from collections import Counter
import json
import nltk
import operator
from nltk.stem import WordNetLemmatizer
from django.shortcuts import render
from .models import Corpus, Color


def home(request):
    return render(request, 'gothiccolors/home.html', {})

def results(request):
    colors = Color.objects.all()
    corpora = Corpus.objects.filter(period="Victorian")
    data = []
    color_big_list = []

    for i in range(0, len(corpora)):
        if corpora[i].color_list != "[]":
            new_dict = {}
            cd = json.loads(corpora[i].color_dict)
            cd_list = sorted(cd.items(), key=operator.itemgetter(1), reverse=True)
            new_dict['cd'] = cd_list
            cl = json.loads(corpora[i].color_list)
            color_big_list.extend([item[0] for item in cl])
            new_dict['cl'] = cl
            new_dict['title'] = corpora[i].title
            new_dict['author'] = corpora[i].author
            new_dict['year'] = corpora[i].year
            new_dict['mode'] = corpora[i].mode
            new_dict['nationality'] = corpora[i].nationality
            new_dict['period'] = corpora[i].period
            new_dict['role'] = corpora[i].role
            new_dict['word_count'] = corpora[i].word_count
            new_dict['pct_color'] = (len(cl)/(corpora[i].word_count))*100


            for color in new_dict['cl']:
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
            data.append(new_dict)

            # summary data
            num_records = len(corpora)
            list_pct_color_words = [item['pct_color'] for item in data]
            avg_pct_color = (sum(list_pct_color_words)/num_records)
            most_used_color_words = ((Counter(color_big_list)).most_common())[0:10]


    return render(request, 'gothiccolors/results.html', {'data': data, 'avg_pct_color': avg_pct_color, 'most_used_color_words': most_used_color_words})
