import React, { useState, useEffect } from 'react';
import './Marketplace.css';
import BookTile from '../components/Navbar/BookTile';

function Dropdown({ sortOption, setSortOption }) {
    const handleChange = (event) => {
        setSortOption(event.target.value);
    };

    return (
        <div>
            <label htmlFor="dropdown">Sort by: </label>
            <select id="dropdown" value={sortOption} onChange={handleChange}>
            <option value="relevant">Most Relevant</option>
            <option value="low_to_high">Price Low to High</option>
                <option value="high_to_low">Price High to Low</option>
            </select>
        </div>
    );
}

function Sidebar({ setCategory, sortOption, setSortOption, categories, clearFilters }) {
    return (
        <div className="sidebar">
            <h2>Filters</h2>
            <Dropdown sortOption={sortOption} setSortOption={setSortOption} />
            <h3>Categories</h3>
            <ul>
                {categories.map((category) => (
                    <li key={category} onClick={() => setCategory(category)}>
                        {category}
                    </li>
                ))}
            </ul>
            <button onClick={clearFilters} className="clear-filters-btn">Clear Filters</button> {/* Clear Filters Button */}
        </div>
    );
}

function Marketplace() {
    const [books, setBooks] = useState([]);
    const [sortOption, setSortOption] = useState('relevant');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]); // Store the list of categories

    const clearFilters = () => {
        setCategory('');
        setSortOption('relevant');
    };

    useEffect(() => {
        // Fetch books when sortOption, category or courseNum changes
        const fetchBooks = async () => {
            try {
                const query = new URLSearchParams();
                if (sortOption) query.append('sort', sortOption);
                if (category) query.append('category', category);  // Send category filter

                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/books?${query.toString()}`);
                const data = await response.json();
                setBooks(data);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };

        fetchBooks();
    }, [sortOption, category]);

    // Fetch course numbers dynamically
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/course_numbers`);
                const data = await response.json();
                setCategories(data); // Set the course numbers in state
            } catch (error) {
                console.error("Error fetching course numbers:", error);
            }
        };

        fetchCategories();
    }, []); // Only fetch course numbers once on initial load


    return (
        <div className="marketplace-container">
            <Sidebar setCategory={setCategory} sortOption={sortOption} setSortOption={setSortOption} categories={categories} clearFilters={clearFilters}/> 
            <div className="marketplace-grid">
                {books.map((book, index) => (
                    <BookTile book={book} key={index}/>
                ))}
            </div>
        </div>
    );
}

export default Marketplace;