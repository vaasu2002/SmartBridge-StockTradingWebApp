import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Loader, 
  RefreshCw,
  Search,
  DollarSign,
  PieChart,
  TrendingUp,
  ChevronLeft
} from 'lucide-react';

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const [totalPercentChange, setTotalPercentChange] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [portfolioWithChange, setPortfolioWithChange] = useState([]);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user ID from localStorage
      const userId = localStorage.getItem('id');
      
      if (!userId) {
        setError('User ID not found in localStorage');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`http://localhost:3001/api/user/portfolio/${userId}`);
      const result = await response.json();
      
      if (result.success) {
        setPortfolio(result.data);
        
        // Add random daily change to each stock for demonstration
        const portfolioWithChanges = result.data.map(stock => {
          const changePercent = (Math.random() * 10) - 5; // Random between -5% and +5%
          const changeValue = stock.totalPrice * (changePercent / 100);
          
          return {
            ...stock,
            changePercent,
            changeValue
          };
        });
        
        setPortfolioWithChange(portfolioWithChanges);
        
        // Calculate total portfolio value and weighted percent change
        let totalStockValue = 0;
        let totalChangeValue = 0;
        
        portfolioWithChanges.forEach(stock => {
          totalStockValue += stock.totalPrice;
          totalChangeValue += stock.changeValue;
        });
        
        const overallPercentChange = totalStockValue > 0
          ? (totalChangeValue / totalStockValue) * 100
          : 0;
          
        setTotalPercentChange(overallPercentChange);
        setTotalValue(totalStockValue*(overallPercentChange/100));
      } else {
        setError(result.message || 'Failed to fetch portfolio data');
      }
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError('Network error when fetching portfolio data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPortfolio();
  };

  const filteredPortfolio = searchTerm 
    ? portfolioWithChange.filter(stock => 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : portfolioWithChange;

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Format percentage values
  const formatPercentage = (value) => {
    const formattedValue = Math.abs(value).toFixed(2);
    return value >= 0 ? `+${formattedValue}%` : `-${formattedValue}%`;
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Link to="/market" className="mr-2">
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">My Portfolio</h1>
        </div>
        <p className="text-gray-600">Track your investments and performance</p>
        
        {/* Portfolio summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-gray-600 font-medium">Oversall profit</h2>
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? 
                <div className="animate-pulse h-8 w-28 bg-gray-200 rounded"></div> :
                formatCurrency(totalValue)
              }
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-gray-600 font-medium">Assets</h2>
              <PieChart className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? 
                <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div> :
                portfolio.length
              }
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-gray-600 font-medium">Daily Change</h2>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-center">
              {loading ? (
                <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
              ) : (
                <>
                  <span className={`text-2xl font-bold ${totalPercentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(totalPercentChange)}
                  </span>
                  <span className="text-gray-500 ml-2">Today</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="relative w-full md:w-72 mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {refreshing ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span>Refresh</span>
          </button>
        </div>
        
        {/* Portfolio list */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">
              <p>{error}</p>
              <button 
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredPortfolio.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {searchTerm ? (
                <p>No stocks matching "{searchTerm}" found in your portfolio.</p>
              ) : (
                <p>Your portfolio is empty. Start investing to see your holdings here.</p>
              )}
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="hidden md:grid grid-cols-7 bg-gray-50 p-4 border-b border-gray-200 font-medium text-gray-600 text-sm">
                <div className="col-span-2">Stock</div>
                <div className="text-right">Price</div>
                <div className="text-right">Units</div>
                <div className="text-right">Total Value</div>
                <div className="text-right">24h Change</div>
                <div className="text-right">Actions</div>
              </div>
              
              {/* Table rows */}
              <div className="divide-y divide-gray-100">
                {filteredPortfolio.map((stock) => {
                  return (
                    <div key={stock._id} className="md:grid grid-cols-7 p-4 hover:bg-gray-50 flex flex-wrap gap-2">
                      <div className="col-span-2 flex flex-col md:flex-row md:items-center">
                        <Link 
                          to={`/trading/${stock.symbol}`}
                          className="text-lg font-semibold text-blue-600 hover:underline"
                        >
                          {stock.symbol}
                        </Link>
                        <span className="md:ml-2 text-xs text-gray-500">{stock.stockExchange}</span>
                      </div>
                      
                      <div className="text-right flex items-center justify-between md:justify-end mt-2 md:mt-0">
                        <span className="md:hidden text-sm text-gray-500">Price:</span>
                        <span className="font-medium">{formatCurrency(stock.price)}</span>
                      </div>
                      
                      <div className="text-right flex items-center justify-between md:justify-end mt-2 md:mt-0">
                        <span className="md:hidden text-sm text-gray-500">Units:</span>
                        <span className="font-medium">{stock.units}</span>
                      </div>
                      
                      <div className="text-right flex items-center justify-between md:justify-end mt-2 md:mt-0">
                        <span className="md:hidden text-sm text-gray-500">Total Value:</span>
                        <span className="font-medium">{formatCurrency(stock.totalPrice)}</span>
                      </div>
                      
                      <div className="text-right flex items-center justify-between md:justify-end mt-2 md:mt-0">
                        <span className="md:hidden text-sm text-gray-500">24h Change:</span>
                        <div className={`flex items-center ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.changePercent >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                          )}
                          <span className="font-medium">{formatPercentage(stock.changePercent)}</span>
                        </div>
                      </div>
                      
                      <div className="text-right flex items-center justify-between md:justify-end mt-2 md:mt-0 w-full md:w-auto">
                        <span className="md:hidden text-sm text-gray-500">Actions:</span>
                        <div>
                          <Link 
                            to={`/trading/${stock.symbol}`}
                            className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 hover:bg-blue-100 transition-colors"
                          >
                            Trade
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PortfolioPage;