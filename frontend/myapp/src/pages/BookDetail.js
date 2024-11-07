import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BookDetail.css';

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

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
        src={book.pic ? book.pic : placeholderImage} 
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
          <button>Add to Wishlist</button>
          <button>Report Book</button>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
