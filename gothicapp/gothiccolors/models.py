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
    title = models.CharField(max_length=150)
    author = models.CharField(max_length=50)
    year = models.IntegerField()
    period = models.CharField(choices=PERIOD_CHOICES, max_length=30)
    mode = models.CharField(choices=MODE_CHOICES, max_length=30)
    genre = models.CharField(choices=GENRE_CHOICES, max_length=30)
    nationality = models.CharField(choices=NATIONALITY_CHOICES, max_length=30)
    pseudonym = models.CharField(max_length=75, null=True)
    role = models.CharField(choices=ROLE_CHOICES, max_length=30)
    authority = models.CharField(max_length=150, null=True)
    filename = models.CharField(max_length=150)
    full_text_source = models.URLField(null=True)
    illustrator = models.CharField(max_length=75, null=True)
    translator = models.CharField(max_length=75, null=True)
    ebook_source = models.URLField()
    wikipedia = models.URLField(null=True)
    notes = models.CharField(max_length=250, null=True)
    etext_publisher = models.CharField(max_length=75, null=True)
    ebook_num = models.CharField(max_length=15)
    etext_pub_date = models.DateField(null=True)
    date_accessed = models.DateField()
    editor = models.CharField(max_length=50)
    edition = models.IntegerField()
    date_added = models.DateField(auto_now_add=True)
    cover_art = models.URLField(null=True)
    color_data = JSONField()

    def __str__(self):
        return self.title
