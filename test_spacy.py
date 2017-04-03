"""
Testing basic concepts & tools before doing our main analysis.
"""
import re
from collections import defaultdict
from oed_color import color_words
import spacy


nlp = spacy.load('en')

def tokenize_text():
    """
    This function generates a list of tokens with punctuation and spaces removed.
    """
    text_tokens = []
    # open and read file
    text = open("./corpora/ShelleyMary_Frankenstein_Gutenberg.txt")
    for row in text:
        row = re.sub("[^a-zA-Z]", " ", row).lower()# removes anything not alpha
        tokens = nlp(row)# splits string
        # adds row tokens to master list
        text_tokens.extend(tokens)
    return text_tokens


def word_type(tokens, color_words):
    """
    Classifies the words in the corpus into types (e.g. noun, verb, adj), then
    creates dictionaries for each with positions of the word as the values.
    """
    nouns = []
    adjectives = []
    verbs = []
    # seperates tags into tuples in format ( word, tag)
    # loop through and add to appropriate list
    for pos, token in enumerate(tokens):
        l_token = token.lemma_
        if l_token in color_words:
            if token.pos_ == 'NOUN':
                nouns.append((l_token, pos))
            if token.pos_ == 'VERB':
                adjectives.append((l_token, pos))
            if token.pos_ == 'ADJ':
                verbs.append((l_token, pos))
    return nouns, adjectives, verbs


def main():
    tokens = tokenize_text()
    print(tokens)
    nouns, adjectives, verbs = word_type(tokens, color_words)
    # print("Color words as nouns:", nouns)
    # print("Color words as adjectives:", adjectives)
    # print("Color words as verbs:", verbs)

if __name__ == "__main__":
    main()
