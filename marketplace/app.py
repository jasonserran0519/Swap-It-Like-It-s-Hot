import firebase_admin
from firebase_admin import credentials, firestore, storage
from flask import Flask, jsonify, request, render_template, redirect, url_for, g, flash

app = Flask(__name__)

cred = credentials.Certificate("key.json")
firebase_admin.initialize_app(cred, {'storageBucket': 'swapitlikeithot.appspot.com'})
db = firestore.client()
bucket=storage.bucket()

# home page, this is not working
@app.route('/')
def index():
    #if not g.user:
    #    return redirect(url_for('auth.login'))
    books_ref = db.collection('books')
    books = [doc.to_dict() for doc in books_ref.stream()]
    return render_template('index_copy.html', books=books)

# view all books
@app.route('/books', methods=['GET'])
def get_books():
    books_ref = db.collection('books')
    books = [doc.to_dict() for doc in books_ref.stream()]
    return jsonify(books)

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
    name = request.form.get('name')
    author = request.form.get('author')
    price = request.form.get('price')
    version = request.form.get('version')
    course_num = request.form.get('course_num')
    contact = request.form.get('contact')
    pic = request.files.get('pic')
    #seller needs to be current user

    if pic:
        pic_url = upload_image(pic)
    else:
        pic_url = None

    # Create a dictionary to store the form data
    form_data = {
        'name': name,
        'author': author,
        'price': price,
        'version': version,
        'course_num': course_num,
        'contact': contact,
        'pic': pic_url
    }
    db.collection('books').add(form_data)   # add entry to books collection
    return render_template('submitted.html')

def upload_image(pic):
    blob = bucket.blob(pic.filename)
    blob.upload_from_file(pic, content_type=pic.content_type)
    blob.make_public()
    url = blob.public_url
    return url

if __name__ == '__main__':
    app.run(debug=True)