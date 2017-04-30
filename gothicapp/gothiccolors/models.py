from django.db import models
from django.contrib.postgres.fields import JSONField


class Corpus(models.Model):
    GENRE_CHOICES = (
        ('Ballad', 'Ballad'),
        ('Tragedy', 'Tragedy'),
    )
    MODE_CHOICES = (
        ('Drama', 'Drama'),
        ('Fragment', 'Fragment'),
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
        ('Pre-Romantic', 'Pre-Romantic'),
        ('Romantic', 'Romantic'),
        ('Victorian', 'Victorian'),
    )
    ROLE_CHOICES = (
        ('Central', 'Central'),
        ('Influence', 'Influence'),
        ('Peripheral', 'Peripheral'),
    )
    title = models.CharField(max_length=400)
    author = models.CharField(max_length=300)
    year = models.IntegerField(null=True, blank=True)
    period = models.CharField(choices=PERIOD_CHOICES, max_length=30)
    mode = models.CharField(choices=MODE_CHOICES, max_length=30)
    genre = models.CharField(choices=GENRE_CHOICES, max_length=30)
    nationality = models.CharField(choices=NATIONALITY_CHOICES, max_length=30)
    pseudonym = models.CharField(max_length=75, null=True, blank=True)
    role = models.CharField(choices=ROLE_CHOICES, max_length=30)
    authority = models.CharField(max_length=150, null=True, blank=True)
    filename = models.CharField(max_length=150)
    full_text_source = models.URLField(null=True, blank=True)
    illustrator = models.CharField(null=True, blank=True, max_length=300)
    translator = models.CharField(null=True, blank=True, max_length=300)
    ebook_source = models.URLField(null=True, blank=True)
    more_info = models.URLField(null=True, blank=True)
    notes = models.CharField(null=True, blank=True, max_length=1000)
    etext_publisher = models.CharField(null=True, blank=True, max_length=200)
    ebook_num = models.CharField(max_length=300)
    etext_pub_date = models.CharField(null=True, blank=True, max_length=30)
    date_accessed = models.CharField(null=True, blank=True, max_length=30)
    editor = models.CharField(null=True, blank=True,max_length=300)
    edition = models.CharField(null=True, blank=True,max_length=300)
    date_added = models.DateField(auto_now_add=True)
    cover_art = models.URLField(null=True, blank=True)
    color_data = JSONField(null=True, blank=True)

    def __str__(self):
        return self.title
