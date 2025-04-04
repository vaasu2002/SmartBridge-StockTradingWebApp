// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, ShoppingCart, DollarSign, Home, 
  TrendingUp, ArrowUpRight, ArrowDownRight, Activity,
  CreditCard, AlertTriangle, PieChart, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Sample chart data (would come from API in a real app)
const marketOverviewData = [
  { month: 'Jan', value: 75 },
  { month: 'Feb', value: 85 },
  { month: 'Mar', value: 78 },
  { month: 'Apr', value: 92 },
  { month: 'May', value: 98 },
  { month: 'Jun', value: 106 },
  { month: 'Jul', value: 100 },
  { month: 'Aug', value: 92 },
  { month: 'Sep', value: 116 },
  { month: 'Oct', value: 124 },
  { month: 'Nov', value: 118 },
  { month: 'Dec', value: 138 }
];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStocks: 0,
    totalTransactions: 0,
    totalValue: 0
  });
  
  // Recent transactions (mock data)
  const [recentTransactions, setRecentTransactions] = useState([]);
  
  // Recent alerts (mock data)
  const [alerts, setAlerts] = useState([]);
  
  useEffect(() => {
    // Simulate API calls to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real app, these would be actual API calls
        // const statsResponse = await fetch('/api/admin/dashboard/stats');
        // const statsData = await statsResponse.json();
        
        // Mock data for demonstration
        setTimeout(() => {
          setStats({
            totalUsers: 12547,
            totalStocks: 258,
            totalTransactions: 47892,
            totalValue: 286459.45
          });
          
          setRecentTransactions([
            { 
              id: 1, 
              user: 'John Smith', 
              type: 'buy', 
              symbol: 'AAPL', 
              amount: 4850.75, 
              shares: 25, 
              date: '2023-10-15T14:32:17' 
            },
            { 
              id: 2, 
              user: 'Emily Johnson', 
              type: 'sell', 
              symbol: 'MSFT', 
              amount: 7218.50, 
              shares: 20, 
              date: '2023-10-15T13:08:42' 
            },
            { 
              id: 3, 
              user: 'Michael Chen', 
              type: 'buy', 
              symbol: 'GOOGL', 
              amount: 12840.35, 
              shares: 10, 
              date: '2023-10-15T11:45:09' 
            },
            { 
              id: 4, 
              user: 'Sarah Williams', 
              type: 'buy', 
              symbol: 'TSLA', 
              amount: 9652.60, 
              shares: 15, 
              date: '2023-10-15T10:22:53' 
            },
            { 
              id: 5, 
              user: 'Robert Patel', 
              type: 'sell', 
              symbol: 'AMZN', 
              amount: 3245.92, 
              shares: 5, 
              date: '2023-10-15T09:17:31' 
            }
          ]);
          
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
          
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Admin Sidebar Navigation */}
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
                          <div className="text-2xl font-semibold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            <ArrowUpRight className="h-4 w-4 self-center" />
                            <span className="sr-only">Increased by</span>
                            12.8%
                          </div>
                        </dd>
                      </dl>
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
                          <div className="text-2xl font-semibold text-gray-900">{stats.totalStocks.toLocaleString()}</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            <ArrowUpRight className="h-4 w-4 self-center" />
                            <span className="sr-only">Increased by</span>
                            7.2%
                          </div>
                        </dd>
                      </dl>
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
                          <div className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalValue)}</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            <ArrowUpRight className="h-4 w-4 self-center" />
                            <span className="sr-only">Increased by</span>
                            18.3%
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md p-3 bg-red-100">
                      <CreditCard className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Transactions</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{stats.totalTransactions.toLocaleString()}</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                            <ArrowDownRight className="h-4 w-4 self-center" />
                            <span className="sr-only">Decreased by</span>
                            3.5%
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Market Overview Chart */}
                <div className="bg-white rounded-lg shadow p-6 col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Market Overview</h2>
                    <div className="flex items-center space-x-2">
                      <select className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                        <option>This Year</option>
                        <option>Last Year</option>
                        <option>Last 6 Months</option>
                      </select>
                    </div>
                  </div>
                  <div className="h-64">
                    {/* This would be a chart component in a real app */}
                    <div className="h-full flex items-end justify-between space-x-2">
                      {marketOverviewData.map((item, index) => (
                        <div key={index} className="flex flex-col items-center" style={{ width: `${100 / marketOverviewData.length}%` }}>
                          <div 
                            className="w-full bg-blue-500 rounded-t-sm" 
                            style={{ height: `${(item.value / 140) * 100}%` }}
                          ></div>
                          <div className="text-xs text-gray-500 mt-1">{item.month}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
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
              
              {/* Recent Transactions */}
              <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
                    <Link to="/admin/transactions" className="text-sm text-blue-600 hover:text-blue-800">View All</Link>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{transaction.user}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{transaction.symbol}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{transaction.shares}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatCurrency(transaction.amount)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transaction.date)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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