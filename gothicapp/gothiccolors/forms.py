
from django import forms
from gothiccolors.models import Corpus

class AuthorSearchForm(forms.ModelForm):
    class Meta:
        model = Corpus
        fields = ('author',)
