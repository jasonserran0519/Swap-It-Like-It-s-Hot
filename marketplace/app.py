import firebase_admin
from firebase_admin import credentials, firestore, storage
from flask import Flask, jsonify, request, render_template, redirect, url_for, g, flash
from flask_cors import CORS

app = Flask(__name__)

cred = credentials.Certificate("key.json")
firebase_admin.initialize_app(cred, {'storageBucket': 'swapitlikeithot.appspot.com'})
db = firestore.client()
bucket=storage.bucket()

CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# home page, this is not working
@app.route('/')
def index():
    #if not g.user:
    #    return redirect(url_for('auth.login'))
    books_ref = db.collection('books')
    books = [doc.to_dict() for doc in books_ref.stream()]
    return render_template('index_copy.html', books=books)

# view all books
# @app.route('/books', methods=['GET'])
# def get_books():
#     books_ref = db.collection('books')
#     books = [doc.to_dict() for doc in books_ref.stream()]
#     return jsonify(books)

# @app.route('/books', methods=['GET'])
# def get_books():
#     books_ref = db.collection('books')
#     books = [{"id": doc.to_dict().get('id'), **doc.to_dict()} for doc in books_ref.stream()]  # Include document ID
#     return jsonify(books)

@app.route('/books', methods=['GET'])
def get_books():
    books_ref = db.collection('books')

    category = request.args.get('category')
    if category:
        books_ref = books_ref.where('course_num', '==', category)

    books = []
    for doc in books_ref.stream():
        book_data = doc.to_dict()
        book_data['id'] = doc.id  # Add the document ID to each book's data
        books.append(book_data)
    
    # Handle sorting by price
    sort_option = request.args.get('sort')
    if sort_option == 'low_to_high':
        books = sorted(books, key=lambda x: float(x.get('price', 0)))
    elif sort_option == 'high_to_low':
        books = sorted(books, key=lambda x: float(x.get('price', 0)), reverse=True)

    return jsonify(books)

@app.route('/course_numbers', methods=['GET'])
def get_course_numbers():
    books_ref = db.collection('books')

    # Retrieve all documents in the collection
    books = books_ref.stream()

    # Extract unique course numbers
    course_numbers = set()
    for doc in books:
        book_data = doc.to_dict()
        course_num = book_data.get('course_num')
        if course_num:
            course_numbers.add(course_num)

    # Return the list of unique course numbers
    return jsonify(list(course_numbers))

# view selected book
@app.route('/books/<book_id>', methods=['GET'])
def view_book(book_id):
    book_ref = db.collection('books').document(book_id)
    doc = book_ref.get()

    if doc.exists:
        return jsonify(doc.to_dict())
    else:
        return jsonify({"error": "Book not found"}), 404

# add a new book
@app.route('/add-book')
def book_form():
    return render_template('newpost.html')

# form submitted
@app.route('/added-book', methods=['POST'])
#@login_required
def add_book():
    try:
        name = request.form.get('name')
        author = request.form.get('author')
        version = request.form.get('version')
        isbn = request.form.get('isbn')
        course_num = request.form.get('course_num')
        price = request.form.get('price')
        contact = request.form.get('contact')
        #seller needs to be current user

        image_urls = []
        for i in range(1, 4):  # Expecting up to 3 images
            pic = request.files.get(f'pic{i}')
            if pic:
                pic_url = upload_image(pic)
                image_urls.append(pic_url)

        if not image_urls:
            image_urls = None

        # Create a dictionary to store the form data
        form_data = {
            'name': name,
            'author': author,
            'version': version,
            'isbn': isbn,
            'course_num': course_num,
            'price': float(price),
            'contact': contact,
            'pic': image_urls
        }
        db.collection('books').add(form_data)   # add entry to books collection
        return render_template('submitted.html')
    except Exception as e:
        print("Error in add_textbook:", e)
        return jsonify({'success': False, 'error': str(e)}), 500

def upload_image(pic):
    blob = bucket.blob(pic.filename)
    blob.upload_from_file(pic, content_type=pic.content_type)
    blob.make_public()
    url = blob.public_url
    return url

if __name__ == '__main__':
    app.run(debug=True)