"""
Testing basic concepts & tools before doing our main analysis.
"""

import string
from collections import Counter
from color_words import cw_raw
import nltk
from nltk.tokenize import word_tokenize

stopwords = set(nltk.corpus.stopwords.words('english'))

def generate_tokens():
    """
    This function generates a list of tokens with stopwords and punctuation
    removed.
    """
    text_tokens = []
    # open and read file
    text = open("./corpora/ShelleyMary_Frankenstein_Gutenberg.txt")
    for row in text:
        tokens = word_tokenize(row) # splits string
        # puts everything in lowercase, removes stopwords and punctuation
        tokens = [token.lower() for token in tokens if token not in stopwords and token not in string.punctuation]
        # adds row tokens to master list
        text_tokens.extend(tokens)
    return text_tokens

def counter(tokens):
    """
    This function counts the number of times a word appears and puts it into a
    dictionary.
    """
    word_count = Counter()
    for word in tokens:
        word_count[word] += 1
    return word_count.most_common()

def color_position(tokens, color_word_list):
    """
    Takes the tokenized list and finds where in the text the color words occur.
    """
    word_map = {}
    for pos, word in enumerate(tokens):
        if word in color_word_list:
            word_map[word] = word_map.get(word, []) + [pos]
    return word_map

def word_type(tokens):
    """
    Classifies the words in the corpus into types (e.g. noun, verb, etc.), then
    creates and returns lists of the nouns and adjectives.
    """
    nouns = []
    adjectives  = []
    # seperates tags into tuples in format ( word, tag)
    tagged_text =  nltk.pos_tag(tokens)
    # loop through and add to appropriate list
    for item in tagged_text:
        if item[1][0] == "N":
            nouns.append(item[0])
        if item[1][0] == "J":
            adjectives.append(item[0])
    # deduplicate the lists
    nouns = set(nouns)
    adjectives = set(adjectives)
    print(nouns)
    print (len(nouns))
    return nouns

def main():
    tokens=generate_tokens()
    # counter(tokens)
    # color_position(tokens, cw_raw)
    word_type(tokens)

if __name__ == "__main__":
    main()
