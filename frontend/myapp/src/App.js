// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Marketplace from './pages/Marketplace';
import BookDetail from './pages/BookDetail';
import Login from './pages/Login'
import Navbar from './components/Navbar/Navbar';
import AddBook from './pages/AddBook';
import './App.css'


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Marketplace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/add-book" element={<AddBook />}/>
      </Routes>
    </Router>
  );
}

export default App;
