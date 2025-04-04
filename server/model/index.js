const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    email: {
        type: String, 
        required: true, 
        unique: true
    },
    usertype: {
        type: String, 
        enum:['Admin','Customer'],
        required: true 
    },
    panCardNumber: {
        type: String, 
        unique: true
    },
    password: { 
        type: String, 
        required: true 
    },
    balance: {
        type: Number, 
        default: 0
    }
},{timestamps:true});

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId, 
        ref:'User',
        required: true
    },
    type: {
        type: String, 
        enum:['Buy','Sell','Deposit','Withdrawal'],
        required: true
    },
    paymentMode: {
        type: String, 
        required: true
    },
    amount: {
        type: Number, 
        required: true
    }
},{timestamps:true})

const stocksSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId, 
        ref:'User',
        required: true
    },
    symbol: {
        type: String
    },
    name: {
        type: String
    },
    price: {
        type: Number
    },
    units: {
        type: Number
    },
    totalPrice: {
        type: Number
    },
    stockExchange: {
        type: String
    }
})

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId, 
        ref:'User',
        required: true
    },
    type: {
        type: String, 
        enum:['Buy','Sell'],
        required: true
    },
    units: {
        type: String, 
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    symbol: {
        type: String
    },
    name: {
        type: String
    }
},{timestamps:true})

const User = mongoose.model('users', userSchema);
const Transaction = mongoose.model('transactions', transactionSchema);
const Stock = mongoose.model('stocks', stocksSchema);
const Order = mongoose.model('oorders', orderSchema);

module.exports = { 
    User, 
    Transaction, 
    Stock ,
    Order
};