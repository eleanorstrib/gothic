"""
Modifying test code to run, populate database
"""

import string
import nltk
from collections import defaultdict
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from color_corpus_lists import get_color_words, get_corpus_filenames


def tokenize_text(filename):
    """
    This function generates a list of tokens with punctuation
    and spaces removed for the whole text.
    """
    text_tokens = []
    if filename != '':
        file_path = "../corpora/" + filename
        try:
            text = open(file_path)
            for row in text:
                tokens = word_tokenize(row)# splits string
                # puts everything in lowercase, removes punctuation
                tokens = [token.lower() for token in tokens if token not in string.punctuation]
                # adds row tokens to master list
                text_tokens.extend(tokens)
        except:
            print("can't open", filename)
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
    creates and returns lists of dicts for each noun and adjective.
    """
    text_dict_list = []
    # seperates tags into tuples in format ( word, tag)
    tagged_text =  nltk.pos_tag(tokens)
    # loop through, determine word type, add position
    for pos, item in enumerate(tagged_text):
        if item[1][0] == 'N':
            new_dict = {}
            new_dict[item[0]]= {}
            new_dict[item[0]]['position'] = pos
            new_dict[item[0]]['type'] = 'noun'
            text_dict_list.append(new_dict)
        if item[1][0] == 'J':
            new_dict = {}
            new_dict[item[0]] = {}
            new_dict[item[0]]['position'] = pos
            new_dict[item[0]]['type'] = 'adjective'
            text_dict_list.append(new_dict)
    print(text_dict_list)
    return text_dict_list


def color_filter(text_dict_list, color_word_list):
    """
    Takes the list of dicts from each text, compares the key in each dict to the
    color list, appends to final list if there is a match.
    """
    color_words_filtered = []
    lemmatizer = WordNetLemmatizer()
    for word in text_dict_list:
        lemmatized_word = lemmatizer.lemmatize(list(word.keys())[0])
        print(lemmatized_word)
        if lemmatized_word in color_word_list:
            color_words_filtered.append(word)
    print(color_words_filtered)
    return color_words_filtered


def get_context(tokens, color_words_filtered):
    for item in color_words_filtered:
        color = item[list(item.keys())[0]]
        word_num = color['position']
        context = ' '.join(tokens[(word_num-10):(word_num+10)])
        color['context'] = context
    print(color_words_filtered)
    return color_words_filtered



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
    corpus_file_list = ["ShelleyMary_Frankenstein_Gutenberg.txt"]
    # get_corpus_filenames()
    for filename in corpus_file_list:
        tokens = tokenize_text(filename)
        text_dict_list = word_type(tokens) # list of dicts for every noun, adjective
        color_words_filtered = color_filter(text_dict_list, color_word_list)
        get_context(tokens, color_words_filtered)
    # color_nouns = color_filter(nouns, color_words)
    # color_adj = color_filter(adjectives, color_words)
    # print("Color nouns", color_nouns)
    # print("Color adjectives", color_adj)
    # print(color_list(color_adj))
    # print(collapse_colors(color_filter(adjectives, color_words)))

if __name__ == "__main__":
    main()
