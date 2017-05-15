
from django import forms
from gothiccolors.models import Corpus

class PeriodSearchForm(forms.ModelForm):
    class Meta:
        model = Corpus
        fields = ('period',)
