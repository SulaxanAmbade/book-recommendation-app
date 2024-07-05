from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
# Load the dataset
books_df = pd.read_csv('books.csv')

def search_books(keyword):
    """
    Search for books that match the keyword in the title, authors, or publisher.
    """
    keyword = keyword.lower()
    results = books_df[
        books_df['title'].str.lower().str.contains(keyword) |
        books_df['authors'].str.lower().str.contains(keyword) |
        books_df['publisher'].str.lower().str.contains(keyword)
    ]
    return results

def format_book(book):
    """
    Format a single book into a dictionary.
    """
    formatted_book = {
        'title': book['title'],
        'authors': book['authors'],
        'average_rating': book['average_rating'],
        'isbn': book['isbn'],
        'isbn13': book['isbn13'],
        'language_code': book['language_code'],
        'ratings_count': book['ratings_count'],
        'text_reviews_count': book['text_reviews_count'],
        'publication_date': book['publication_date'],
        'publisher': book['publisher']
    }
    if 'num_pages' in book:
        formatted_book['num_pages'] = book['num_pages']
    return formatted_book

@app.route('/search', methods=['GET'])
def search():
    keyword = request.args.get('keyword')
    if not keyword:
        return jsonify({"error": "Keyword is required"}), 400

    results = search_books(keyword)
    books = [format_book(book) for _, book in results.iterrows()]
    return jsonify({"books": books})

if __name__ == '__main__':
    app.run(debug=True)
