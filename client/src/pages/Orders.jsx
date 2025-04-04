import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowUpDown, TrendingUp, TrendingDown, Filter, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterType, setFilterType] = useState('all');
  const [filterSymbol, setFilterSymbol] = useState('');
  const [uniqueSymbols, setUniqueSymbols] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Get user ID from localStorage
        const userId = localStorage.getItem('id');
        
        if (!userId) {
          navigate('/login');
          return;
        }
        
        // Fetch orders from API
        const response = await fetch(`http://localhost:3001/api/user/order/${userId}`);
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch orders');
        }
        
        // Extract unique symbols for filter dropdown
        const symbols = [...new Set(result.data.map(order => order.symbol))];
        setUniqueSymbols(symbols);
        
        setOrders(result.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to fetch orders');
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [navigate]);

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
  
  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Calculate total value
  const calculateTotal = (price, units) => {
    return formatCurrency(price * units);
  };
  
  // Filter and sort orders
  const filteredAndSortedOrders = [...orders]
    .filter(order => {
      // Filter by type
      if (filterType !== 'all' && order.type !== filterType) {
        return false;
      }
      
      // Filter by symbol
      if (filterSymbol && order.symbol !== filterSymbol) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Special handling for date fields
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      // Special handling for numeric fields
      if (sortField === 'price' || sortField === 'units') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Calculate summary statistics
  const calculateStats = () => {
    const buyOrders = orders.filter(order => order.type === 'Buy');
    const sellOrders = orders.filter(order => order.type === 'Sell');
    
    const totalBuyValue = buyOrders.reduce((sum, order) => sum + (order.price * parseFloat(order.units)), 0);
    const totalSellValue = sellOrders.reduce((sum, order) => sum + (order.price * parseFloat(order.units)), 0);
    
    const totalBuyUnits = buyOrders.reduce((sum, order) => sum + parseFloat(order.units), 0);
    const totalSellUnits = sellOrders.reduce((sum, order) => sum + parseFloat(order.units), 0);
    
    return {
      totalOrders: orders.length,
      buyOrders: buyOrders.length,
      sellOrders: sellOrders.length,
      totalBuyValue,
      totalSellValue,
      totalBuyUnits,
      totalSellUnits,
      netValue: totalBuyValue - totalSellValue,
      netUnits: totalBuyUnits - totalSellUnits
    };
  };
  
  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <Link to="/market" className="mr-4">
                <ChevronLeft className="h-5 w-5 text-gray-500" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pr-8 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Orders</option>
                  <option value="Buy">Buy Orders</option>
                  <option value="Sell">Sell Orders</option>
                </select>
              </div>
              
              <div className="relative">
                <select
                  value={filterSymbol}
                  onChange={(e) => setFilterSymbol(e.target.value)}
                  className="pr-8 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Symbols</option>
                  {uniqueSymbols.map(symbol => (
                    <option key={symbol} value={symbol}>{symbol}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={() => {
                  setFilterType('all');
                  setFilterSymbol('');
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Filter className="h-5 w-5 mr-2" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics cards */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-2xl font-semibold mt-1">{stats.totalOrders}</p>
            <div className="mt-1 text-sm text-gray-500">
              <span className="text-green-600">{stats.buyOrders} Buy</span> / <span className="text-red-600">{stats.sellOrders} Sell</span>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Buy Value</h3>
            <p className="text-2xl font-semibold mt-1 text-green-600">{formatCurrency(stats.totalBuyValue)}</p>
            <div className="mt-1 text-sm text-gray-500">
              {stats.totalBuyUnits.toFixed(0)} Units
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Sell Value</h3>
            <p className="text-2xl font-semibold mt-1 text-red-600">{formatCurrency(stats.totalSellValue)}</p>
            <div className="mt-1 text-sm text-gray-500">
              {stats.totalSellUnits.toFixed(0)} Units
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Net Value</h3>
            <p className={`text-2xl font-semibold mt-1 ${stats.netValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(Math.abs(stats.netValue))}
            </p>
            <div className="mt-1 text-sm text-gray-500">
              {stats.netValue >= 0 ? 'Investment' : 'Return'}
            </div>
          </div>
        </div>
        
        {/* Orders table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {error ? (
            <div className="bg-red-50 p-4 text-red-700">
              {error}
            </div>
          ) : loading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <RefreshCw className="h-10 w-10 text-blue-500 animate-spin" />
              <p className="mt-4 text-gray-500">Loading orders...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('createdAt')}
                      >
                        Date{getSortIndicator('createdAt')}
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('type')}
                      >
                        Type{getSortIndicator('type')}
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
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('units')}
                      >
                        Units{getSortIndicator('units')}
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
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          No orders found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedOrders.map(order => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.type === 'Buy' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {order.type === 'Buy' ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {order.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.symbol}</div>
                            <div className="text-xs text-gray-500">{order.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {parseFloat(order.units).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            {formatCurrency(order.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <span className={order.type === 'Buy' ? 'text-green-600' : 'text-red-600'}>
                              {calculateTotal(order.price, order.units)}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Table footer */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{filteredAndSortedOrders.length}</span> of{' '}
                    <span className="font-medium">{orders.length}</span> orders
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;