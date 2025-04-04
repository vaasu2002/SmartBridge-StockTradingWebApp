// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, TrendingUp, Menu, X, ChevronDown } from 'lucide-react';

const Navbar = ({ onRegisterClick, onLoginClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">
            <LineChart className={`h-8 w-8 ${isScrolled ? 'text-blue-600' : 'text-blue-500'}`} />
            <span className={`ml-2 text-xl font-bold ${isScrolled ? 'text-blue-600' : 'text-gray-900'}`}>
              TradeSmart
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-1">
            <a 
              href="#" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isScrolled 
                  ? 'text-gray-900 hover:bg-gray-100' 
                  : 'text-gray-900 hover:bg-white hover:bg-opacity-20'
              }`}
            >
              Home
            </a>
            
            {/* Markets Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('markets')}
                className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors ${
                  isScrolled 
                    ? 'text-gray-900 hover:bg-gray-100' 
                    : 'text-gray-900 hover:bg-white hover:bg-opacity-20'
                }`}
              >
                Markets
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                  activeDropdown === 'markets' ? 'rotate-180' : ''
                }`} />
              </button>
              
              {activeDropdown === 'markets' && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <a 
                    href="#" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Stock Market
                  </a>
                  <a 
                    href="#" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Option Chains
                  </a>
                  <a 
                    href="#" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    IPO
                  </a>
                  <a 
                    href="#" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mutual Funds
                  </a>
                </div>
              )}
            </div>
            
            {/* Products Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('products')}
                className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors ${
                  isScrolled 
                    ? 'text-gray-900 hover:bg-gray-100' 
                    : 'text-gray-900 hover:bg-white hover:bg-opacity-20'
                }`}
              >
                Products
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                  activeDropdown === 'products' ? 'rotate-180' : ''
                }`} />
              </button>
              
              {activeDropdown === 'products' && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <a 
                    href="#" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Trading Platform
                  </a>
                  <a 
                    href="#" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mobile App
                  </a>
                  <a 
                    href="#" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    API Access
                  </a>
                  <a 
                    href="#" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Research Tools
                  </a>
                </div>
              )}
            </div>
            
            <a 
              href="#" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isScrolled 
                  ? 'text-gray-900 hover:bg-gray-100' 
                  : 'text-gray-900 hover:bg-white hover:bg-opacity-20'
              }`}
            >
              Pricing
            </a>

            <a 
              href="#" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isScrolled 
                  ? 'text-gray-900 hover:bg-gray-100' 
                  : 'text-gray-900 hover:bg-white hover:bg-opacity-20'
              }`}
            >
              Learn
            </a>
          </div>

          {/* Login/Register Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <button
              onClick={onLoginClick}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isScrolled 
                  ? 'text-blue-600 border border-blue-600 hover:bg-blue-50' 
                  : 'text-blue-600 bg-white hover:bg-gray-100 border border-transparent'
              }`}
            >
              Log in
            </button>
            <button
              onClick={onRegisterClick}
              className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Register
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                isScrolled ? 'text-gray-600 hover:text-gray-800' : 'text-gray-800 hover:text-gray-900'
              } hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500`}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
            >
              Home
            </a>
            <button
              onClick={() => toggleDropdown('mobile-markets')}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 flex justify-between items-center"
            >
              Markets
              <ChevronDown className={`h-5 w-5 transition-transform ${
                activeDropdown === 'mobile-markets' ? 'rotate-180' : ''
              }`} />
            </button>
            
            {activeDropdown === 'mobile-markets' && (
              <div className="pl-4 space-y-1">
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Stock Market
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Option Chains
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  IPO
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Mutual Funds
                </a>
              </div>
            )}
            
            <button
              onClick={() => toggleDropdown('mobile-products')}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 flex justify-between items-center"
            >
              Products
              <ChevronDown className={`h-5 w-5 transition-transform ${
                activeDropdown === 'mobile-products' ? 'rotate-180' : ''
              }`} />
            </button>
            
            {activeDropdown === 'mobile-products' && (
              <div className="pl-4 space-y-1">
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Trading Platform
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Mobile App
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  API Access
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Research Tools
                </a>
              </div>
            )}
            
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
            >
              Pricing
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
            >
              Learn
            </a>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-4 flex flex-col space-y-3">
              <button
                onClick={() => {
                  onLoginClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-base font-medium rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Log in
              </button>
              <button
                onClick={() => {
                  onRegisterClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;