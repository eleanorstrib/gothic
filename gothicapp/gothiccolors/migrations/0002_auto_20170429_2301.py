# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-29 23:01
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('gothiccolors', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='corpus',
            name='color_data',
            field=django.contrib.postgres.fields.jsonb.JSONField(null=True),
        ),
    ]