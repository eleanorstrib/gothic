import csv


def get_color_words():
    """
    Gets color words from the csv file and puts them into a list.
    """
    color_word_list = []
    color_data = csv.reader(open('./color_names.csv'), delimiter=",", quotechar='"')

    for row in color_data:
        if row[0] != "Colour Name":
            color_word_list.append(row[0].lower())

    return color_word_list


def get_corpus_filenames():
    """
    Gets corpus file names from csv and puts them into a list.
    """
    corpus_file_list = []
    corpus_files = csv.reader(open('./gothic_text_data.csv'), delimiter=",", quotechar='"')

    for row in corpus_files:
        if row[0] != "Title":
            corpus_file_list.append(row[14])
    return corpus_file_list
