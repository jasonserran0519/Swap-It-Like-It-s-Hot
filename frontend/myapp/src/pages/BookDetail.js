import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import './BookDetail.css';

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/books/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setBook(data);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("Could not fetch book details. Please try again later.");
      } finally {
        setLoading(false);  // Set loading to false after request completes
      }
    };

    fetchBookDetail();
  }, [id]);


  // handleAddToWishlist
  const handleAddToWishlist = async () => {
    const userId = auth.currentUser.uid;
    if (!userId) {
      setMessage("You must be logged in to add listings to your wishlist.");
      return;
    }

  
    try {
      console.log("User ID:", userId);
      console.log("Book ID:", id);
      
      const data = {
        User_ID: userId,
        Book_ID: id,
      }
      // Sending the data over to the Flask backend
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/add_to_wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), 
      });
  
      // Log response status
      console.log("Response status:", response.status);
  
      // Check if the response is okay
      if (!response.ok) {
        console.error("Failed to add book to wishlist: ", response.statusText);
        setMessage('Failed to add book to wishlist.');
        return;
      }
  
      // Response from Flask
      const result = await response.json();
      console.log("Response from backend:", result);
  
      if (result.message) {
        setMessage(result.message || 'Book added to wishlist successfully!');
      } else {
        setMessage(result.error || 'Failed to add book to wishlist.');
      }
    } catch (error) {
      console.error('Could not add to wishlist:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;  // Show error message if there's an issue
  }

  const placeholderImage = `${process.env.PUBLIC_URL}/images/placeholder.png`;

  return (
    <div className="book-detail-container">
      <img 
            src={book.pic && book.pic.length > 0 ? book.pic[0] : placeholderImage} 
            alt={book.name} 
            className="book-detail-image" 
        />
      <div className="book-detail-info">
        <h2>{book.name}</h2>
        <p>Author: {book.author}</p>
        <p className="price">Price: ${book.price}</p>
        <p>Version: {book.version}</p>
        <p>Course Number: {book.course_num}</p>
        <p>Contact: {book.contact}</p>

        <div className="button-container">
          <button onClick={handleAddToWishlist}>Add to Wishlist</button>
          <button>Report Book</button>
        </div>

        {message && <p className='message'>{message}</p>}
      </div>
    </div>
  );
}

export default BookDetail;
