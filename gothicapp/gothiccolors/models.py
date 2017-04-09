from django.db import models
from django.contrib.postgres.fields import JSONField


class Novel(Models.model):
    GENRE CHOICES = (
        (BALLAD, 'Ballad'),
        (TRAGEDY, 'Tragedy'),
    )
    MODE_CHOICES = (
        ('Drama', 'Drama'),
        ('Fragment', 'Fragment')
        ('Novel', 'Novel'),
        ('Poetry', 'Poetry'),
        ('Review', 'Review'),
        ('Serial Novel', 'Serial Novel'),
        ('Short Story', 'Short Story'),
        ('Short Story Collection', 'Short Story Collection'),
        ('Theory & Criticism', 'Theory & Criticism'),
    )
    NATIONALITY_CHOICES = (
        ('American', 'American'),
        ('Canadian', 'Canadian'),
        ('English', 'English'),
        ('French', 'French'),
        ('German', 'German'),
    )
    PERIOD_CHOICES = (
        ('Pre-Romantic', 'Pre-Romantic')
        ('Romantic', 'Romantic'),
        ('Victorian', 'Victorian'),
    )
    ROLE_CHOICES = (
        ('Central', 'Central'),
        ('Influence', 'Influence'),
        ('Peripheral', 'Peripheral'),
    )
    title = models.Charfield(max_length=150)
    author = models.Charfield(max_length=50)
    year = models.IntegerField(max_length=4)
    period = models.Charfield(choices=PERIOD_CHOICES)
    mode = models.Charfield(choices=MODE_CHOICES)
    genre = models.Charfield.(choices=GENRE_CHOICES)
    nationality = models.Charfield(choices=NATIONALITY_CHOICES)
    pseudonym = models.Charfield(max_length=75)
    role = models.Charfield(choices=ROLE_CHOICES)
    authority = models.Charfield(max_length=150)
    filename = models.Charfield(max_length=150)
    full_text_source = models.URLField()
    illustrator = models.Charfield(max_length=75)
    translator = models.Charfield(max_length=75)
    ebook_source = models.URLField()
    wikipedia = models.URLField()
    notes = models.Charfield(max_length=250)
    etext_publisher = models.Charfield(max_length=75)
    ebook_num = models.Charfield(max_length=15)
    etext_pub_date = models.IntegerField(max_length=4)
    date_accessed = models.DateField()
    editor = models.Charfield(max_length=50)
    edition = models.IntegerField(max_length=4)
    date_added = models.DateField(auto_now=True, auto_now_add=True)
    cover_art = models.URLField()
    color_data = JSONField()

    def __str__(self):
        return self.title
