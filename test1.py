"""
Testing basic concepts & tools before doing our main analysis.
"""
import re
import string
from collections import defaultdict
from color_words import cw_raw
import spacy

nlp = spacy.load('en')


def generate_tokens():
    """
    This function generates a list of tokens with stopwords and punctuation
    removed.
    """
    text_tokens = []
    # open and read file
    text = open("./corpora/Radcliffe_TheMysteriesofUdolpho_Gutenberg.txt")#./corpora/ShelleyMary_Frankenstein_Gutenberg.txt
    for row in text:
        row = re.sub("[^a-zA-Z]", " ", row)# removes anything not alpha
        tokens = nlp(row)# splits string
        # adds row tokens to master list
        text_tokens.extend(tokens)
    print(text_tokens)
    return text_tokens


def word_type(tokens, cw_raw):
    """
    Classifies the words in the corpus into types (e.g. noun, verb, adj), then
    creates dictionaries for each with positions of the word as the values.
    """
    nouns = defaultdict(list)
    adjectives  = defaultdict(list)
    verbs = defaultdict(list)
    # seperates tags into tuples in format ( word, tag)
    # loop through and add to appropriate list
    for pos, token in enumerate(tokens):
        l_token = token.lemma_
        if l_token in cw_raw:
            if token.pos_ == 'NOUN':
                nouns[l_token].append(pos)
            if token.pos_ == 'VERB':
                verbs[l_token].append(pos)
            if token.pos_ == 'ADJ':
                adjectives[l_token].append(pos)

    # # deduplicate the lists
    print("Color words as nouns:", nouns)
    print("Color words as adjectives:", adjectives)
    print("Color words as verbs:", verbs)
    return nouns


def main():
    tokens=generate_tokens()
    word_type(tokens, cw_raw)

if __name__ == "__main__":
    main()
