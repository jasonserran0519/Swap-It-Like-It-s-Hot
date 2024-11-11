import React, { useState, useEffect } from 'react';
import './Marketplace.css';
import { Link } from 'react-router-dom';

function Dropdown() {
    const [selectedOption, setSelectedOption] = useState('');
  
    const handleChange = (event) => {
      setSelectedOption(event.target.value);
      // You can also add any additional logic you want to handle on change
    };
  
    return (
      <div>
        <label htmlFor="dropdown">Sort by: </label>
        <select id="dropdown" value={selectedOption} onChange={handleChange}>
          <option value="">Price Low to High</option>
          <option value="option1">Price High to Low</option>
          <option value="option2">Most relevant</option>
        </select>
        <p>Selected Option: {selectedOption}</p>
      </div>
    );
  }


function Sidebar() {
    return (
      <div className="sidebar">
        <h2>Filters</h2>
        {/* Add your filters or categories here */}
        <Dropdown/>

        <h3> Categories</h3>
        <ul>
          <li>CSEN</li>
          <li>MECH</li>
          <li>ESEN</li>
          <li>BIOE</li>
          <li>ENGR</li>
          <li>RSOC</li>
        </ul>
      </div>
    );
  }


function Marketplace() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch data from Flask backend
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/books`);
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const placeholderImage = `${process.env.PUBLIC_URL}/images/placeholder.png`;

  return (

    <div className="marketplace-grid">
        <Sidebar/>
      {books.map((book, index) => (
        <Link key={book.id} to={`/books/${book.id}`} className="book-tile">
            <div key={index} className="book-tile">
            <img 
                src={book.pic ? book.pic : placeholderImage} 
                alt={book.name} 
                className="book-image" 
                />
            <h2>{book.name}</h2>
            <h3> ${new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(book.price)}</h3>

            </div>
        </Link>
      ))}
    </div>
  );
}

export default Marketplace;
