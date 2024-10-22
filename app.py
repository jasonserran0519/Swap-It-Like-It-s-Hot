import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, jsonify, request

app = Flask(__name__)

cred = credentials.Certificate("key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/users', methods=['GET'])
def get_users():
    users_ref = db.collection('users')
    docs = users_ref.stream()

    users = []
    for doc in docs:
        users.append(doc.to_dict())

    return jsonify(users)

@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    user_ref = db.collection('users').document(user_id)
    doc = user_ref.get()

    if doc.exists:
        return jsonify(doc.to_dict())
    else:
        return jsonify({"error": "User not found"}), 404

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    user_ref = db.collection('users').document()
    user_ref.set(data)

    return jsonify({"id": user_ref.id}), 201