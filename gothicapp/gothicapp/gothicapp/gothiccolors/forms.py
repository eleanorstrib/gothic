
from django import forms
from .models import Corpus

class SearchForm(forms.Form):
    PARAMETER_CHOICES = (
        ('Author', 'author'),
        ('Mode', 'mode'),
        ('Nationality', 'nationality'),
        ('Period', 'period'),
        ('Role', 'role'),
        ('Title', 'title'),
    )
    AUTHOR_CHOICES = Corpus.objects.filter(author)
    parameter = forms.CharField(choices=PARAMETER_CHOICES, max_length=20)
    # author = forms.CharField(choices=Corpus.)
