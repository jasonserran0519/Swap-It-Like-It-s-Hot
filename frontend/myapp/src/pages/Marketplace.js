// src/pages/Marketplace.js
import React, { useState, useEffect } from 'react';
import './Marketplace.css';
import BookTile from '../components/Navbar/BookTile';
import Sidebar from '../components/Navbar/Sidebar';


function Marketplace({ searchResults }) {
    const [books, setBooks] = useState([]);
    const [sortOption, setSortOption] = useState('relevant');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);

    const clearFilters = () => {
        setCategory('');
        setSortOption('relevant');
        setBooks([]);  // Clear books if searchResults are cleared
    };
    const fetchBooks = async () => {
        try {
            const query = new URLSearchParams();
            if (sortOption) query.append('sort', sortOption);
            if (category) query.append('category', category);

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/books?${query.toString()}`);
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    useEffect(() => {
        if (!searchResults || searchResults.length === 0) {
            fetchBooks();
        } else {
            setBooks(searchResults);  // Use searchResults directly if available
        }
    }, [sortOption, category, searchResults]);  // Avoid refetching if searchResults are available

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/course_numbers`);
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching course numbers:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="marketplace-container">
            <Sidebar
                setCategory={setCategory}
                sortOption={sortOption}
                setSortOption={setSortOption}
                categories={categories}
                clearFilters={clearFilters}
            />
            <div className="marketplace-grid">
                {(searchResults && searchResults.length > 0 ? searchResults : books).map((book, index) => (
                    <BookTile book={book} key={index} />
                ))}
            </div>
        </div>
    );
}

export default Marketplace;