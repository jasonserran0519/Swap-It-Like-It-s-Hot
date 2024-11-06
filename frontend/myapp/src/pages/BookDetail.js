import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/books/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // If data contains an error message from the backend
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

    fetchBookDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;  // Show error message if there's an issue
  }

  return (
    <div>
      <h2>{book.name}</h2>
      <img src={book.pic} alt={book.name} />
      <p>Author: {book.author}</p>
      <p>Price: ${book.price}</p>
      <p>Version: {book.version}</p>
      <p>Course Number: {book.course_num}</p>
      <p>Contact: {book.contact}</p>
    </div>
  );
}

export default BookDetails;
