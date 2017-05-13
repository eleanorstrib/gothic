"""
Modifying test code to run, populate database
"""

import string
import nltk
import csv
from collections import Counter
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
            word_list= [item[0], 'n']
            text_dict_list.append(word_list)
            # new_dict = {}
            # new_dict[item[0]]= {}
            # new_dict[item[0]]['position'] = pos
            # new_dict[item[0]]['type'] = 'n'
            # text_dict_list.append(new_dict)
        if item[1][0] == 'J':
            word_list = [item[0], 'a']
            text_dict_list.append(word_list)
            # new_dict = {}
            # new_dict[item[0]] = {}
            # new_dict[item[0]]['position'] = pos
            # new_dict[item[0]]['type'] = 'a'
            # text_dict_list.append(new_dict)
    print(text_dict_list)
    return text_dict_list


def color_filter(text_dict_list, color_word_dict):
    """
    Takes the list of dicts from each text, compares the key in each dict to the
    color list, appends to final list if there is a match.
    """
    color_words_filtered = []
    lemmatizer = WordNetLemmatizer()
    for word_list in text_dict_list:
        # color_word = list(word.keys())[0]
        word = word_list[0]
        lemmatized_word = lemmatizer.lemmatize(word)
        if lemmatized_word in color_word_dict:
            color_words_filtered.append(word_list)
    print(color_words_filtered)
    return color_words_filtered


def get_context(tokens, color_words_filtered):
    """
    This function gets the context for each color word from the tokenized text,
    and adds it as a key, value pair to the dict.
    """
    for word_list in color_words_filtered:
        print(type(word_list))
        # color = item[list(item.keys())[0]]
        word_num = word_list[2]
        print (word_num)
        context = ' '.join(tokens[(word_num-5):(word_num+5)])
        word_list.append(context)
        # color['context'] = context
    print(color_words_filtered)
    return color_words_filtered


def create_summary_dict(color_words_final):
    """
    Collapes all color words into a dict with key = word, value = # found.
    """
    # summary_list = [list(word.keys())[0] for word in color_words_final]
    summary_list = [word_list[0] for word_list in color_words_final]
    color_summary_dict = dict(Counter(summary_list))
    print(color_summary_dict)
    return color_summary_dict

def add_to_csv(data, csvfile, heading):
    """
    Cycles through master lists of data and adds them to the file.
    """
    with open(csvfile, 'r') as fin, open('test_'+csvfile, 'w') as fout:
        reader = csv.reader(fin, lineterminator='\n')
        writer = csv.writer(fout, lineterminator='\n')
        writer.writerow(next(reader) + [heading])
        for row, val in zip(reader, data):
            writer.writerow(row + [val])
    print("done")


def main():
    color_word_dict = get_color_words()
    corpus_file_list = get_corpus_filenames()
    print("we have the lists!")
    master_color_words_final = []
    master_color_summary_dict = []
    master_word_count = []

    for filename in corpus_file_list:
        print("********* now processing %s *********" % filename)
        tokens = tokenize_text(filename)
        print("tokenization complete")
        word_num = word_count(tokens)
        print("word_count", word_num)
        master_word_count.append(word_num)
        text_dict_list = word_type(tokens)
        print("text_dict_list done")
        color_words_final = color_filter(text_dict_list, color_word_dict)
        print("color_words_filtered")
        # color_words_final = get_context(tokens, color_words_final)
        master_color_words_final.append(color_words_final)
        color_summary_dict = create_summary_dict(color_words_final)
        master_color_summary_dict.append(color_summary_dict)

    print("color_summary_dict count: ",len(master_color_summary_dict))
    print("color_words_final count: ", len(master_color_words_final))

    print("adding data to csv...")
    add_to_csv(master_color_summary_dict, 'gothic_text_data.csv', 'summary_dict')
    add_to_csv(master_color_words_final, 'test_gothic_text_data.csv', 'color_words_list')
    add_to_csv(master_word_count, 'test_test_gothic_text_data.csv', 'word_num')
    print("That's it!")


if __name__ == "__main__":
    main()
