import django
from django.conf import settings
import csv
data_reader = csv.reader(open('./color_names.csv'), delimiter=",", quotechar='"')

import sys, os
sys.path.append('/Users/eleanorstrib/Documents/dev_projects/gothic_colors/gothicapp/')
os.environ['DJANGO_SETTINGS_MODULE'] = 'gothicapp.settings'

django.setup()
from gothiccolors.models import Color


for row in data_reader:
    if row[0] != 'Colour Name': #skip header row
        color = Color()  # instantiate the class
        color.name = row[0]
        color.year_first_used = row[1]
        color.family = row[2] # date in spreadhsheet
        color.hex_name = row[3]
        color.url_value= row[4]
        color.save()
        print("this record was saved: ", color.name)
    else:
        print('skipping row')
print("done")
