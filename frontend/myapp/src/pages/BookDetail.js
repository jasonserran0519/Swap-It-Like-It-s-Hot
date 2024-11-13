import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
    try {
      const response = await fetch('${process.env.REACT_APP_BACKEND_URL}/add_wishlist/${id}',{
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type' : 'application/json'
        },
      });

      if(!response.ok){
        throw new Error('HTTP erros! Status: ${response.status}');
      }

      const result= await response.json();
      setMessage(result.message || 'Book added to wishlist!');

    } catch (error) {
      console.error('Error adding to the wishlist', error);
      setMessage('Failed to add book to the wishlist.');
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
