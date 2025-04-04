import React, { useState, useEffect } from 'react';
import { 
  Search, TrendingUp, TrendingDown, Filter,
  Star, StarOff, RefreshCw, ExternalLink, LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const StockMarket = () => {
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('symbol');
  const [sortDirection, setSortDirection] = useState('asc');
  const [marketStatus, setMarketStatus] = useState('open');
  const [filterOptions, setFilterOptions] = useState({
    showWatchlistOnly: false,
    selectedExchange: 'all',
    selectedSector: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  
  // Check login status on component mount
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const usertype = localStorage.getItem('usertype');
    setIsLoggedIn(!!authToken);
    if(!authToken){
      navigate('/')
    }
    else if(usertype==='Admin'){
      navigate('/admin/dashboard')
    }
    
    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem('stockWatchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, [isLoggedIn, navigate]);
  
  // Handle logout
  const handleLogout = () => {
    // Delete localStorage items
    localStorage.removeItem('authToken');
    localStorage.removeItem('email');
    localStorage.removeItem('usertype');
    localStorage.removeItem('id');
    
    // Update login state
    setIsLoggedIn(false);
  };
  
  // Mock data for filters
  const exchanges = ['NASDAQ', 'NYSE', 'LSE', 'TSX', 'NSE', 'BSE'];
  const sectors = ['Technology', 'Healthcare', 'Financial Services', 'Consumer Cyclical', 'Energy', 'Utilities', 'Real Estate', 'Communication Services', 'Industrials', 'Basic Materials', 'Consumer Defensive'];
  function getRandomFloat() {
      return Math.random() * 40 - 20;
  }
  const p = 215.43
  useEffect(() => {
    // Fetch stock data
    const fetchStockData = async () => {
      try {
        setLoading(true);
        
        setTimeout(() => {
          const mockData = [
            { 
              id: 'aapl',
              symbol: 'AAPL', 
              name: 'Apple Inc.', 
              price: p+getRandomFloat(), 
              change: 3.51, 
              changePercent: 2.00,
              volume: 78945612,
              marketCap: 2.85e12,
              sector: 'Technology',
              exchange: 'NASDAQ'
            },
            { 
              id: 'msft',
              symbol: 'MSFT', 
              name: 'Microsoft Corporation', 
              price: p+getRandomFloat(), 
              change: 4.05, 
              changePercent: 1.24,
              volume: 25678934,
              marketCap: 2.45e12,
              sector: 'Technology',
              exchange: 'NASDAQ'
            },
            { 
              id: 'googl',
              symbol: 'GOOGL', 
              name: 'Alphabet Inc.', 
              price: p+getRandomFloat(), 
              change: -1.98, 
              changePercent: -1.37,
              volume: 18975345,
              marketCap: 1.85e12,
              sector: 'Communication Services',
              exchange: 'NASDAQ'
            },
            { 
              id: 'amzn',
              symbol: 'AMZN', 
              name: 'Amazon.com Inc.', 
              price: p+getRandomFloat(), 
              change: 2.35, 
              changePercent: 1.30,
              volume: 32456789,
              marketCap: 1.90e12,
              sector: 'Consumer Cyclical',
              exchange: 'NASDAQ'
            },
            { 
              id: 'meta',
              symbol: 'META', 
              name: 'Meta Platforms, Inc.', 
              price: p+getRandomFloat(),  
              change: -0.75, 
              changePercent: -0.23,
              volume: 15687432,
              marketCap: 8.40e11,
              sector: 'Communication Services',
              exchange: 'NASDAQ'
            },
            { 
              id: 'tsla',
              symbol: 'TSLA', 
              name: 'Tesla, Inc.', 
              price: p+getRandomFloat(),  
              change: -5.32, 
              changePercent: -2.91,
              volume: 45678932,
              marketCap: 5.63e11,
              sector: 'Consumer Cyclical',
              exchange: 'NASDAQ'
            },
            { 
              id: 'nvda',
              symbol: 'NVDA', 
              name: 'NVIDIA Corporation', 
              price: p+getRandomFloat(),  
              change: 7.89, 
              changePercent: 1.76,
              volume: 28765439,
              marketCap: 1.12e12,
              sector: 'Technology',
              exchange: 'NASDAQ'
            },
            { 
              id: 'jpm',
              symbol: 'JPM', 
              name: 'JPMorgan Chase & Co.', 
              price: p+getRandomFloat(), 
              change: 0.95, 
              changePercent: 0.65,
              volume: 12345678,
              marketCap: 4.27e11,
              sector: 'Financial Services',
              exchange: 'NYSE'
            },
            { 
              id: 'v',
              symbol: 'V', 
              name: 'Visa Inc.', 
              price: p+getRandomFloat(),  
              change: 1.28, 
              changePercent: 0.50,
              volume: 8765432,
              marketCap: 5.21e11,
              sector: 'Financial Services',
              exchange: 'NYSE'
            },
            { 
              id: 'pg',
              symbol: 'PG', 
              name: 'The Procter & Gamble Company', 
              price: p+getRandomFloat(),  
              change: -0.32, 
              changePercent: -0.20,
              volume: 6543210,
              marketCap: 3.77e11,
              sector: 'Consumer Defensive',
              exchange: 'NYSE'
            },
            { 
              id: 'reliance',
              symbol: 'RELIANCE.NS', 
              name: 'Reliance Industries Limited', 
              price: p+getRandomFloat(),  
              change: 45.30, 
              changePercent: 1.90,
              volume: 3456789,
              marketCap: 1.64e11,
              sector: 'Energy',
              exchange: 'NSE'
            },
            { 
              id: 'hsbc',
              symbol: 'HSBC', 
              name: 'HSBC Holdings plc', 
              price: p+getRandomFloat(),  
              change: 0.25, 
              changePercent: 0.64,
              volume: 5678901,
              marketCap: 7.8e10,
              sector: 'Financial Services',
              exchange: 'LSE'
            }
          ];
          
          // Merge watchlist data with stock data
          const stocksWithWatchlist = mockData.map(stock => ({
            ...stock,
            isWatchlisted: watchlist.includes(stock.id)
          }));
          
          setStocks(stocksWithWatchlist);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError('Failed to fetch stock data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchStockData();
    
    // Simulate real-time price updates
    const priceUpdateInterval = setInterval(() => {
      if (stocks.length > 0) {
        setStocks(prevStocks => 
          prevStocks.map(stock => {
            const randomChange = (Math.random() * 2 - 1) * 0.5; // Random change between -0.5 and +0.5
            const newPrice = parseFloat((stock.price + randomChange).toFixed(2));
            const change = parseFloat((newPrice - (stock.price - stock.change)).toFixed(2));
            const changePercent = parseFloat(((change / (stock.price - stock.change)) * 100).toFixed(2));
            
            return {
              ...stock,
              price: newPrice,
              change: change,
              changePercent: changePercent
            };
          })
        );
      }
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(priceUpdateInterval);
  }, [watchlist]); // Added watchlist as dependency
  
  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort indicator
  const getSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };
  
  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Toggle watchlist status with localStorage persistence
  const toggleWatchlist = (stockId) => {
    setStocks(prevStocks => 
      prevStocks.map(stock => 
        stock.id === stockId 
          ? { ...stock, isWatchlisted: !stock.isWatchlisted } 
          : stock
      )
    );
    
    // Update watchlist state and localStorage
    setWatchlist(prevWatchlist => {
      let newWatchlist;
      if (prevWatchlist.includes(stockId)) {
        newWatchlist = prevWatchlist.filter(id => id !== stockId);
      } else {
        newWatchlist = [...prevWatchlist, stockId];
      }
      
      // Save to localStorage
      localStorage.setItem('stockWatchlist', JSON.stringify(newWatchlist));
      
      return newWatchlist;
    });
  };
  
  // Format functions
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const formatLargeNumber = (value) => {
    if (value >= 1e12) {
      return (value / 1e12).toFixed(2) + 'T';
    } else if (value >= 1e9) {
      return (value / 1e9).toFixed(2) + 'B';
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(2) + 'M';
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(2) + 'K';
    }
    return value.toString();
  };
  
  // Filter and sort stocks
  const filteredAndSortedStocks = [...stocks]
    .filter(stock => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          stock.symbol.toLowerCase().includes(query) ||
          stock.name.toLowerCase().includes(query);
          
        if (!matchesSearch) return false;
      }
      
      // Filter by watchlist
      if (filterOptions.showWatchlistOnly && !stock.isWatchlisted) {
        return false;
      }
      
      // Filter by exchange
      if (filterOptions.selectedExchange !== 'all' && stock.exchange !== filterOptions.selectedExchange) {
        return false;
      }
      
      // Filter by sector
      if (filterOptions.selectedSector !== 'all' && stock.sector !== filterOptions.selectedSector) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Trading Floor</h1>
              <div className="ml-4 flex items-center">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  marketStatus === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {marketStatus === 'open' ? 'Market Open' : 'Market Closed'}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  Last Updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            {/* Navigation links */}
            <div className="mt-4 md:mt-0 md:mr-4 flex space-x-3">
              <Link
                to="/portfolio"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Portfolio
              </Link>
              <Link
                to="/wallet"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Wallet
              </Link>
              <Link
                to="/orders"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Orders
              </Link>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              {/* Login/Logout Button */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Login
                </Link>
              )}
              
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Search className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        {showFilters && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
              <div>
                <label htmlFor="exchange" className="block text-sm font-medium text-gray-700 mb-1">
                  Exchange
                </label>
                <select
                  id="exchange"
                  value={filterOptions.selectedExchange}
                  onChange={(e) => handleFilterChange('selectedExchange', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">All Exchanges</option>
                  {exchanges.map(exchange => (
                    <option key={exchange} value={exchange}>
                      {exchange}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">
                  Sector
                </label>
                <select
                  id="sector"
                  value={filterOptions.selectedSector}
                  onChange={(e) => handleFilterChange('selectedSector', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">All Sectors</option>
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  id="watchlist"
                  type="checkbox"
                  checked={filterOptions.showWatchlistOnly}
                  onChange={(e) => handleFilterChange('showWatchlistOnly', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="watchlist" className="ml-2 block text-sm text-gray-700">
                  Show watchlist only
                </label>
              </div>
              
              <div className="ml-auto">
                <button
                  onClick={() => {
                    setFilterOptions({
                      showWatchlistOnly: false,
                      selectedExchange: 'all',
                      selectedSector: 'all'
                    });
                    setSearchQuery('');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Stock table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {error ? (
            <div className="bg-red-50 p-4 text-red-700">
              {error}
            </div>
          ) : loading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <RefreshCw className="h-10 w-10 text-blue-500 animate-spin" />
              <p className="mt-4 text-gray-500">Loading stock data...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Watchlist
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('symbol')}
                      >
                        Symbol{getSortIndicator('symbol')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        Name{getSortIndicator('name')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('price')}
                      >
                        Price{getSortIndicator('price')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('changePercent')}
                      >
                        Change{getSortIndicator('changePercent')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('volume')}
                      >
                        Volume{getSortIndicator('volume')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('marketCap')}
                      >
                        Market Cap{getSortIndicator('marketCap')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('sector')}
                      >
                        Sector{getSortIndicator('sector')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedStocks.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                          No stocks found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedStocks.map(stock => (
                        <tr key={stock.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleWatchlist(stock.id)}
                              className="text-gray-400 hover:text-yellow-500 focus:outline-none"
                            >
                              {stock.isWatchlisted ? (
                                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                              ) : (
                                <StarOff className="h-5 w-5" />
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-900">{stock.symbol}</span>
                              <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                {stock.exchange}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{stock.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-medium text-gray-900">{formatCurrency(stock.price)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className={`text-sm font-medium flex items-center justify-end ${
                              stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {stock.change >= 0 ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                              )}
                              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm text-gray-900">{formatLargeNumber(stock.volume)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm text-gray-900">{formatLargeNumber(stock.marketCap)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 px-2 py-1">
                              {stock.sector}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link 
                              to={`/trading/${stock.symbol}`}
                              className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                            >
                              View <ExternalLink className="h-4 w-4 ml-1" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Table footer with stats */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{filteredAndSortedStocks.length}</span> of{' '}
                    <span className="font-medium">{stocks.length}</span> stocks
                  </p>
                  <div className="text-sm text-gray-500 flex items-center">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Prices update automatically every 10 seconds
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Index cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">S&P 500</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">4,587.64</p>
              <p className="ml-2 flex items-center text-sm font-medium text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +35.88 (+0.79%)
              </p>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">NASDAQ</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">14,346.02</p>
              <p className="ml-2 flex items-center text-sm font-medium text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +210.62 (+1.49%)
              </p>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Dow Jones</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">36,142.22</p>
              <p className="ml-2 flex items-center text-sm font-medium text-red-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                -45.41 (-0.13%)
              </p>
            </div>
          </div>
        </div>
        
        {/* Watchlist Summary */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Watchlist</h3>
          {watchlist.length === 0 ? (
            <p className="text-gray-500">You haven't added any stocks to your watchlist yet. Click the star icon next to any stock to add it to your watchlist.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stocks
                .filter(stock => watchlist.includes(stock.id))
                .map(stock => (
                  <div key={stock.id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{stock.symbol}</h4>
                        <p className="text-sm text-gray-500">{stock.name}</p>
                      </div>
                      <button
                        onClick={() => toggleWatchlist(stock.id)}
                        className="text-yellow-500"
                      >
                        <Star className="h-5 w-5 fill-yellow-500" />
                      </button>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span className="text-lg font-semibold">{formatCurrency(stock.price)}</span>
                      <span className={`flex items-center ${
                        stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stock.change >= 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StockMarket;