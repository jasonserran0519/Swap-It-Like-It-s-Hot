// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Marketplace from './pages/Marketplace';
import BookDetail from './pages/BookDetail';
import Login from './pages/Login'
import Navbar from './components/Navbar/Navbar';
import AddBook from './pages/AddBook';
import './App.css'

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <div>
      {/* Render Navbar only if not on the login page */}
      {!isLoginPage && <Navbar />}


       <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/add-book" element={<AddBook />}/>
      </Routes>
    </div>
  );
}

export default App;
