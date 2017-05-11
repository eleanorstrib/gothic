"""
Modifying test code to run, populate database
"""

import string
import nltk
import csv
from collections import defaultdict
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer


def get_color_words():
    """
    Gets color words from the csv file.
    """
    color_word_list = []
    color_data = csv.reader(open('./color_names.csv'), delimiter=",", quotechar='"')

    for row in color_data:
        if row[0] != "Colour Name":
            print (row[0].lower())
            color_word_list.append(row[0].lower())

    return color_word_list

def tokenize_text():
    """
    This function generates a list of tokens with punctuation
    and spaces removed for the whole text
    """
    text_tokens = []
    # open and read file
<<<<<<< HEAD
    text = open("./gothicapp/corpora/Polidori_TheVampyre_Gutenberg.txt")
=======
    text = "Brown was the color of her hair."
>>>>>>> 0ef0986c1acc1bbe7d9f6de349be5690cdd11eef
    for row in text:
        tokens = word_tokenize(row)# splits string
        # puts everything in lowercase, removes punctuation
        tokens = [token.lower() for token in tokens if token not in string.punctuation]
        # adds row tokens to master list
        text_tokens.extend(tokens)
    return text_tokens


def word_count(tokens):
    """
    Counts the words in the text, excluding punctuation and spaces.
    To be used with visualizations.
    """
    words = len(tokens)
    return words


def word_type(tokens):
    """
    Classifies the words in the corpus into types (e.g. noun, verb, etc.), then
    creates and returns lists of the nouns and adjectives.
    """
    nouns = []
    adjectives  = []
    counter = 0
    # seperates tags into tuples in format ( word, tag)
    tagged_text =  nltk.pos_tag(tokens)
    # loop through, determine word type, add position
    for pos, item in enumerate(tagged_text):
        try:
            if item[1][0] == 'N':
                nouns.append((item[0], pos))
            if item[1][0] == 'J':
                adjectives.append((item[0], pos))
        except:
            print('exception from', item)
    return nouns, adjectives


def color_filter(typed_list, color_word_list):
    """
    Takes the tokenized list, lemmatizes the words, and determines if the root
    word is in the color word list.
    """
    filtered = []
    lemmatizer = WordNetLemmatizer()
    for item in typed_list:
        lemmatized_word = lemmatizer.lemmatize(item[0])
        if lemmatized_word in color_word_list:
            filtered.append(item)
    return filtered

def color_list(color_adjectives):
    """
    Returns an ordered list of color words
    """
    word_only_list = []
    for item in color_adjectives:
        word_only_list.append(item[0])
    return word_only_list


def collapse_colors(word_list):
    """
    Removes position, returns colors with count of occurrances.
    """
    color_dict_collapsed = {}
    for item in word_list:
        color_dict_collapsed[item[0]] = color_dict_collapsed.get(item[0], 0) + 1
    return color_dict_collapsed


def main():
    color_word_list = get_color_words()
    tokens = tokenize_text()
    print(word_count(tokens))
    nouns, adjectives, verbs = word_type(tokens)
    color_nouns = color_filter(nouns, color_word_list)
    color_adj = color_filter(adjectives, color_word_list)
    print("Color nouns", color_nouns)
    print("Color adjectives", color_adj)
    print(collapse_colors(color_filter(nouns, color_word_list)))
    print(collapse_colors(color_filter(adjectives, color_word_list)))

if __name__ == "__main__":
    main()
