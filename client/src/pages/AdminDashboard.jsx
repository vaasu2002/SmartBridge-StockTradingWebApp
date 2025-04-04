import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, ShoppingCart, DollarSign, Home, 
  TrendingUp, ArrowUpRight, ArrowDownRight, Activity,
  CreditCard, AlertTriangle, Calendar,
  RefreshCw, Wallet,
  TrendingDown, User
} from 'lucide-react';
import { Link,useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    newUsers: 0,
    totalStocks: 0,
    totalPortfolioValue: '0',
    transactions: {
      total: 0,
      recent: 0,
      details: {}
    }
  });
  
  const [refreshing, setRefreshing] = useState(false);
  
  // Recent transactions (mock data)
  const [recentTransactions, setRecentTransactions] = useState([]);
  
  // Recent alerts (mock data)
  const [alerts, setAlerts] = useState([]);
  
  useEffect(() => {
    const userType = localStorage.getItem('usertype');
    if(!userType || userType==='Customer'){
      navigate('/');
    }
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Actual API call
        const statsResponse = await fetch('http://localhost:3001/api/admin/stats');
        const statsData = await statsResponse.json();
        
        if (statsData.success) {
          setStats({
            totalUsers: statsData.data.totalUsers,
            activeUsers: statsData.data.activeUsers,
            inactiveUsers: statsData.data.inactiveUsers,
            newUsers: statsData.data.newUsers,
            totalStocks: 12, // Mock data
            totalPortfolioValue: statsData.data.totalPortfolioValue,
            transactions: statsData.data.transactions
          });
          
          // Generate mock transaction data based on API statistics
          const transactionTypes = Object.keys(statsData.data.transactions.details);
          const mockTransactions = [];
          
          for (let i = 0; i < 5; i++) {
            const randomType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
            const isStockTransaction = randomType === 'Buy' || randomType === 'Sell';
            const stockSymbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NVDA'];
            const randomSymbol = stockSymbols[Math.floor(Math.random() * stockSymbols.length)];
            const randomAmount = Math.floor(Math.random() * 10000) + 1000;
            const randomShares = Math.floor(Math.random() * 30) + 5;
            const randomUser = ['John Smith', 'Emily Johnson', 'Michael Chen', 'Sarah Williams', 'Robert Patel'][i];
            
            mockTransactions.push({
              id: i + 1,
              user: randomUser,
              type: randomType.toLowerCase(),
              symbol: isStockTransaction ? randomSymbol : '-',
              amount: randomAmount,
              shares: isStockTransaction ? randomShares : null,
              date: new Date(Date.now() - (i * 3600000)).toISOString() 
            });
          }
          
          setRecentTransactions(mockTransactions);
          
          setAlerts([
            { 
              id: 1, 
              type: 'warning', 
              message: 'Unusual trading volume detected for NVDA', 
              date: '2023-10-15T15:42:18' 
            },
            { 
              id: 2, 
              type: 'info', 
              message: 'System maintenance scheduled for Oct 20, 02:00 AM UTC', 
              date: '2023-10-15T12:30:45' 
            },
            { 
              id: 3, 
              type: 'error', 
              message: 'Failed login attempts from IP 192.168.1.105', 
              date: '2023-10-15T11:15:22' 
            },
            { 
              id: 4, 
              type: 'success', 
              message: 'Daily backup completed successfully', 
              date: '2023-10-15T07:00:03' 
            }
          ]);
        } else {
          console.error('Failed to fetch stats:', statsData.message);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Refresh dashboard data
  const refreshDashboard = async () => {
    setRefreshing(true);
    try {
      const statsResponse = await fetch('http://localhost:3001/api/admin/stats');
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats({
          totalUsers: statsData.data.totalUsers,
          activeUsers: statsData.data.activeUsers,
          inactiveUsers: statsData.data.inactiveUsers,
          newUsers: statsData.data.newUsers,
          totalStocks: 12,
          totalPortfolioValue: statsData.data.totalPortfolioValue,
          transactions: statsData.data.transactions
        });
      }
    } catch (err) {
      console.error('Failed to refresh dashboard data', err);
    } finally {
      setTimeout(() => {
        setRefreshing(false);
      }, 500);
    }
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
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Format large numbers
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };
  
  // Helper for alert icon and color
  const getAlertStyles = (type) => {
    switch (type) {
      case 'error':
        return { icon: <AlertTriangle className="h-5 w-5" />, color: 'text-red-600 bg-red-100' };
      case 'warning':
        return { icon: <AlertTriangle className="h-5 w-5" />, color: 'text-yellow-600 bg-yellow-100' };
      case 'success':
        return { icon: <TrendingUp className="h-5 w-5" />, color: 'text-green-600 bg-green-100' };
      case 'info':
      default:
        return { icon: <Calendar className="h-5 w-5" />, color: 'text-blue-600 bg-blue-100' };
    }
  };
  
  // Get transaction icon
  const getTransactionIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'buy':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'sell':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      case 'deposit':
        return <Wallet className="h-4 w-4 text-blue-600" />;
      case 'withdrawal':
        return <CreditCard className="h-4 w-4 text-orange-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gray-800 border-r border-gray-200">
          <div className="flex items-center h-16 px-4 bg-gray-900">
            <BarChart3 className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-lg font-semibold text-white">TradeSmart Admin</span>
          </div>
          <div className="flex flex-col flex-grow px-4 mt-5">
            <nav className="flex-1 space-y-2">
              <Link to="/admin/dashboard" className="flex items-center px-4 py-3 text-sm font-medium rounded-md bg-gray-700 text-white">
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link to="/admin/stocks" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700">
                <BarChart3 className="mr-3 h-5 w-5" />
                Stocks
              </Link>
              <Link to="/admin/user" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700">
                <Users className="mr-3 h-5 w-5" />
                Users
              </Link>
              <Link to="/admin/orders" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700">
                <ShoppingCart className="mr-3 h-5 w-5" />
                Orders
              </Link>
              <Link to="/admin/transactions" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700">
                <DollarSign className="mr-3 h-5 w-5" />
                Transactions
              </Link>
            </nav>
            <div className="mt-auto pb-4">
              <div className="pt-6">
                <a href="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700">
                  <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={refreshDashboard}
                disabled={refreshing}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <div>
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Activity className="h-5 w-5 mr-2" />
                  Market Overview
                </button>
              </div>
              
              <div className="relative">
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Admin profile"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading dashboard data...
              </div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md p-3 bg-blue-100">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{formatNumber(stats.totalUsers)}</div>
                          {stats.newUsers > 0 && (
                            <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                              <ArrowUpRight className="h-4 w-4 self-center" />
                              <span className="sr-only">New users</span>
                              +{stats.newUsers}
                            </div>
                          )}
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Active: {formatNumber(stats.activeUsers)}</span>
                      <span>Inactive: {formatNumber(stats.inactiveUsers)}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      {stats.totalUsers > 0 && (
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${(stats.activeUsers / stats.totalUsers) * 100}%` }}
                        ></div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md p-3 bg-indigo-100">
                      <BarChart3 className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Stocks</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{formatNumber(stats.totalStocks)}</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            <ArrowUpRight className="h-4 w-4 self-center" />
                            <span className="sr-only">Increased by</span>
                            7.2%
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex items-center text-xs text-gray-600">
                      <div className="mr-2 w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Trading volume up 12% this week</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md p-3 bg-green-100">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Portfolio Value</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalPortfolioValue)}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        Avg. per user: {formatCurrency(stats.totalUsers > 0 ? stats.totalPortfolioValue / stats.totalUsers : 0)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md p-3 bg-purple-100">
                      <CreditCard className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Transactions</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{formatNumber(stats.transactions.total)}</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-blue-600">
                            <span className="sr-only">Recent</span>
                            {stats.transactions.recent} recent
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                      {stats.transactions.details && Object.entries(stats.transactions.details).map(([type, data]) => (
                        <div key={type} className="flex items-center">
                          <div className={`mr-1 w-2 h-2 rounded-full ${
                            type === 'Buy' ? 'bg-green-500' : 
                            type === 'Sell' ? 'bg-red-500' : 
                            'bg-blue-500'
                          }`}></div>
                          <span>{type}: {data.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Transaction details cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {stats.transactions.details && (
                  <>
                    <div className="bg-white rounded-lg shadow p-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Transaction Volume</h2>
                      <div className="space-y-4">
                        {Object.entries(stats.transactions.details).map(([type, data]) => (
                          <div key={type} className="flex items-center">
                            <div className={`flex-shrink-0 rounded-md p-2 ${
                              type === 'Buy' ? 'bg-green-100 text-green-600' : 
                              type === 'Sell' ? 'bg-red-100 text-red-600' : 
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {type === 'Buy' ? <TrendingUp className="h-5 w-5" /> : 
                               type === 'Sell' ? <TrendingDown className="h-5 w-5" /> : 
                               <Wallet className="h-5 w-5" />}
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-900">{type} Transactions</span>
                                <span className="text-sm font-medium text-gray-900">{data.count}</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                                <div 
                                  className={`h-full rounded-full ${
                                    type === 'Buy' ? 'bg-green-500' : 
                                    type === 'Sell' ? 'bg-red-500' : 
                                    'bg-blue-500'
                                  }`}
                                  style={{ width: `${(data.count / stats.transactions.total) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Transaction Value</h2>
                      <div className="space-y-4">
                        {Object.entries(stats.transactions.details).map(([type, data]) => {
                          // Calculate total value from all transaction types
                          const totalValue = Object.values(stats.transactions.details).reduce((sum, item) => 
                            sum + parseFloat(item.totalAmount), 0
                          );
                          
                          return (
                            <div key={type} className="flex items-center">
                              <div className={`flex-shrink-0 rounded-md p-2 ${
                                type === 'Buy' ? 'bg-green-100 text-green-600' : 
                                type === 'Sell' ? 'bg-red-100 text-red-600' : 
                                'bg-blue-100 text-blue-600'
                              }`}>
                                <DollarSign className="h-5 w-5" />
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="flex justify-between">
                                  <span className="text-sm font-medium text-gray-900">{type} Value</span>
                                  <span className="text-sm font-medium text-gray-900">{formatCurrency(data.totalAmount)}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                                  <div 
                                    className={`h-full rounded-full ${
                                      type === 'Buy' ? 'bg-green-500' : 
                                      type === 'Sell' ? 'bg-red-500' : 
                                      'bg-blue-500'
                                    }`}
                                    style={{ width: `${(parseFloat(data.totalAmount) / totalValue) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Market Overview Chart */}
                
                
                {/* Alerts & Notifications */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Alerts & Notifications</h2>
                    <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
                  </div>
                  <div className="space-y-4">
                    {alerts.map((alert) => {
                      const alertStyle = getAlertStyles(alert.type);
                      return (
                        <div key={alert.id} className="flex items-start">
                          <div className={`flex-shrink-0 rounded-md p-2 ${alertStyle.color}`}>
                            {alertStyle.icon}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                            <p className="text-xs text-gray-500">{formatDate(alert.date)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* User Activity & Trends */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">User Activity</h2>
                  <div className="flex space-x-8">
                    <div className="flex-1">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 rounded-md p-2 bg-green-100 text-green-600">
                            <User className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Active Users</p>
                            <p className="text-lg font-semibold text-gray-900">{stats.activeUsers}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 rounded-md p-2 bg-gray-100 text-gray-600">
                            <User className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Inactive Users</p>
                            <p className="text-lg font-semibold text-gray-900">{stats.inactiveUsers}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 rounded-md p-2 bg-blue-100 text-blue-600">
                            <User className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">New Users (Last 7 days)</p>
                            <p className="text-lg font-semibold text-gray-900">{stats.newUsers}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center">
                      <div className="relative h-32 w-32">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-sm font-medium text-gray-500">Users</p>
                        </div>
                        {/* Simple circle chart for user activity */}
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          {/* Background circle */}
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                          
                          {/* Active users segment */}
                          {stats.totalUsers > 0 && (
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#22c55e"
                              strokeWidth="10"
                              strokeDasharray={`${(stats.activeUsers / stats.totalUsers) * 251.2} 251.2`}
                              transform="rotate(-90 50 50)"
                            />
                          )}
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Transaction Breakdown</h2>
                  <div className="space-y-4">
                    {stats.transactions.details && Object.entries(stats.transactions.details).map(([type, data]) => {
                      const totalValue = Object.values(stats.transactions.details).reduce((sum, item) => sum + item.count, 0);
                      const percentage = totalValue > 0 ? Math.round((data.count / totalValue) * 100) : 0;
                      
                      return (
                        <div key={type} className="flex items-center">
                          <div className={`flex-shrink-0 rounded-md p-2 ${
                            type === 'Buy' ? 'bg-green-100 text-green-600' : 
                            type === 'Sell' ? 'bg-red-100 text-red-600' : 
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {type === 'Buy' ? <TrendingUp className="h-5 w-5" /> : 
                             type === 'Sell' ? <TrendingDown className="h-5 w-5" /> : 
                             <Wallet className="h-5 w-5" />}
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{type}</p>
                                <p className="text-xs text-gray-500">{data.count} transactions</p>
                              </div>
                              <p className="text-sm font-medium text-gray-900">{percentage}%</p>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                              <div 
                                className={`h-full rounded-full ${
                                  type === 'Buy' ? 'bg-green-500' : 
                                  type === 'Sell' ? 'bg-red-500' : 
                                  'bg-blue-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;