from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^results_shelley/$', views.results_shelley, name='results_shelley'),
]
