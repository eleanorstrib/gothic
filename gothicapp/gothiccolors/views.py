from collections import Counter
import json
import nltk
import operator

from nltk.stem import WordNetLemmatizer
from django.shortcuts import render
# from django.utils.safestring import mark_safe
from django.http import HttpResponseRedirect
from django import forms
from .forms import AuthorSearchForm
from .models import Corpus, Color


def home(request):
    if request.method == 'GET':
        form = AuthorSearchForm(request.GET)
        authors = set(Corpus.objects.values_list('author', flat=True).order_by('author'))
        AuthorSearchForm.base_fields['author'] = forms.ModelChoiceField(
                queryset=Corpus.objects.values_list('author',flat=True).exclude(filename__exact='').distinct().order_by('author')
                )
    else:
        form = AuthorSearchForm()
    return render(request, 'gothiccolors/home.html', {'form': form, 'authors': authors})

def results(request):
    if request.method == 'GET':
        user_author_search = request.GET.get('author', '')
        colors = Color.objects.all()
        corpora = Corpus.objects.filter(author=user_author_search)
        data = []
        color_big_list = []
        lemmatizer = WordNetLemmatizer()

        for i in range(0, len(corpora)):
            if corpora[i].color_list != "[]" and corpora[i].color_dict != {}:
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
                new_dict['pct_color'] = len(cl)/(int(corpora[i].word_count))*100


                for color in new_dict['cl']:
                    color_name = color[0]
                    color_name_lemm = lemmatizer.lemmatize(color_name)
                    color_data = colors.filter(name=color_name_lemm)[0]
                    color.append(color_data.hex_name)
                    color.append(color_data.family)

                data.append(new_dict)

        # summary data
        num_records = len(corpora)
        list_pct_color_words = [item['pct_color'] for item in data]
        avg_pct_color = (sum(list_pct_color_words)/num_records)
        most_used_color_words = ((Counter(color_big_list)).most_common())[0:10]
        chart_labels = [value[0] for value in most_used_color_words]
        chart_values = [value[1] for value in most_used_color_words]

        chart_hex = []
        for value in chart_labels:
            try:
                hex_value = colors.filter(name=value)[0].hex_name
            except:
                hex_value = colors.filter(name=lemmatizer.lemmatize(value))[0].hex_name
            chart_hex.append(hex_value)

        return render(request, 'gothiccolors/results.html', {
                'data': data, 'avg_pct_color': avg_pct_color,
                'most_used_color_words': most_used_color_words,
                'chart_labels': json.dumps(chart_labels),
                'chart_values': chart_values,
                'chart_hex': json.dumps(chart_hex),
                'user_author_search': user_author_search, })
    else:
        return HttpResponseRedirect("There was an error. Please try again.")
