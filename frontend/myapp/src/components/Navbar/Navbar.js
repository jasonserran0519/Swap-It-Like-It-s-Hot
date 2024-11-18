// src/components/Navbar.js
// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig'; // Ensure auth is correctly imported
import './Navbar.css';

function Navbar({ setSearchResults }) {  // Accept `setSearchResults` as a prop
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();  // Use navigate to redirect after logout

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const performSearch = async (query, category) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/search?name=${query}&course_num=${category}`);
            if (!response.ok) throw new Error("Failed to fetch search results");

            const data = await response.json();
            setSearchResults(data);  // Pass search results to Marketplace.js via prop
            setError(null);  // Clear any previous errors
        } catch (error) {
            console.error("Error fetching search results:", error);
            setError("Failed to fetch search results. Please try again.");
        }
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        performSearch(searchTerm, category);
        console.log('Search for:', searchTerm, 'in category:', category);
    };

    const handleLogout = () => {
        auth.signOut().then(() => {
            navigate('/'); // Redirect to login page after sign-out
        }).catch((error) => {
            console.error("Logout Error:", error);
        });
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/marketplace" className="logo">
                    <img src="/images/silihLogo.png" alt="Logo" className="logo-image" />
                </Link>
            </div>

            <div className="navbar-center">
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <select value={category} onChange={handleCategoryChange} className="category-select">
                        <option value="">Title</option>
                        <option value="author">Author</option>
                        <option value="isbn">ISBN</option>
                    </select>
                    <button type="submit" className="search-button">Search</button>
                </form>
                {error && <div className="error-message">{error}</div>}
            </div>

            <div className="navbar-right">
                <Link to="/wishlist" className="wishlist-btn">
                    <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </Link>
                <Link to="/add-book" className="add-book-btn">
                    <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                        <path d="M19 13H13v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                </Link>
                <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;