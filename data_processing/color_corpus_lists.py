import csv



def get_color_words():
    """
    Gets color words from the csv file and puts them into a list.
    """
    color_word_list = []
    color_data = csv.reader(open('./color_names.csv'), delimiter=",", quotechar='"')

    for row in color_data:
        if row[0] != "Colour Name":
            print (row[0].lower())
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
            print (row[14])
            corpus_file_list.append(row[14])
    print(corpus_file_list)
    return corpus_file_list

def main():
    color_word_list = get_color_words
    corpus_file_list = get_corpus_filenames()

if __name__ == '__main__':
    main()
