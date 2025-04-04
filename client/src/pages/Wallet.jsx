import React, { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { 
  DollarSign, CreditCard, Calendar, ArrowDownCircle, 
  ArrowUpCircle, Clock, ChevronDown, Search, Filter, 
  Download, RefreshCw, ShoppingCart, TrendingDown,ChevronLeft
} from 'lucide-react';

const Wallet = () => {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [mode, setMode] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('deposit');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const navigate = useNavigate();
  
  useEffect(() => {
    const id = localStorage.getItem('id');
    if(!id){
      navigate('/');
    }
    
    // Fetch transaction history
    const fetchTransactions = async () => {
      try {
        setTransactionsLoading(true);
        const response = await fetch(`http://localhost:3001/api/user/transactions/${id}`);
        if(response.ok){
          const data = await response.json();
          // Map API response to match frontend structure
          const mappedTransactions = data.data.map(transaction => ({
            id: transaction._id,
            type: transaction.type.toLowerCase(),
            amount: transaction.amount,
            mode: transaction.paymentMode,
            status: 'completed', // Assuming all returned transactions are completed
            date: transaction.createdAt
          }));
          setTransactions(mappedTransactions);
          // Reset to first page when transactions change
          setCurrentPage(1);
        }
      } catch (err) {
        console.error('Error fetching transaction history:', err);
      }
      finally{
        setTransactionsLoading(false);
      }
      try {
        const response = await fetch(`http://localhost:3001/api/user/${id}`);
        if(response.ok){
          const data = await response.json();
          console.log(data.data.balance)
          setBalance(data.data.balance)
        }
      } catch (err) {
        console.error('Error fetching transaction history:', err);
      }
    };
    
    fetchTransactions();
  }, [navigate]);
  
  // Handle amount change
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d*(\.\d{0,2})?$/).test(value)) {
      setAmount(value);
    }
  };
  
  // Get user email from localStorage
  const getUserEmail = () => {
    return localStorage.getItem('email');
  };
  
  // Handle deposit
  const handleDeposit = async () => {
    setLoading(true);
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      setLoading(false);
      return;
    }
    try{
      const email = getUserEmail();
      const response = await fetch('http://localhost:3001/api/user/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: parseInt(amount),
          mode
        })
      });
      const data = await response.json();
      if(!response.ok) {
        throw new Error(data.message || 'Failed to process deposit');
      }
      else{
        setBalance(data.data.balance)
      }
      
      // Add new transaction to list without requiring a refresh
      // This assumes the API returns the created transaction
      if(data.success) {
        const newTransaction = {
          id: data.data?._id || String(Date.now()),
          type: 'deposit',
          amount: parseInt(amount),
          mode: mode,
          status: 'completed',
          date: new Date().toISOString()
        };
        setTransactions(prev => [newTransaction, ...prev]);
        setCurrentPage(1); // Return to first page to show the new transaction
        alert('Deposit successful!');
      }
    } catch (err) {
      console.error('Error processing deposit:', err);
      alert('Failed to process deposit. Please try again.');
    } finally {
      setLoading(false);
      setAmount('');
    }
  }
  
  // Handle withdrawal
  const handleWithdrawal = async () => {
    // Validate amount
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    try {
      setLoading(true);
      
      const email = getUserEmail();
      
      // In a real app, make the API call to a withdrawal endpoint
      const response = await fetch('http://localhost:3001/api/user/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: parseInt(amount),
          mode
        })
      });
      
      const data = await response.json();
      
      if(!response.ok) {
        throw new Error(data.message || 'Failed to process withdrawal');
      }
      
      // Add the new transaction to the list
      if(data.success) {
        const newTransaction = {
          id: data.data?._id || String(Date.now()),
          type: 'withdrawal',
          amount: parseInt(amount),
          mode: mode,
          status: 'completed',
          date: new Date().toISOString()
        };
        
        setTransactions(prev => [newTransaction, ...prev]);
        setCurrentPage(1); // Return to first page to show the new transaction
        alert('Withdrawal successful!');
      }
      
    } catch (err) {
      console.error('Error processing withdrawal:', err);
      alert('Failed to process withdrawal. Please try again.');
    } finally {
      setLoading(false);
      setAmount('');
    }
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
  
  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when changing sort
  };
  
  // Get sort indicator
  const getSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };
  
  // Map API fields to UI fields for sorting
  const getApiFieldName = (uiField) => {
    const fieldMap = {
      'date': 'createdAt',
      'type': 'type',
      'amount': 'amount',
      'mode': 'paymentMode',
      'status': 'status'
    };
    return fieldMap[uiField] || uiField;
  };
  
  // Get transaction icon and color based on type
  const getTransactionDisplay = (type) => {
    switch(type.toLowerCase()) {
      case 'deposit':
        return {
          icon: <ArrowDownCircle className="h-5 w-5 text-green-600" />,
          bgColor: 'bg-green-100',
          textColor: 'text-green-600',
          sign: '+'
        };
      case 'withdrawal':
        return {
          icon: <ArrowUpCircle className="h-5 w-5 text-red-600" />,
          bgColor: 'bg-red-100',
          textColor: 'text-red-600',
          sign: '-'
        };
      case 'buy':
        return {
          icon: <ShoppingCart className="h-5 w-5 text-purple-600" />,
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-600',
          sign: '-'
        };
      case 'sell':
        return {
          icon: <TrendingDown className="h-5 w-5 text-blue-600" />,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-600',
          sign: '+'
        };
      default:
        return {
          icon: <DollarSign className="h-5 w-5 text-gray-600" />,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          sign: ''
        };
    }
  };
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  
  // Filter and sort transactions
  const filteredAndSortedTransactions = [...transactions]
    .filter(transaction => {
      // Filter by type
      if (filterType !== 'all' && transaction.type !== filterType) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          transaction.mode.toLowerCase().includes(query) ||
          transaction.status.toLowerCase().includes(query) ||
          transaction.amount.toString().includes(query) ||
          transaction.type.toLowerCase().includes(query);
          
        if (!matchesSearch) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'date' || sortField === 'createdAt') {
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
  // Get current transactions for pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredAndSortedTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / transactionsPerPage);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Balance card */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
              <Link to="/market" className="mr-2 flex items-center">
                <ChevronLeft className="h-5 w-5 text-gray-500 mr-1" />
                Wallet
              </Link>
                <h2 className="text-lg font-medium text-gray-700">Available Balance</h2>
                <div className="mt-2 text-3xl font-bold">{formatCurrency(balance)}</div>
              </div>
              
              <div className="mt-4 md:mt-0 text-sm text-gray-500 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          {/* Deposit/Withdrawal Form */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-blue-600 px-6 py-4 text-white">
              <h3 className="text-lg font-semibold">Funds Management</h3>
              <p className="text-sm text-blue-100">Add or withdraw funds from your account</p>
            </div>
            
            <div className="p-6">
              {/* Tabs */}
              <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
                <button
                  onClick={() => setActiveTab('deposit')}
                  className={`flex-1 py-2 text-center rounded-md font-medium text-sm ${
                    activeTab === 'deposit' 
                      ? 'bg-green-600 text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Deposit
                </button>
                <button
                  onClick={() => setActiveTab('withdraw')}
                  className={`flex-1 py-2 text-center rounded-md font-medium text-sm ${
                    activeTab === 'withdraw' 
                      ? 'bg-red-600 text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Withdraw
                </button>
              </div>
              
              {/* Amount */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              {/* Payment Mode */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Mode
                </label>
                <div className="relative">
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg appearance-none shadow-sm"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              <button
                onClick={activeTab === 'deposit' ? handleDeposit : handleWithdrawal}
                disabled={loading}
                className={`w-full py-3 px-4 text-white text-base font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md ${
                  activeTab === 'deposit'
                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                    Processing...
                  </span>
                ) : (
                  activeTab === 'deposit' ? 'Add Money' : 'Withdraw Funds'
                )}
              </button>
              
              {/* Info text */}
              <p className="mt-4 text-xs text-gray-500 text-center">
                {activeTab === 'deposit'
                  ? 'Funds will be credited to your account immediately for most payment methods'
                  : 'Withdrawals typically take 1-3 business days to process'
                }
              </p>
            </div>
          </div>
          
          {/* Transaction History */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gray-800 px-6 py-4 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Transaction History</h3>
                <p className="text-sm text-gray-300">View all your deposits, withdrawals, buys and sells</p>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600">
                  <Download className="h-4 w-4" />
                </button>
                <button className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600">
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Filters */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      filterType === 'all'
                        ? 'bg-gray-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterType('deposit')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      filterType === 'deposit'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Deposits
                  </button>
                  <button
                    onClick={() => setFilterType('withdrawal')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      filterType === 'withdrawal'
                        ? 'bg-red-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Withdrawals
                  </button>
                  <button
                    onClick={() => setFilterType('buy')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      filterType === 'buy'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Buys
                  </button>
                  <button
                    onClick={() => setFilterType('sell')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      filterType === 'sell'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Sells
                  </button>
                </div>
                
                <div className="relative flex-1 max-w-xs">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Search className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search transactions"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1); // Reset to first page when searching
                    }}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Transactions Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
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
                      onClick={() => handleSort('amount')}
                    >
                      Amount{getSortIndicator('amount')}
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('mode')}
                    >
                      Payment Mode{getSortIndicator('mode')}
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      Status{getSortIndicator('status')}
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('date')}
                    >
                      Date{getSortIndicator('date')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactionsLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center text-gray-500">
                          <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                          Loading transaction history...
                        </div>
                      </td>
                    </tr>
                  ) : filteredAndSortedTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    currentTransactions.map((transaction) => {
                      const display = getTransactionDisplay(transaction.type);
                      return (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`p-2 rounded-full mr-3 ${display.bgColor}`}>
                                {display.icon}
                              </span>
                              <span className="font-medium text-gray-900 capitalize">
                                {transaction.type}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${display.textColor}`}>
                              {display.sign}{formatCurrency(transaction.amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <CreditCard className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-900">{transaction.mode}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                              {formatDate(transaction.date)}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstTransaction + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastTransaction, filteredAndSortedTransactions.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredAndSortedTransactions.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    {/* Previous Page Button */}
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Page Numbers */}
                    {[...Array(totalPages).keys()].map((number) => (
                      <button
                        key={number + 1}
                        onClick={() => paginate(number + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === number + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {number + 1}
                      </button>
                    ))}
                    
                    {/* Next Page Button */}
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Wallet;