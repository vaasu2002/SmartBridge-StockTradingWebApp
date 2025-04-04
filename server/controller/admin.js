const { User, Stock, Transaction } = require('../model');

const getAdminStats = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments({ usertype: 'Customer' });
    
    // Get active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsers = await User.countDocuments({
      usertype: 'Customer',
      updatedAt: { $gt: thirtyDaysAgo }
    });
    
    // Get new users in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const newUsers = await User.countDocuments({
      usertype: 'Customer',
      createdAt: { $gt: sevenDaysAgo }
    });
    
    // Get total portfolio value across all users
    const allStocks = await Stock.find();
    const totalPortfolioValue = allStocks.reduce((total, stock) => {
      return total + (stock.price * stock.units);
    }, 0);
    
    // Get total transactions count
    const totalTransactions = await Transaction.countDocuments();
    
    // Get transaction statistics by type
    const transactionStats = await Transaction.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);
    
    // Convert transaction stats array to a more accessible object
    const transactionDetails = transactionStats.reduce((acc, item) => {
      acc[item._id] = {
        count: item.count,
        totalAmount: item.totalAmount.toFixed(2)
      };
      return acc;
    }, {});
    
    // Get recent transactions (last 30 days)
    const recentTransactions = await Transaction.countDocuments({
      createdAt: { $gt: thirtyDaysAgo }
    });
    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        newUsers,
        totalPortfolioValue: totalPortfolioValue.toFixed(2),
        transactions: {
          total: totalTransactions,
          recent: recentTransactions,
          details: transactionDetails
        }
      },
      message: "Admin stats retrieved successfully"
    });
    
  } catch (error) {
    console.error('Error in getAdminStats:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve admin stats",
      error: error.message
    });
  }
};

const getTransaction= async ( req,res ) => {
  try{
      const transactions = await Transaction.find({});
      return res.status(200).json({
          success:true,
          message:'Recieved all transactions',
          data: transactions,
          err:{}
      });
  }catch(error){
      console.log(error)
      return res.status(500).json({
          success:false,
          message:'Error encountered in fetching transactions',
          data: {},
          err:error
      });
  }
}

module.exports = { getAdminStats,getTransaction };