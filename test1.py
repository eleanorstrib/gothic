"""
Testing basic concepts & tools before doing our main analysis.
"""

import string
from collections import Counter
from color_words import cw_raw
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

STOPWORDS = set(nltk.corpus.stopwords.words('english'))

def generate_tokens():
    """
    This function generates a list of tokens with stopwords and punctuation
    removed.
    """
    text_tokens = []
    # open and read file
    text = open("testtext.txt")#./corpora/ShelleyMary_Frankenstein_Gutenberg.txt
    for row in text:
        tokens = word_tokenize(row)# splits string
        # puts everything in lowercase, removes stopwords and punctuation
        tokens = [token.lower() for token in tokens if token not in STOPWORDS and token not in string.punctuation]
        # adds row tokens to master list
        text_tokens.extend(tokens)
    return text_tokens

def counter(tokens):
    """
    This function counts the number of times a word appears in the list of tokens
    and puts it into a dictionary.
    """
    word_count = Counter()
    for word in tokens:
        word_count[word] += 1
    return word_count.most_common()

def color_position(tokens, color_word_list):
    """
    Takes the tokenized list, lemmatizes the color words, and finds where in
    the text they occur.
    """
    word_map = {}
    lemmatizer = WordNetLemmatizer()
    for pos, word in enumerate(tokens):
        lemmatized_word = lemmatizer.lemmatize(word)
        print (lemmatized_word)
        if lemmatized_word in color_word_list:
            word_map[lemmatized_word] = word_map.get(lemmatized_word, []) + [pos]
    print (word_map)
    return word_map

def word_type(tokens, cw_raw):
    """
    Classifies the words in the corpus into types (e.g. noun, verb, etc.), then
    creates and returns lists of the nouns and adjectives.
    """
    nouns = []
    adjectives  = []
    verbs = []
    # seperates tags into tuples in format ( word, tag)
    tagged_text =  nltk.pos_tag(tokens)
    # loop through and add to appropriate list
    for item in tagged_text:
        if item[1][0] == "N":
            nouns.append(item[0])
        if item[1][0] == "J":
            adjectives.append(item[0])
        if item[1][0] == "V" and item[1][0] in cw_raw:
            print(item)
        else:
            print('nope')
    # deduplicate the lists
    nouns = set(nouns)
    adjectives = set(adjectives)
    verbs = set(verbs)
    return nouns

def main():
    tokens=generate_tokens()
    counter(tokens)
    color_position(tokens, cw_raw)
    # word_type(tokens, cw_raw)

if __name__ == "__main__":
    main()
