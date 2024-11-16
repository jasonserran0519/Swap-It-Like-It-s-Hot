// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig'; // Ensure auth is correctly imported
import './Navbar.css';

function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate(); // Use navigate to redirect after logout

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
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
            <option value="name">Title</option>
            <option value="author">Author</option>
            <option value="isbn">ISBN</option>
          </select>
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      <div className="navbar-right">
        {/* Wish List Button with Heart Icon */}
        <Link to="/wishlist" className="wishlist-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="white"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </Link>

        {/* Add Book Button with Plus Icon */}
        <Link to="/add-book" className="add-book-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="white"
            viewBox="0 0 24 24"
          >
            <path d="M19 13H13v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </Link>

        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
