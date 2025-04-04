import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, ShoppingCart, DollarSign, Home, 
  Search, Edit, Trash2, RefreshCw, AlertTriangle, 
  UserPlus, Shield, UserX
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('username');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  // Mock data for demonstration - replace with API calls in production
  useEffect(() => {
    // Simulating API fetch
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // const response = await fetch('/api/admin/users');
        // const data = await response.json();
        
        // For demo purposes, using mock data
        const mockData = [
          { 
            _id: '1', 
            username: 'john_smith', 
            email: 'john.smith@example.com',
            usertype: 'user',
            registeredDate: '2023-08-15T10:30:45',
            lastLogin: '2023-10-14T15:22:30',
            status: 'active',
            portfolioValue: 124580.75
          },
          { 
            _id: '2', 
            username: 'emily_jones', 
            email: 'emily.jones@example.com',
            usertype: 'user',
            registeredDate: '2023-07-22T08:15:12',
            lastLogin: '2023-10-15T09:45:20',
            status: 'active',
            portfolioValue: 86342.50
          },
          { 
            _id: '3', 
            username: 'michael_chen', 
            email: 'michael.chen@example.com',
            usertype: 'user',
            registeredDate: '2023-09-05T14:20:33',
            lastLogin: '2023-10-13T18:10:05',
            status: 'active',
            portfolioValue: 215780.25
          },
          { 
            _id: '4', 
            username: 'sarah_williams', 
            email: 'sarah.williams@example.com',
            usertype: 'user',
            registeredDate: '2023-06-10T11:05:18',
            lastLogin: '2023-10-12T16:30:42',
            status: 'inactive',
            portfolioValue: 0
          },
          { 
            _id: '5', 
            username: 'admin_robert', 
            email: 'robert.admin@example.com',
            usertype: 'admin',
            registeredDate: '2023-05-18T09:30:00',
            lastLogin: '2023-10-15T11:15:10',
            status: 'active',
            portfolioValue: 0
          },
          { 
            _id: '6', 
            username: 'admin_jessica', 
            email: 'jessica.admin@example.com',
            usertype: 'admin',
            registeredDate: '2023-04-25T13:45:22',
            lastLogin: '2023-10-15T10:20:35',
            status: 'active',
            portfolioValue: 0
          },
          { 
            _id: '7', 
            username: 'david_miller', 
            email: 'david.miller@example.com',
            usertype: 'user',
            registeredDate: '2023-09-18T15:12:40',
            lastLogin: '2023-10-14T14:05:18',
            status: 'active',
            portfolioValue: 67890.30
          }
        ];
        
        setUsers(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users. Please try again.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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

  // Delete user (mock function)
  const handleDeleteUser = (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    // In a real app, this would be an API call
    // await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
    
    // For demo, remove from state
    setUsers(users.filter(user => user._id !== userId));
  };

  // Filter and sort users
  const filteredAndSortedUsers = [...users]
    .filter(user => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query);
          
        if (!matchesSearch) return false;
      }
      
      // Filter by role
      if (selectedRole !== 'all' && user.usertype !== selectedRole) {
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
              <Link to="/admin/dashboard" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700">
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link to="/admin/stocks" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700">
                <BarChart3 className="mr-3 h-5 w-5" />
                Stocks
              </Link>
              <Link to="/admin/users" className="flex items-center px-4 py-3 text-sm font-medium rounded-md bg-gray-700 text-white">
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
            <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Search className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="user">Users</option>
              </select>
              
              <div>
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add New User
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
          {/* User management interface */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}
            
            {/* Users table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('username')}>
                      <div className="flex items-center space-x-1">
                        <span>Username</span>
                        <span>{getSortIndicator('username')}</span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('email')}>
                      <div className="flex items-center space-x-1">
                        <span>Email</span>
                        <span>{getSortIndicator('email')}</span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('usertype')}>
                      <div className="flex items-center space-x-1">
                        <span>Role</span>
                        <span>{getSortIndicator('usertype')}</span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        <span>{getSortIndicator('status')}</span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('portfolioValue')}>
                      <div className="flex items-center space-x-1">
                        <span>Portfolio Value</span>
                        <span>{getSortIndicator('portfolioValue')}</span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('registeredDate')}>
                      <div className="flex items-center space-x-1">
                        <span>Registered</span>
                        <span>{getSortIndicator('registeredDate')}</span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('lastLogin')}>
                      <div className="flex items-center space-x-1">
                        <span>Last Login</span>
                        <span>{getSortIndicator('lastLogin')}</span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center text-gray-500">
                          <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                          Loading users...
                        </div>
                      </td>
                    </tr>
                  ) : filteredAndSortedUsers.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{user.username}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.usertype === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.usertype === 'admin' ? (
                              <span className="flex items-center">
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </span>
                            ) : 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.usertype === 'admin' ? (
                            <span className="text-gray-500">N/A</span>
                          ) : (
                            <div className="text-gray-900">{formatCurrency(user.portfolioValue)}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500">{formatDate(user.registeredDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-500">{formatDate(user.lastLogin)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;