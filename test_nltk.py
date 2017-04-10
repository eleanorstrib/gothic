"""
Testing basic concepts & tools before doing our main analysis.
"""

import string
from oed_color import color_words
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer


def tokenize_text():
    """
    This function generates a list of tokens with punctuation
    and spaces removed for the whole text
    """
    text_tokens = []
    # open and read file
    text = open("./corpora/ShelleyMary_Frankenstein_Gutenberg.txt")
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
    verbs = []
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
            if item[1][0] == 'V':
                verbs.append((item[0], pos))
        except:
            print('exception from', item)
    return nouns, adjectives, verbs


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

def main():
    tokens = tokenize_text()
    # word_count(tokens)
    nouns, adjectives, verbs = word_type(tokens)
    print("nouns", color_filter(nouns, color_words))
    print("adjectives", color_filter(adjectives, color_words))
    print("verbs", color_filter(verbs, color_words))

if __name__ == "__main__":
    main()
