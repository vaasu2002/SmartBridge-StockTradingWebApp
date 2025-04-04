import React, { useState, useEffect } from 'react';
import {
  RefreshCw, 
  Download, 
  Search, 
  Filter, 
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering and sorting states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPaymentMode, setFilterPaymentMode] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  useEffect(() => {
    fetchTransactions();
  }, []);
  
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/admin/stats/transaction');
      const result = await response.json();
      
      if (result.success) {
        setTransactions(result.data);
      } else {
        setError(result.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
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
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get icon for transaction type
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'Buy':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'Sell':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'Deposit':
        return <Wallet className="h-4 w-4 text-blue-600" />;
      case 'Withdrawal':
        return <CreditCard className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };
  
  // Filter and sort transactions
  const filteredAndSortedTransactions = [...transactions]
    .filter(transaction => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesUserId = transaction.user.toLowerCase().includes(query);
        const matchesType = transaction.type.toLowerCase().includes(query);
        const matchesPaymentMode = transaction.paymentMode.toLowerCase().includes(query);
        
        if (!matchesUserId && !matchesType && !matchesPaymentMode) {
          return false;
        }
      }
      
      // Transaction type filter
      if (filterType !== 'all' && transaction.type !== filterType) {
        return false;
      }
      
      // Payment mode filter
      if (filterPaymentMode !== 'all' && transaction.paymentMode !== filterPaymentMode) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sorting logic
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle date fields
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      // Handle numeric fields
      if (sortField === 'amount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  
  // Get unique payment modes for filter
  const uniquePaymentModes = [...new Set(transactions.map(t => t.paymentMode))];
  
  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  // Calculate summary statistics
  const calculateSummary = () => {
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const typeStats = transactions.reduce((acc, t) => {
      if (!acc[t.type]) {
        acc[t.type] = { count: 0, amount: 0 };
      }
      acc[t.type].count += 1;
      acc[t.type].amount += t.amount;
      return acc;
    }, {});
    
    return { totalAmount, typeStats };
  };
  
  const summary = calculateSummary();
  
  // Handle CSV export
  const exportToCSV = () => {
    // Column headers
    const headers = ['ID', 'User', 'Type', 'Payment Mode', 'Amount', 'Date', 'Time'];
    
    // Prepare data rows
    const data = filteredAndSortedTransactions.map(t => {
      const date = new Date(t.createdAt);
      return [
        t._id,
        t.user,
        t.type,
        t.paymentMode,
        t.amount.toFixed(2),
        date.toLocaleDateString(),
        date.toLocaleTimeString()
      ];
    });
    
    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    // Create downloadable link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="mr-4">
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={fetchTransactions} 
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            
            <button 
              onClick={exportToCSV}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>
        
        {/* Filters and search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="Buy">Buy</option>
                  <option value="Sell">Sell</option>
                  <option value="Deposit">Deposit</option>
                  <option value="Withdrawal">Withdrawal</option>
                </select>
              </div>
              
              <div className="relative">
                <select
                  value={filterPaymentMode}
                  onChange={(e) => setFilterPaymentMode(e.target.value)}
                  className="pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Payment Methods</option>
                  {uniquePaymentModes.map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Search className="h-4 w-4 text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
              
              <button
                onClick={() => {
                  setFilterType('all');
                  setFilterPaymentMode('all');
                  setSearchQuery('');
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Total Transactions</div>
            <div className="mt-1 text-2xl font-semibold">{transactions.length}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Total Amount</div>
            <div className="mt-1 text-2xl font-semibold">{formatCurrency(summary.totalAmount)}</div>
          </div>
          
          {summary.typeStats.Buy && (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center text-sm font-medium text-gray-500">
                <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                Buy Transactions
              </div>
              <div className="mt-1 text-2xl font-semibold">{formatCurrency(summary.typeStats.Buy.amount)}</div>
              <div className="text-xs text-gray-500">{summary.typeStats.Buy.count} transactions</div>
            </div>
          )}
          
          {summary.typeStats.Sell && (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center text-sm font-medium text-gray-500">
                <TrendingDown className="h-4 w-4 mr-1 text-red-600" />
                Sell Transactions
              </div>
              <div className="mt-1 text-2xl font-semibold">{formatCurrency(summary.typeStats.Sell.amount)}</div>
              <div className="text-xs text-gray-500">{summary.typeStats.Sell.count} transactions</div>
            </div>
          )}
        </div>
        
        {/* Transactions table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <RefreshCw className="h-10 w-10 text-blue-500 animate-spin" />
              <p className="mt-4 text-gray-500">Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('type')}
                      >
                        <div className="flex items-center">
                          Type
                          {sortField === 'type' && (
                            <ArrowUpDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('user')}
                      >
                        <div className="flex items-center">
                          User ID
                          {sortField === 'user' && (
                            <ArrowUpDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('paymentMode')}
                      >
                        <div className="flex items-center">
                          Payment Method
                          {sortField === 'paymentMode' && (
                            <ArrowUpDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('amount')}
                      >
                        <div className="flex items-center justify-end">
                          Amount
                          {sortField === 'amount' && (
                            <ArrowUpDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center">
                          Date
                          {sortField === 'createdAt' && (
                            <ArrowUpDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedTransactions.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          No transactions found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      paginatedTransactions.map((transaction) => (
                        <tr key={transaction._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${
                              transaction.type === 'Buy' ? 'bg-green-100 text-green-800' : 
                              transaction.type === 'Sell' ? 'bg-red-100 text-red-800' :
                              transaction.type === 'Deposit' ? 'bg-blue-100 text-blue-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {getTransactionIcon(transaction.type)}
                              <span className="ml-1">{transaction.type}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.user}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.paymentMode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                            <span className={
                              transaction.type === 'Buy' || transaction.type === 'Withdrawal' 
                                ? 'text-red-600' 
                                : 'text-green-600'
                            }>
                              {formatCurrency(transaction.amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-gray-500">
                            {transaction._id}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * itemsPerPage, filteredAndSortedTransactions.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredAndSortedTransactions.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === i + 1
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTransaction;