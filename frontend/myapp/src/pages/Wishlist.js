import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import './Wishlist.css';
import BookTile from '../components/Navbar/BookTile';

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const currentUser = auth.currentUser;

                // Ensure user is logged in
                if (!currentUser) {
                    console.error("User not logged in");
                    return;
                }

                // Get the user's ID token for backend authentication
                const token = await currentUser.getIdToken();

                // Fetch wishlist data from the backend
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/get_wishlist`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Pass token in Authorization header
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setWishlist(data); // Set the wishlist state with the backend response
                } else {
                    console.error("Failed to fetch wishlist:", await response.text());
                }
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    if (loading) return <p>Loading wishlist...</p>;

    return (
        <div className="wishlist-container">
            <div className="wishlist-header">
                <h1>Your Wishlist</h1>
                <p>Browse the books you’ve added to your wishlist.</p>
            </div>
            <div className="wishlist-grid">
                {wishlist.length > 0 ? (
                    wishlist.map((book, index) => (
                        <BookTile book={book} key={index} />
                    ))
                ) : (
                    <p>No items in your wishlist. Start adding books!</p>
                )}
            </div>
        </div>
    );
}

export default Wishlist;