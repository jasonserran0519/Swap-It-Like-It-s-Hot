import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BookDetail.css'

function BookDetail() {
  const { id } = useParams(); // Get the book ID from the URL
  console.log("Received params:", { id }); // Log all params

  const [book, setBook] = useState(null);
  console.log("Fetching details for book ID:", id); // Log the ID


  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/books/${id}`);
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetail();
  }, [id]);

  if (!book) {
    return <div>Loading...</div>;
  } else if (book.error) {
    return <div>{book.error}</div>; // Error state
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

export default BookDetail;
