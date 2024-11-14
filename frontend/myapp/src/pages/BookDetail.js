import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BookDetail.css';

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

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
          setSelectedImage(data.pic && data.pic.length > 0 ? data.pic[0] : null);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("Could not fetch book details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const placeholderImage = `${process.env.PUBLIC_URL}/images/placeholder.png`;

  return (
    <div className="book-detail-container">
      <div className="image-gallery">
        <div className="thumbnails">
          {(book.pic || []).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="thumbnail-image"
              onMouseEnter={() => setSelectedImage(image)}
            />
          ))}
        </div>
        <div className="large-image">
          <img
            src={selectedImage || placeholderImage}
            alt={book.name}
            className="book-detail-image"
          />
        </div>
      </div>
      
      <div className="book-detail-info">
        <div className="book-detail-info-left">
          <h2>{book.name}</h2>
          <p>Author: {book.author}</p>
          <p>Edition: {book.version}</p>
          <p>ISBN: {book.isbn}</p>
          <br></br>
          <p>Course Number: {book.course_num}</p>
          <br></br>
          <p>Condition: {book.condition || 'Not specified'}</p>
          <p>Additional Details: {book.description|| 'No additional details'}</p>
        </div>
        
        <div className="book-detail-info-right">
          <p className="price">Price: ${book.price}</p>
          <div className="button-container">
            <button className="wishlist-btn-add">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>

            <button className="report-btn">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="white"
                    viewBox="0 0 24 24"
                >
                    <path d="M4 4v16h2v-6h9.5l1 1H20V7h-3.5l-1-1H6V4H4zm13 8.5h-8V9.5h8v3z" />
                </svg>
            </button>

            <button className="contact-btn">Contact</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
