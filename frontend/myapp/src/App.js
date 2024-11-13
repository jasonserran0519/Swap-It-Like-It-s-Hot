// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Marketplace from './pages/Marketplace';
import BookDetail from './pages/BookDetail';
import Login from './pages/Login';
import Navbar from './components/Navbar/Navbar';
import AddBook from './pages/AddBook';
import useAuth from './hooks/useAuth'; // Import the custom hook to get auth status
import './App.css';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth(); // Check if user is authenticated
  const isLoginPage = location.pathname === '/';

  return (
    <div>
      {/* Render Navbar only if not on the login page */}
      {!isLoginPage && <Navbar />}

      <Routes>
        {/* Redirect to Marketplace if logged in, otherwise show Login */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/marketplace" /> : <Login />}
        />
        
        {/* Protect Marketplace route: redirect to Login if not authenticated */}
        <Route
          path="/marketplace"
          element={isAuthenticated ? <Marketplace /> : <Navigate to="/" />}
        />

        {/* Protect AddBook route */}
        <Route
          path="/add-book"
          element={isAuthenticated ? <AddBook /> : <Navigate to="/" />}
        />

        {/* Protect BookDetail route */}
        <Route
          path="/books/:id"
          element={isAuthenticated ? <BookDetail /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;