// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Search for:', searchTerm);
    // Implement search logic (e.g., redirect to search results)
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Marketplace</Link> {/* Default page link */}
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button type="submit">Search</button>
          </form>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
