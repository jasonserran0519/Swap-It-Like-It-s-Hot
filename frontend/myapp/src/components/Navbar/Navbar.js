// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Make sure to link to the updated CSS

function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Search for:', searchTerm, 'in category:', category);
    // Implement search logic (e.g., redirect to search results)
  };


  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="navbar-left">
        <Link to="/" className="logo">
          <img src="/images/silihLogo.png" alt="Logo" className="logo-image" />
        </Link>
      </div>

      {/* Search Section */}
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
            {/* Add more categories as needed */}
          </select>
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      {/* Right Links */}
      <div className="navbar-right">
      <Link to="/add-book" className="add-book-btn">
        +
      </Link>


        <Link to="/login" className="nav-link">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
