import firebase_admin
from firebase_admin import credentials, firestore, storage
from flask import Flask, jsonify, request, render_template, redirect, url_for, g, flash
from flask_cors import CORS

app = Flask(__name__)

cred = credentials.Certificate("key.json")
firebase_admin.initialize_app(cred, {'storageBucket': 'swapitlikeithot.appspot.com'})
db = firestore.client()
bucket=storage.bucket()

# For debugging
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)
#CORS(app)

# home page
@app.route('/')
def index():
    if not g.user:
        return redirect(url_for('auth.login'))
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


# Add to wishlist function
@app.route('/add_to_wishlist', methods=['POST'])
def adding_to_wishlist():
    try:
        # Extract data from the request
        data = request.json
        user_id = data.get('User_ID')
        book_id = data.get('Book_ID')
        
        # Validate the input
        if not user_id or not book_id:
            return jsonify({'error': 'Missing user ID or book ID'}), 400
    
        # Create or update a document in the Wishlist collection
        wishlist_ref = db.collection('wishlist')
        query = wishlist_ref.where('User_ID', '==', user_id).where('Book_ID', '==', book_id).stream()

        if any(query):
            return jsonify({"Message:": "Book is already in your wishlist!"}), 200

        new_wishlist_item = {
            'User_ID': user_id,
            'Book_ID': book_id,
        }

        wishlist_ref.add(new_wishlist_item)

        return jsonify({'message': 'Book added to wishlist successfully!'}), 200

    except Exception as e:
        print(f"Error adding to wishlist: {e}")
        return jsonify({'error': 'Failed to add to wishlist'}), 500
     


@app.route('/search', methods=['GET'])
def search_books():
    books_ref = db.collection('books')
    
    # Get query parameters from the request
    name = request.args.get('name', '').lower()  # Convert name to lowercase for case-insensitive matching
    course_num = request.args.get('course_num', '')  # Using course_num instead of author or isbn directly

    # Apply filters based on available parameters
    if name:
        books_ref = books_ref.where('name', '>=', name).where('name', '<=', name + '\uf8ff')  # Firestore range query

    if course_num:
        books_ref = books_ref.where('course_num', '==', course_num)

    # Retrieve and format results
    results = []
    try:
        for doc in books_ref.stream():
            book_data = doc.to_dict()
            book_data['id'] = doc.id
            results.append(book_data)

        return jsonify(results)
    
    except Exception as e:
        print(f"Error in search: {e}")
        return jsonify({'error': 'An error occurred while searching for books'}), 500


@app.route('/search', methods=['GET'])
def search():
    return search_books()





#adding user after they sign in
@app.route('/add_user', methods=['POST'])
def adding_user():
    try:
        user_data = request.json
        
        # Check if all necessary data is provided
        if not user_data.get('uid') or not user_data.get('displayName') or not user_data.get('email'):
            return jsonify({"error": "Missing required user data"}), 400
        
        # Add the user to Firestore users collection, with the same document name as the uid
        # set apparently resets documents if they have already been created
        user_ref = db.collection('users').document(user_data['uid'])
        user_ref.set({
            'uid': user_data['uid'],
            'displayName': user_data['displayName'],
            'email': user_data['email'],
        })
        

        return jsonify({"message": "User added successfully"}), 200
    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error adding user: {e}")
        return jsonify({"error": "Failed to add user"}), 500

@app.route('/get_wishlist', methods=['GET'])
def get_wishlist():
    try:
        # Get the user ID from the query parameter
        user_id = request.args.get('userID')
        if not user_id:
            return jsonify({'error': 'Missing user ID'}), 400

        # Query the wishlist collection for the user's wishlist items
        wishlist_ref = db.collection('wishlist').where('User_ID', '==', user_id)
        wishlist_items = wishlist_ref.stream()

        # Collect book IDs from the wishlist
        book_ids = [item.to_dict().get('Book_ID') for item in wishlist_items]

        # Fetch details of each book from the books collection
        books = []
        for book_id in book_ids:
            book_ref = db.collection('books').document(book_id)
            book_doc = book_ref.get()
            if book_doc.exists:
                book_data = book_doc.to_dict()
                book_data['id'] = book_id  # Add the document ID to the book data
                books.append(book_data)

        return jsonify(books), 200

    except Exception as e:
        print(f"Error fetching wishlist: {e}")
        return jsonify({'error': 'Failed to fetch wishlist'}), 500



# form submitted
@app.route('/added-book', methods=['POST'])
def add_book():
    try:
        name = request.form.get('name')
        author = request.form.get('author')
        version = request.form.get('version')
        isbn = request.form.get('isbn')
        course_num = request.form.get('course_num')
        price = request.form.get('price')
        condition = request.form.get('condition')
        contact = request.form.get('contact')
        description = request.form.get('description')
        user_id = request.form.get('user_id')

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
            'isbn': int(isbn),
            'course_num': course_num,
            'price': float(price),
            'condition': condition,
            'contact': contact,
            'pic': image_urls,
            'description': description
        }
        book_ref = db.collection('books').add(form_data)   # add entry to books collection
        
        
        # Also adds to listings
        listing_data = {
            'Book_ID': book_ref[1].id,
            'User_ID': user_id
        }

        db.collection('listings').add(listing_data)
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