import React, { useState, useEffect } from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import { 
  Plus, Minus, Search, Maximize, Home, 
  ChevronDown, Settings, Star, Clock, BarChart,
  TrendingUp, TrendingDown, DollarSign, CreditCard,ChevronLeft
} from 'lucide-react';

const StockDetailView = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [productType, setProductType] = useState('Intraday');
  const [totalPrice, setTotalPrice] = useState(0);
  const [hoveredCandle, setHoveredCandle] = useState(null);
  const [touchMode, setTouchMode] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [userId, setUserId] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderType, setOrderType] = useState('Buy'); // Track the current order type (Buy or Sell)
  
  // Mock candle data
  let candleData = [
    { time: '08:55:00', open: 228.10, high: 228.45, low: 227.90, close: 228.30 },
    { time: '09:00:00', open: 228.30, high: 229.20, low: 228.25, close: 229.00 },
    { time: '09:05:00', open: 229.00, high: 229.35, low: 228.80, close: 229.20 },
    { time: '09:10:00', open: 229.20, high: 229.40, low: 229.00, close: 229.15 },
    { time: '09:15:00', open: 229.15, high: 229.30, low: 228.50, close: 228.60 },
    { time: '09:20:00', open: 228.60, high: 228.75, low: 228.20, close: 228.30 },
    { time: '09:25:00', open: 228.30, high: 228.60, low: 227.90, close: 228.00 },
    { time: '09:30:00', open: 228.00, high: 228.20, low: 227.60, close: 227.70 },
    { time: '09:35:00', open: 227.70, high: 227.90, low: 227.20, close: 227.50 },
    { time: '09:40:00', open: 227.50, high: 227.70, low: 227.30, close: 227.40 },
    { time: '09:45:00', open: 227.40, high: 227.60, low: 227.00, close: 227.20 },
    { time: '09:50:00', open: 227.20, high: 227.90, low: 227.10, close: 227.80 },
    { time: '09:55:00', open: 227.80, high: 227.95, low: 227.60, close: 227.70 },
    { time: '10:00:00', open: 227.70, high: 228.10, low: 227.60, close: 228.00 },
    { time: '10:05:00', open: 228.00, high: 228.20, low: 227.80, close: 227.90 },
    { time: '10:10:00', open: 227.90, high: 228.00, low: 227.20, close: 227.30 },
    { time: '10:15:00', open: 227.30, high: 227.40, low: 226.80, close: 226.90 },
    { time: '10:20:00', open: 226.90, high: 227.10, low: 226.70, close: 226.80 },
    { time: '10:25:00', open: 226.80, high: 226.90, low: 226.40, close: 226.50 },
    { time: '10:30:00', open: 226.50, high: 226.70, low: 226.20, close: 226.40 },
    { time: '10:35:00', open: 226.40, high: 226.50, low: 225.80, close: 225.90 },
  ];
  
  useEffect(() => {
    // Get user ID from localStorage
    const storedUserId = localStorage.getItem('id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Default user ID if not found in localStorage (for testing purposes)
      setUserId('67ef5e085099893fe4cda417');
    }
    
    // Detect touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setTouchMode(isTouchDevice);
    
    const fetchStockData = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would fetch from a market data API
        // For demo, using fixed data that matches your screenshot
        setTimeout(() => {
          const mockData = {
            symbol: symbol || 'TSLA',
            exchange: 'NASDAQ',
            open: 225.86,
            high: 226.13,
            low: 225.84,
            close: 225.96001,
            price: 225.60001+getRandomFloat(), // Current price
            change: -0.36,
            changePercent: -0.16,
            volume: 28976543,
            marketCap: 715.2e9,
            pe: 67.82,
            sector: "Automotive",
            name: "Tesla, Inc." // Adding company name for the API
          };
          
          setStockData(mockData);
          setLoading(false);
        }, 500);
        
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setLoading(false);
      }
    };
    
    fetchStockData();
  }, [symbol]);
  
  // Update total price when quantity or price changes
  useEffect(() => {
    if (stockData && quantity > 0) {
      const total = quantity * stockData.price;
      setTotalPrice(total.toFixed(2));
    } else {
      setTotalPrice('0.00');
    }
  }, [quantity, stockData]);
  
  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && parseInt(value) >= 0)) {
      setQuantity(value === '' ? 0 : parseInt(value, 10));
      
      // Immediately update total price for better UX
      if (stockData && value !== '' && !isNaN(value)) {
        const total = parseInt(value, 10) * stockData.price;
        setTotalPrice(total.toFixed(2));
      } else {
        setTotalPrice('0.00');
      }
    }
  };
  
  // Handle mouse/touch over candle - debounced to reduce flickering
  const handleCandleInteraction = (index) => {
    // Use setTimeout to debounce rapid hover changes
    if (hoveredCandle !== index) {
      setHoveredCandle(index);
    }
  };
  
  // Handle mouse/touch leave with slight delay
  const handleInteractionEnd = () => {
    if (!touchMode) {
      // Small timeout to prevent flickering when moving between candles
      setTimeout(() => {
        setHoveredCandle(prev => {
          // Only clear if it hasn't been changed again
          if (prev !== null && document.querySelector(':hover') === null) {
            return null;
          }
          return prev;
        });
      }, 100);
    }
  };
  
  // Toggle watchlist status
  const toggleWatchlist = () => {
    setIsWatchlisted(!isWatchlisted);
  };
  
  // Set order type (Buy or Sell)
  const setActiveOrderType = (type) => {
    setOrderType(type);
  };
  
  // Buy stock function
  const handleBuy = async () => {
    if (quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log(quantity)
      const response = await fetch('http://localhost:3001/api/user/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: userId,
          type: 'Buy',
          units: quantity,
          price: stockData.price*quantity,
          symbol: stockData.symbol,
          name: stockData.name
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setOrderStatus({
          success: true,
          message: `Buy order placed for ${quantity} shares of ${stockData.symbol}`,
          data: result.data
        });
        
      } else {
        setOrderStatus({
          success: false,
          message: result.message || 'Failed to place order'
        });
      }
    } catch (error) {
      console.error('Error placing buy order:', error);
      setOrderStatus({
        success: false,
        message: 'Network error when placing order'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Sell stock function
  const handleSell = async () => {
    if (quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/user/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: userId,
          type: 'Sell',
          units: quantity,
          price: stockData.price*quantity,
          symbol: stockData.symbol,
          name: stockData.name
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setOrderStatus({
          success: true,
          message: `Sell order placed for ${quantity} shares of ${stockData.symbol}`,
          data: result.data
        });
        
        // Could navigate to orders or portfolio page
        // navigate('/orders');
      } else {
        setOrderStatus({
          success: false,
          message: result.message || 'Failed to place order'
        });
      }
    } catch (error) {
      console.error('Error placing sell order:', error);
      setOrderStatus({
        success: false,
        message: 'Network error when placing order'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Submit order based on current order type
  const handleSubmitOrder = () => {
    if (orderType === 'Buy') {
      handleBuy();
    } else {
      handleSell();
    }
  };
  
  // Format large numbers (e.g., volume, market cap)
  const formatLargeNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };
  
  // Find min and max price for chart scaling
  function getRandomFloat() {
      return Math.random() * 40 - 20;
  }
  const allPrices = candleData.flatMap(candle => [candle.high, candle.low]);
  const maxPrice = Math.max(...allPrices);
  const minPrice = Math.min(...allPrices);
  const priceRange = maxPrice - minPrice;
  
  // Add padding to price range
  const paddedMax = Math.ceil((maxPrice + priceRange * 0.05) * 10) / 10;
  const paddedMin = Math.floor((minPrice - priceRange * 0.05) * 10) / 10;
  const paddedRange = paddedMax - paddedMin;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <Link to="/market" className="mr-2 flex items-center">
              <ChevronLeft className="h-5 w-5 text-gray-500 mr-1" />
            </Link>
            {/* Stock header with controls */}
            <div className="bg-white shadow-md rounded-lg p-5">
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center mb-4 sm:mb-0">
                  <h2 className="text-2xl font-bold text-gray-900 mr-2">
                    {stockData.symbol}
                  </h2>
                  <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
                    {stockData.exchange}
                  </span>
                  <div className="ml-4">
                    <div className="text-xl font-semibold">${stockData.price.toFixed(2)}</div>
                    <div className={`text-sm font-medium ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.change >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleWatchlist}
                    className={`p-2 rounded-full ${isWatchlisted ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200 transition-colors`}
                    title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
                  >
                    <Star className={`h-5 w-5 ${isWatchlisted ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" title="Zoom In">
                    <Plus className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" title="Zoom Out">
                    <Minus className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" title="Search">
                    <Search className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" title="Fullscreen">
                    <Maximize className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" title="Home">
                    <Home className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" title="Settings">
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Stock quick stats */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <BarChart className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-500">Volume</div>
                    <div className="font-medium">{formatLargeNumber(stockData.volume)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-500">Market Cap</div>
                    <div className="font-medium">{formatLargeNumber(stockData.marketCap)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-500">P/E Ratio</div>
                    <div className="font-medium">{stockData.pe.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-500">Sector</div>
                    <div className="font-medium">{stockData.sector}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Time selector tabs */}
            <div className="flex space-x-1 bg-white shadow-md p-1 rounded-lg w-max">
              <button className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white">1D</button>
              <button className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">1W</button>
              <button className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">1M</button>
              <button className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">3M</button>
              <button className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">1Y</button>
              <button className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">5Y</button>
            </div>
            
            {/* Chart and order panel */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Chart container */}
              <div className="flex-1 bg-white shadow-md rounded-lg overflow-hidden">
                {/* Chart content remains the same */}
                <div className="relative h-[400px] md:h-[500px]">
                  {/* Current time indicator */}
                  <div className="absolute top-4 left-4 bg-white bg-opacity-80 px-3 py-1 rounded-full flex items-center space-x-2 text-sm font-medium text-gray-600 border border-gray-200 z-10">
                    <Clock className="h-4 w-4" />
                    <span>{new Date().toLocaleTimeString()}</span>
                  </div>
                  
                  {/* Interactive hover information */}
                  {hoveredCandle !== null && (
                    <div className="absolute z-20 right-4 top-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg border border-gray-200">
                      <div className="font-medium text-gray-900 mb-2">{candleData[hoveredCandle].time}</div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div className="text-sm text-gray-600">Open:</div>
                        <div className="text-sm font-medium text-gray-900">${candleData[hoveredCandle].open.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">High:</div>
                        <div className="text-sm font-medium text-gray-900">${candleData[hoveredCandle].high.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">Low:</div>
                        <div className="text-sm font-medium text-gray-900">${candleData[hoveredCandle].low.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">Close:</div>
                        <div className="text-sm font-medium text-gray-900">${candleData[hoveredCandle].close.toFixed(2)}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Chart */}
                  <div className="w-full h-full">
                    <svg 
                      viewBox={`0 0 1000 400`} 
                      className="w-full h-full"
                      preserveAspectRatio="none"
                    >
                      {/* Price grid lines and labels */}
                      {Array.from({ length: 6 }, (_, i) => {
                        const price = paddedMax - (i * (paddedRange / 5));
                        const y = (400 * (paddedMax - price) / paddedRange);
                        return (
                          <g key={`grid-${i}`}>
                            <line 
                              x1="50" 
                              y1={y} 
                              x2="1000" 
                              y2={y} 
                              stroke="#e5e7eb" 
                              strokeWidth="1" 
                            />
                            <text 
                              x="10" 
                              y={y + 4} 
                              fontSize="12" 
                              fill="#6b7280"
                            >
                              {price.toFixed(2)}
                            </text>
                          </g>
                        );
                      })}
                      
                      {/* Vertical grid lines (time divisions) */}
                      {Array.from({ length: 5 }, (_, i) => {
                        const x = 50 + ((950 - 50) * (i + 1) / 5);
                        return (
                          <line 
                            key={`vgrid-${i}`}
                            x1={x} 
                            y1="0" 
                            x2={x} 
                            y2="370" 
                            stroke="#e5e7eb" 
                            strokeWidth="1" 
                          />
                        );
                      })}
                      
                      {/* Background highlight for selected candle - rendered first */}
                      {hoveredCandle !== null && (
                        <rect
                          x={50 + ((950 - 50) * hoveredCandle / (candleData.length - 1)) - 15}
                          y={0}
                          width={30}
                          height={400}
                          fill={candleData[hoveredCandle].close >= candleData[hoveredCandle].open 
                            ? "rgba(16, 185, 129, 0.1)" 
                            : "rgba(239, 68, 68, 0.1)"
                          }
                        />
                      )}
                      
                      {/* Candles */}
                      {candleData.map((candle, i) => {
                        const x = 50 + ((950 - 50) * i / (candleData.length - 1));
                        const width = 8;
                        
                        // Calculate y positions
                        const openY = 400 * (paddedMax - candle.open) / paddedRange;
                        const closeY = 400 * (paddedMax - candle.close) / paddedRange;
                        const highY = 400 * (paddedMax - candle.high) / paddedRange;
                        const lowY = 400 * (paddedMax - candle.low) / paddedRange;
                        
                        // Determine if bullish (green) or bearish (red)
                        const isBullish = candle.close >= candle.open;
                        const color = isBullish ? "#10b981" : "#ef4444";
                        const isHighlighted = hoveredCandle === i;
                        
                        return (
                          <g key={`candle-${i}`}>
                            {/* Wick */}
                            <line 
                              x1={x} 
                              y1={highY} 
                              x2={x} 
                              y2={lowY} 
                              stroke={isHighlighted ? (isBullish ? "#047857" : "#b91c1c") : color} 
                              strokeWidth={isHighlighted ? "2" : "1"} 
                              pointerEvents="none"
                            />
                            
                            {/* Body */}
                            <rect 
                              x={x - width/2} 
                              y={isBullish ? openY : closeY} 
                              width={width} 
                              height={Math.abs(closeY - openY) || 1} 
                              fill={isHighlighted ? (isBullish ? "#047857" : "#b91c1c") : color}
                              pointerEvents="none"
                            />
                            
                            {/* Time labels (every 5th candle) */}
                            {i % 5 === 0 && (
                              <text 
                                x={x} 
                                y="395" 
                                fontSize="10" 
                                fill="#6b7280" 
                                textAnchor="middle"
                                pointerEvents="none"
                              >
                                {candle.time}
                              </text>
                            )}
                            
                            {/* Invisible touch/hover area - render last */}
                            <rect 
                              x={x - 15} 
                              y={0} 
                              width={30} 
                              height={400} 
                              fill="transparent"
                              onMouseEnter={() => handleCandleInteraction(i)}
                              onMouseLeave={handleInteractionEnd}
                              onClick={() => handleCandleInteraction(i)} // For touch devices
                              style={{ cursor: 'pointer' }}
                            />
                          </g>
                        );
                      })}
                      
                      {/* Current price marker */}
                      <line 
                        x1="50" 
                        y1={400 * (paddedMax - stockData.price) / paddedRange} 
                        x2="1000" 
                        y2={400 * (paddedMax - stockData.price) / paddedRange} 
                        stroke="#3b82f6" 
                        strokeWidth="1" 
                        strokeDasharray="4,4"
                        pointerEvents="none"
                      />
                    </svg>
                  </div>
                </div>
                
                {/* Touch instruction for mobile */}
                {touchMode && (
                  <div className="py-3 text-center text-sm text-gray-500 border-t border-gray-100">
                    Tap on a candle to see price details
                  </div>
                )}
              </div>
              
              {/* Order panel */}
              <div className="lg:w-80 bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-blue-600 px-6 py-4 text-white">
                  <h3 className="text-lg font-semibold">Place Order</h3>
                  <p className="text-sm text-blue-100">Real-time trading for {stockData.symbol}</p>
                </div>
                
                <div className="p-6">
                  {/* Buy/Sell tabs - UPDATED with active state */}
                  <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
                    <button
                      onClick={() => setActiveOrderType('Buy')}
                      className={`flex-1 py-2 text-center rounded-md font-medium text-sm ${
                        orderType === 'Buy' 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => setActiveOrderType('Sell')}
                      className={`flex-1 py-2 text-center rounded-md font-medium text-sm ${
                        orderType === 'Sell' 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Sell
                    </button>
                  </div>
                  
                  {/* Current price indicator */}
                  <div className="flex justify-between items-center mb-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-sm text-blue-800">Current Price</div>
                    <div className="text-lg font-bold text-blue-800">${stockData.price.toFixed(5)}</div>
                  </div>
                  
                  {/* Product type */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product type
                    </label>
                    <div className="relative">
                      <select
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                        className="block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg appearance-none shadow-sm"
                      >
                        <option>Intraday</option>
                        <option>Delivery</option>
                        <option>Options</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Quantity */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="text"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                      placeholder="0"
                    />
                  </div>
                  
                  {/* Total price */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="text"
                        value={totalPrice}
                        disabled
                        className="block w-full pl-8 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-base font-medium"
                      />
                    </div>
                  </div>
                  
                  {/* Order button - UPDATED with dynamic text and loading state */}
                  <button
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 text-white text-base font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md ${
                      orderType === 'Buy' 
                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                        : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    } ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Processing...' : `${orderType} now`}
                  </button>
                  
                  {/* Order status message */}
                  {orderStatus && (
                    <div className={`mt-4 p-3 rounded-lg ${
                      orderStatus.success ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {orderStatus.message}
                    </div>
                  )}
                  
                  {/* Disclaimer */}
                  <p className="mt-4 text-xs text-gray-500 text-center">
                    All trades are executed at market prices and may be subject to slippage
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StockDetailView;