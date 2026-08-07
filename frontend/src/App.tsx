import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { authService } from './services/api';
import { User } from './types';
import './App.css';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import MyPropertiesPage from './pages/MyPropertiesPage';
import CreatePropertyPage from './pages/CreatePropertyPage';
import MyBidsPage from './pages/MyBidsPage';
import MyRentalsPage from './pages/MyRentalsPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const currentUser = await authService.getMe();
          setUser(currentUser);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/" className="navbar-logo">
              🏠 Real Estate Auctions
            </Link>
            <div className="navbar-links">
              <Link to="/properties">Properties</Link>
              {user ? (
                <>
                  <Link to="/dashboard">Dashboard</Link>
                  {(user.role === 'seller' || user.role === 'admin') && (
                    <>
                      <Link to="/my-properties">My Properties</Link>
                      <Link to="/create-property">New Property</Link>
                    </>
                  )}
                  <Link to="/my-bids">My Bids</Link>
                  <Link to="/my-rentals">My Rentals</Link>
                  <span className="user-info">
                    {user.firstName} {user.lastName}
                  </span>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
              )}
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage setUser={setUser} />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage setUser={setUser} />} />
            <Route path="/" element={<PropertiesPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage user={user} />} />
            {user && (
              <>
                <Route path="/dashboard" element={<DashboardPage user={user} />} />
                {(user.role === 'seller' || user.role === 'admin') && (
                  <>
                    <Route path="/my-properties" element={<MyPropertiesPage user={user} />} />
                    <Route path="/create-property" element={<CreatePropertyPage />} />
                  </>
                )}
                <Route path="/my-bids" element={<MyBidsPage />} />
                <Route path="/my-rentals" element={<MyRentalsPage />} />
              </>
            )}
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2026 Real Estate Auction & Rental Management System. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
