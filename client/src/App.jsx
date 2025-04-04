import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';
import AdminUser from './pages/AdminUser';
import AdminDashboard from './pages/AdminDashboard';
import StockDetailView from './pages/StockDetailView';
import Wallet from './pages/Wallet';
import PortfolioPage from './pages/Portfolio';
import AdminTransaction from './pages/AdminTransaction';

import './App.css'
import StockDetails from './pages/StockDetails';
import StockMarket from './pages/StockMarket';
import OrdersPage from './pages/Orders';


// Mock authentication context (would be replaced with real auth in production)
const AuthContext = React.createContext({
  isAuthenticated: false,
  userRole: null,
  login: () => {},
  logout: () => {}
});

// Protected route component for admin routes
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, userRole } = React.useContext(AuthContext);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
    // Mock auth state - would be managed by a proper auth system in production
    const [auth, setAuth] = useState({
      isAuthenticated: false,
      userRole: null
    });
  
  const login = (userData) => {
    // In a real app, this would verify credentials and get user data from an API
    // const authToken = localStorage.getItem('email');
    // const usertype = localStorage.getItem('usertype');
    setAuth({
      isAuthenticated: true,
      userRole: userData.role // 'user' or 'admin'
    });
  };
  
  const logout = () => {
    setAuth({
      isAuthenticated: false,
      userRole: null
    });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              // <ProtectedAdminRoute></ProtectedAdminRoute>
                <AdminDashboard />
              
            } 
          />
          <Route 
            path="/admin/user" 
            element={
              // <ProtectedAdminRoute></ProtectedAdminRoute>
                <AdminUser />
              
            } 
          />
          <Route 
            path="/admin/transactions" 
            element={
                <AdminTransaction />
              
            } 
          />
          <Route 
            path="/stock" 
            element={
              // <ProtectedAdminRoute></ProtectedAdminRoute>
                <StockDetails />
              
            } 
          />
          <Route 
            path="/market" 
            element={
                <StockMarket />
              
            } 
          />
           <Route 
            path="/trading/:symbol" 
            element={
                <StockDetailView />
            } 
          />
          <Route 
            path="/orders" 
            element={
                <OrdersPage />
            } 
          />
           <Route 
            path="/portfolio" 
            element={
                <PortfolioPage />
            } 
          />
          <Route 
            path="/wallet" 
            element={
                <Wallet />
            } 
          />
          
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar 
                  onRegisterClick={() => setShowRegister(true)} 
                  onLoginClick={() => setShowLogin(true)} 
                />
                <div className="flex-grow pt-16">
                  <Hero />
                </div>
                <Footer />
                
                {showRegister && (
                  <Register onClose={() => setShowRegister(false)} />
                )}
                
                {showLogin && (
                  <Login 
                    onClose={() => setShowLogin(false)} 
                    onLogin={(userData) => {
                      login(userData);
                      setShowLogin(false);
                      if (userData.role === 'admin') {
                        // Redirect to admin dashboard after admin login
                        window.location.href = '/admin/dashboard';
                      }
                    }}
                  />
                )}
              </div>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;