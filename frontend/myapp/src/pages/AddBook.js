import React, { useEffect, useState } from 'react';
import './AddBook.css';
import { auth } from '../firebaseConfig';

function AddBook() {
    const [formData, setFormData] = useState({
        name: '',
        author: '',
        version: '',
        isbn: '',
        course_num: '',
        price: '',
        condition: '',
        contact: '',
        description: '',
    });
    const [uploadedImages, setUploadedImages] = useState([]); // Array to hold image files
    const [currentUserID, setCurrentUserID] = useState(null);

    // This is to get the current user id
    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setCurrentUserID(user.uid);
        } else {
            console.warn('No user is currently logged in.');
        }
    }, []);


    const RequiredStar = () => <span className="required-star">*</span>;

    // Handle image upload by either clicking or dragging
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && uploadedImages.length < 3) {
            setUploadedImages((prev) => [...prev, { file, preview: URL.createObjectURL(file) }]);
        }
    };

    // Handle image delete
    const handleDeleteImage = (index) => {
        const updatedImages = [...uploadedImages];
        updatedImages.splice(index, 1);
        setUploadedImages(updatedImages);
    };

    // Handle drag-and-drop image upload
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && uploadedImages.length < 3) {
            setUploadedImages((prev) => [...prev, { file, preview: URL.createObjectURL(file) }]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        // Append form fields
        Object.keys(formData).forEach((key) => data.append(key, formData[key]));
        // Append the user id
        data.append('user_id', currentUserID);
        // Append images
        uploadedImages.forEach(({ file }, index) => data.append(`pic${index + 1}`, file));
        try {
            const response = await fetch('http://localhost:5000/added-book', {
                method: 'POST',
                body: data,
            });
            if (response.ok) {
                window.location.href = '/marketplace';  // Redirect to marketplace after successful submission
            } else {
                const result = await response.json();
                alert('Failed to add textbook: ' + result.error);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form');
        }
    };


    return (
        <div className="add-book-container">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <h2>Add Your Own Textbook:</h2>
                <div className="upload-area-container">
                    {uploadedImages.map((image, index) => (
                        <div key={index} className="upload-area">
                            <img src={image.preview} alt={`Preview ${index + 1}`} />
                            <div className="trash-can" onClick={() => handleDeleteImage(index)}>
                                🗑️
                            </div>
                        </div>
                    ))}
                    {uploadedImages.length < 3 && (
                        <div
                            className="upload-area"
                            onClick={() => document.getElementById('pic').click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                        >
                            <label>Drag & Drop or Click to Upload</label>
                            <input
                                type="file"
                                accept="image/*"
                                id="pic"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                        </div>
                    )}
                </div>

                <div className="fields-container">
                    <div className="fields-names-container">
                        <p>Textbook Name<RequiredStar /></p>
                        <p>Author<RequiredStar /></p>
                        <p>Edition Number</p>
                        <p>ISBN<RequiredStar /></p>
                        <p>Course Number<RequiredStar /></p>
                        <p>Price<RequiredStar /></p>
                        <p>Condition<RequiredStar /></p> {/* New Field for Book Condition */}
                        <p>Preferred Contact Information<RequiredStar /></p>
                        <p>Description</p> {/* New Field for Description */}
                    </div>
                    <div className="fields-forms-container">
                        <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                        <input type="text" name="author" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} required />
                        <input type="number" name="version" value={formData.version} onChange={(e) => setFormData({...formData, version: e.target.value})} />
                        <input type="number" name="isbn" value={formData.isbn} onChange={(e) => setFormData({...formData, isbn: e.target.value})} required />
                        <input type="text" name="course_num" value={formData.course_num} onChange={(e) => setFormData({...formData, course_num: e.target.value})} required />
                        <input type="number" name="price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                        <select name="condition" value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})} required>
                            <option value="">Select Condition</option>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Poor">Poor</option>
                        </select>
                        <input type="text" name="contact" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} required />
                        <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} maxLength="500" placeholder="Description (max 500 characters)" />
                    </div>
                </div>

                <div className="form-buttons">
                    <button type="submit" className="form-submit">Submit</button>
                    <button type="button" className="form-cancel" onClick={() => window.location.href = '/marketplace'}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default AddBook;
