import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function AddBook() {
    // State to hold form data
    const [formData, setFormData] = useState({
        name: '',
        author: '',
        version: '',
        isbn: '',
        course_num: '',
        price: '',
        contact: '',
        pic: null
    });

    const RequiredStar = () => <span style={{ color: 'red' }}> *</span>;

    // Handler for input changes
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });
    
        try {
            const response = await fetch('http://localhost:5000/added-book', {
                method: 'POST',
                body: data,
            });
    
            if (response.ok) {
                // Redirect to the submitted page after successful submission
                window.location.href = '/submitted.html';
            } else {
                const result = await response.json();
                alert('Failed to add textbook: ' + result.error);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form');
        }
    };
    
    return(
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <h2> Add your own textbook! </h2>
            <p>Textbook Name:<RequiredStar/> <input type="text" name="name" value={formData.name} onChange={handleChange} required /></p>
            <p>Author:<RequiredStar/> <input type="text" name="author" value={formData.author} onChange={handleChange} required /></p>
            <p>Edition Number: <input type="number" name="version" value={formData.version} onChange={handleChange}/></p>
            <p>ISBN: <input type="number" name="isbn" value={formData.isbn} onChange={handleChange}/></p>
            <p>Course Number (ex: CSEN174, ENGR1):<RequiredStar/> <input type="text" name="course_num" value={formData.course_num} onChange={handleChange} required /></p>
            <p>Price:<RequiredStar/> <input type="number" name="price" value={formData.price} onChange={handleChange} required /></p>
            <p>Preferred Contact Information:<RequiredStar/> <input type="text" name="contact" value={formData.contact} onChange={handleChange} required /></p>
            <p>Picture of Textbook:<RequiredStar/> <input type="file" name="pic" accept="image/*" onChange={handleChange} required /></p>
            <p><button type="submit">Submit</button></p>
            <p><RequiredStar/> = required field</p>
        </form>
    );
}

export default AddBook;
