from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^results/$', views.results, name='results'),
    url(r'^all_colors/$', views.all_colors, name='all_colors'),
]
