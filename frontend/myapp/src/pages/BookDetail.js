import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import './BookDetail.css';

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false); // State to track wishlist status

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
        await checkIfInWishlist();
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("Could not fetch book details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [id]);

  const handleContactSeller = () => {
    if (book && book.contact) {
      setIsPopupVisible(true);
    } else {
      setMessage('Seller email not available.');
    }
  };

  const checkIfInWishlist = async () => {
    const userId = auth.currentUser.uid;
    if (!userId) {
      return; // Skip if user is not logged in
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/is_in_wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          User_ID: userId,
          Book_ID: id,
        }),
      });

      if (!response.ok) {
        console.error("Failed to check wishlist status:", response.statusText);
        return;
      }

      const result = await response.json();
      setIsInWishlist(result.isInWishlist || false); // Update state based on response
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  // handleToggleWishlist
  const handleToggleWishlist = async () => {
    const userId = auth.currentUser.uid;
    if (!userId) {
      setMessage("You must be logged in to add listings to your wishlist.");
      return;
    }

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/remove_from_wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            User_ID: userId,
            Book_ID: id,
          }),
        });
  
        if (!response.ok) {
          console.error("Failed to remove book from wishlist: ", response.statusText);
          return;
        }
  
        const result = await response.json();
        if (result.message) {
          console.log('Book removed from wishlist successfully!');
          setIsInWishlist(false); // Update the local state
        } else {
          console.error('Failed to remove book from wishlist.');
        }
      } else {
        // Add to wishlist
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/add_to_wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            User_ID: userId,
            Book_ID: id,
          }),
        });
  
        if (!response.ok) {
          console.error("Failed to add book to wishlist: ", response.statusText);
          return;
        }
  
        const result = await response.json();
        if (result.message) {
          console.log('Book added to wishlist successfully!');
          setIsInWishlist(true); // Update the local state
        } else {
          console.error('Failed to add book to wishlist.');
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist status:', error);
    }
  };
  

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
          <p><strong>Author: </strong>{book.author}</p>
          <p><strong>Edition: </strong>{book.version}</p>
          <p><strong>ISBN: </strong>{book.isbn}</p>
          <br></br>
          <p><strong>Course Number: </strong>{book.course_num}</p>
          <br></br>
          <p><strong>Condition: </strong>{book.condition || 'Not specified'}</p>
          <p><strong>Additional Details: </strong>{book.description|| 'No additional details'}</p>
        </div>
        
        <div className="book-detail-info-right">
          <p className="price">Price: ${book.price}</p>
          <div className="button-container">
          <button onClick={handleToggleWishlist} className={`wishlist-btn-add ${isInWishlist ? 'added' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={isInWishlist ? 'red' : 'white'} viewBox="0 0 24 24">
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

            <button onClick={handleContactSeller} className="contact-btn">
              Contact
            </button>
          </div>
        </div>

        {isPopupVisible && (
          <div className="popup">
            <div className="popup-content">
              <h3>Contact Seller</h3>
              <p>Email: {book.contact}</p>
              <button onClick={() => setIsPopupVisible(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookDetail;
