// src/pages/StockDetails.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Clock, DollarSign, 
  ArrowUp, ArrowDown, Star, Activity, Volume2, Info
} from 'lucide-react';
import { useParams } from 'react-router-dom';

const StockDetails = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchlisted, setWatchlisted] = useState(false);
  const [timeRange, setTimeRange] = useState('1d'); // 1d, 1w, 1m, 3m, 1y, 5y
  
  // Mock price history data
  const priceHistoryData = {
    '1d': generatePriceData(24, 'hourly'),
    '1w': generatePriceData(7, 'daily'),
    '1m': generatePriceData(30, 'daily'),
    '3m': generatePriceData(90, 'daily'),
    '1y': generatePriceData(12, 'monthly'),
    '5y': generatePriceData(60, 'monthly')
  };
  
  // Generate mock price data
  function generatePriceData(points, interval) {
    const data = [];
    let basePrice = 150 + Math.random() * 50;
    let date = new Date();
    
    for (let i = points; i >= 0; i--) {
      const volatility = Math.random() * 0.06 - 0.03; // -3% to +3%
      basePrice = basePrice * (1 + volatility);
      let timePoint;
      
      switch(interval) {
        case 'hourly':
          timePoint = new Date(date);
          timePoint.setHours(date.getHours() - i);
          break;
        case 'daily':
          timePoint = new Date(date);
          timePoint.setDate(date.getDate() - i);
          break;
        case 'monthly':
          timePoint = new Date(date);
          timePoint.setMonth(date.getMonth() - i);
          break;
        default:
          timePoint = new Date(date);
      }
      
      data.push({
        time: timePoint.toISOString(),
        price: parseFloat(basePrice.toFixed(2))
      });
    }
    
    return data;
  }
  
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would fetch from an API:
        // const response = await fetch(`/api/stocks/${symbol}`);
        // const data = await response.json();
        
        // For demo, using mock data
        setTimeout(() => {
          // Mock data for demonstration
          const mockData = {
            symbol: symbol || 'AAPL',
            name: symbol === 'MSFT' ? 'Microsoft Corporation' : 
                  symbol === 'GOOGL' ? 'Alphabet Inc.' : 
                  symbol === 'AMZN' ? 'Amazon.com Inc.' : 
                  symbol === 'META' ? 'Meta Platforms, Inc.' : 
                  'Apple Inc.',
            price: 178.72 + (Math.random() * 10 - 5), // Random price around $178.72
            change: 3.51 + (Math.random() * 2 - 1), // Random change around $3.51
            changePercent: 2.0 + (Math.random() * 1 - 0.5), // Random percent around 2.0%
            volume: 80456789,
            marketCap: 2.85e12, // 2.85 trillion
            peRatio: 29.48,
            dividend: 0.92,
            dividendYield: 0.51,
            eps: 6.07,
            high52Week: 198.23,
            low52Week: 124.17,
            avgVolume: 64573800,
            open: 176.15,
            previousClose: 175.21,
            dayHigh: 180.42,
            dayLow: 175.82,
            exchange: 'NASDAQ',
            sector: 'Technology',
            industry: 'Consumer Electronics',
            description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, a line of smartphones.'
          };
          
          setStockData(mockData);
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
      if (stockData) {
        setStockData(prevData => {
          const randomChange = (Math.random() * 2 - 1) * 0.5; // Random change between -0.5 and +0.5
          const newPrice = parseFloat((prevData.price + randomChange).toFixed(2));
          const change = parseFloat((newPrice - prevData.previousClose).toFixed(2));
          const changePercent = parseFloat(((change / prevData.previousClose) * 100).toFixed(2));
          
          return {
            ...prevData,
            price: newPrice,
            change: change,
            changePercent: changePercent
          };
        });
      }
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(priceUpdateInterval);
  }, [symbol]);
  
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
  
  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };
  
  const formatTime = (isoString, range) => {
    const date = new Date(isoString);
    
    if (range === '1d') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (range === '1w' || range === '1m' || range === '3m') {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { month: 'short', year: 'numeric' });
    }
  };
  
  // Calculate chart dimensions
  const chartData = priceHistoryData[timeRange] || [];
  const prices = chartData.map(item => item.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  
  // Calculate chart path
  const getChartPath = () => {
    if (!chartData.length) return '';
    
    const width = 800;
    const height = 300;
    const padding = 50;
    
    const xScale = (width - padding * 2) / (chartData.length - 1);
    const yScale = (height - padding * 2) / priceRange;
    
    let path = `M ${padding} ${height - padding - (chartData[0].price - minPrice) * yScale}`;
    
    for (let i = 1; i < chartData.length; i++) {
      const x = padding + i * xScale;
      const y = height - padding - (chartData[i].price - minPrice) * yScale;
      path += ` L ${x} ${y}`;
    }
    
    return path;
  };
  
  // Toggle watchlist status
  const toggleWatchlist = () => {
    setWatchlisted(!watchlisted);
  };
  
  // Buy stock (mock function)
  const buyStock = () => {
    alert(`Buy order placed for ${stockData.symbol}`);
  };
  
  // Sell stock (mock function)
  const sellStock = () => {
    alert(`Sell order placed for ${stockData.symbol}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              {loading ? (
                <div className="animate-pulse h-8 w-28 bg-gray-200 rounded"></div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-900">{stockData?.symbol}</h1>
                  <span className="ml-4 text-lg text-gray-500">{stockData?.name}</span>
                  <span className="ml-3 px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                    {stockData?.exchange}
                  </span>
                </>
              )}
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                onClick={toggleWatchlist}
                className={`inline-flex items-center px-4 py-2 border ${
                  watchlisted 
                    ? 'border-yellow-300 bg-yellow-50 text-yellow-800' 
                    : 'border-gray-300 bg-white text-gray-700'
                } rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <Star className={`mr-2 h-5 w-5 ${watchlisted ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                {watchlisted ? 'Watchlisted' : 'Add to Watchlist'}
              </button>
              
              <button
                onClick={buyStock}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Buy
              </button>
              
              <button
                onClick={sellStock}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sell
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading stock data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Price section */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex flex-col lg:flex-row lg:justify-between">
                <div>
                  <div className="flex items-baseline">
                    <h2 className="text-4xl font-bold text-gray-900">{formatCurrency(stockData.price)}</h2>
                    <div className={`ml-4 flex items-center ${
                      stockData.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stockData.change >= 0 ? (
                        <ArrowUp className="h-5 w-5 mr-1" />
                      ) : (
                        <ArrowDown className="h-5 w-5 mr-1" />
                      )}
                      <span className="text-lg font-semibold">
                        {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.change >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Last updated: {new Date().toLocaleTimeString()}
                  </p>
                </div>
                
                <div className="mt-6 lg:mt-0 flex items-center">
                  <div className="flex space-x-2">
                    {['1d', '1w', '1m', '3m', '1y', '5y'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          timeRange === range
                            ? 'bg-blue-100 text-blue-800'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Price chart */}
              <div className="mt-6 relative h-80">
                <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none">
                  {/* Chart grid lines */}
                  <g className="grid">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={`grid-${i}`}
                        x1="50"
                        y1={50 + i * 50}
                        x2="750"
                        y2={50 + i * 50}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    ))}
                  </g>
                  
                  {/* Price line */}
                  <path
                    d={getChartPath()}
                    fill="none"
                    stroke={stockData.change >= 0 ? '#10b981' : '#ef4444'}
                    strokeWidth="2"
                  />
                  
                  {/* Areas for current and start price labels */}
                  <circle
                    cx="750"
                    cy={250 - ((chartData[chartData.length - 1]?.price - minPrice) / priceRange) * 200}
                    r="4"
                    fill={stockData.change >= 0 ? '#10b981' : '#ef4444'}
                  />
                  
                  {/* Price labels */}
                  <text x="755" y="50" className="text-xs" fill="#6b7280">
                    {formatCurrency(maxPrice)}
                  </text>
                  <text x="755" y="250" className="text-xs" fill="#6b7280">
                    {formatCurrency(minPrice)}
                  </text>
                </svg>
                
                {/* X-axis labels */}
                <div className="flex justify-between px-12 mt-2 text-xs text-gray-500">
                  {chartData.filter((_, i) => i % Math.ceil(chartData.length / 6) === 0).map((item, i) => (
                    <span key={`label-${i}`}>
                      {formatTime(item.time, timeRange)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Stock info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key statistics */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Previous Close</p>
                    <p className="text-lg font-medium">{formatCurrency(stockData.previousClose)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Open</p>
                    <p className="text-lg font-medium">{formatCurrency(stockData.open)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Day Range</p>
                    <p className="text-lg font-medium">{formatCurrency(stockData.dayLow)} - {formatCurrency(stockData.dayHigh)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">52 Week Range</p>
                    <p className="text-lg font-medium">{formatCurrency(stockData.low52Week)} - {formatCurrency(stockData.high52Week)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Volume</p>
                    <p className="text-lg font-medium">{formatNumber(stockData.volume)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg. Volume</p>
                    <p className="text-lg font-medium">{formatNumber(stockData.avgVolume)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Market Cap</p>
                    <p className="text-lg font-medium">{formatLargeNumber(stockData.marketCap)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">P/E Ratio</p>
                    <p className="text-lg font-medium">{stockData.peRatio.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">EPS</p>
                    <p className="text-lg font-medium">{formatCurrency(stockData.eps)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dividend Yield</p>
                    <p className="text-lg font-medium">{stockData.dividendYield.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
              
              {/* About section */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About {stockData.name}</h3>
                <div className="space-y-4">
                  <p className="text-gray-700">{stockData.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Sector</p>
                      <p className="text-lg font-medium">{stockData.sector}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Industry</p>
                      <p className="text-lg font-medium">{stockData.industry}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Exchange</p>
                      <p className="text-lg font-medium">{stockData.exchange}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Market sentiment and indicators */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Sentiment</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Trading signals */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Activity className="h-5 w-5 text-gray-700 mr-2" />
                    <h4 className="text-base font-medium text-gray-900">Technical Indicators</h4>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Moving Average</span>
                      <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">Buy</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">RSI (14)</span>
                      <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">Neutral</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">MACD</span>
                      <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">Buy</span>
                    </div>
                  </div>
                </div>
                
                {/* Price targets */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-5 w-5 text-gray-700 mr-2" />
                    <h4 className="text-base font-medium text-gray-900">Analyst Ratings</h4>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Consensus</span>
                      <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">Buy</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Price Target</span>
                      <span className="text-sm font-medium">{formatCurrency(stockData.price * 1.15)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Upside</span>
                      <span className="text-sm font-medium text-green-600">+15.0%</span>
                    </div>
                  </div>
                </div>
                
                {/* Insider activity */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Info className="h-5 w-5 text-gray-700 mr-2" />
                    <h4 className="text-base font-medium text-gray-900">Insider Activity</h4>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Net Purchases (3m)</span>
                      <span className="text-sm font-medium text-green-600">+45,320 shares</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Net Sales (3m)</span>
                      <span className="text-sm font-medium text-red-600">-12,500 shares</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Insider Ownership</span>
                      <span className="text-sm font-medium">0.06%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StockDetails;