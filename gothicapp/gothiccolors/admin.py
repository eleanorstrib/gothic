from django.contrib import admin
from gothiccolors.models import Corpus, Color

admin.register(Corpus, Color)(admin.ModelAdmin)
