const {User,Transaction,Order,Stock} = require('../model');
const bcrypt = require('bcryptjs');

const register = async ( req,res ) => {
    try {
        const { username, email, usertype, password,panCardNum } = req.body;
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({
                success:true,
                message:'User already exists',
                data: existingUser,
                err:{}
            });
        }
        const hashedPassword = await bcrypt.hashSync(password, 10);
        const newUser = new User({
            username:username,
            email:email,
            usertype:usertype,
            panCardNumber:panCardNum,
            password: hashedPassword
        });
        console.log(newUser)
        const userCreated = await newUser.save();
        return res.status(201).json({
            success:true,
            message:'Successfully toggled a Like',
            data: userCreated,
            err:{}
        });
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'Error Encountered in toggleing a Like',
            data: {},
            err:error
        });
    }
}

const login = async ( req,res ) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).json({
                success:false,
                message:'User does not exists',
                data: {},
                err:{}
            });
        }
        const isValid = await bcrypt.compareSync(password, user.password);
        if(!isValid){
            return res.status(401).json({
                success:false,
                message:'Incorrect password or email',
                data: user,
                err:{}
            });
        }
        return res.status(200).json({
            success:true,
            message:'User successfully logged in',
            data: user,
            err:{}
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'Error Encountered in logging in',
            data: {},
            err:error
        });
    }
}
const deposit = async ( req,res ) => {
    try{
        const {email, amount, mode} = req.body;
        const existingUser = await User.findOne({ email });
        if(!existingUser){
            return res.status(404).json({
                success:true,
                message:'User does not exists',
                data: existingUser,
                err:{}
            });
        }
        const transaction = new Transaction({
            user: existingUser._id,
            type: 'Deposit',
            paymentMode: mode,
            amount: amount,
            time: new Date() 
        })
        await transaction.save();
        existingUser.balance = parseInt(existingUser.balance) + parseInt(amount);
        await existingUser.save();
        return res.status(200).json({
            success:true,
            message:'Money successfully depositted',
            data: existingUser,
            err:{}
        });
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'Error Encountered in depositing money',
            data: {},
            err:error
        });
    }
}

const getAllUserTransaction = async ( req,res ) => {
    try{
        const user = req.params.id;
        const transactions = await Transaction.find({ user });
        return res.status(200).json({
            success:true,
            message:'All user transactions',
            data: transactions,
            err:{}
        });
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'Error Encountered in depositing money',
            data: {},
            err:error
        });
    }
}

const orderStock = async ( req,res ) => {
    try{
        const {user, type, units,price,symbol,name} = req.body;
        const existingUser = await User.findById(user);
        const order = new Order({
            user: user,
            type: type,
            units: units,
            price: price,
            symbol: symbol,
            name: name,
        });
        const stock = new Stock({
            user: user,
            symbol: symbol,
            totalPrice: price,
            units: units,
            price: parseInt(price/units),
            stockExchange: 'NASDAQ',
        });
        if(type==='Buy'){
            existingUser.balance = parseInt(existingUser.balance) - parseInt(price);
            const stock = new Stock({
                user: user,
                symbol: symbol,
                totalPrice: price,
                units: units,
                price: parseInt(price/units),
                stockExchange: 'NASDAQ',
            });
            await stock.save();
        }
        else{
            // existingUser.balance = parseInt(existingUser.balance) + parseInt(price);
            existingUser.balance = parseInt(existingUser.balance) + parseInt(price);

            const stock = await Stock.findOne({ user, symbol });

            if (!stock) {
                return res.status(400).json({
                    success: false,
                    message: "Stock not found or insufficient quantity",
                    data: {},
                    err: {}
                });
            }

            if (stock.units < units) {
                return res.status(400).json({
                    success: false,
                    message: "Not enough stock units to sell",
                    data: {},
                    err: {}
                });
            }

            stock.units -= units;
            stock.totalPrice = stock.units * stock.price; // Update total price accordingly

            if (stock.units === 0) {
                await Stock.deleteOne({ _id: stock._id });
            } else {
                await stock.save();
            }
        }
        const transaction = new Transaction({
            user: existingUser._id,
            type: type,
            amount: price,
            paymentMode:'stock',
            time: new Date() 
        })
        await transaction.save();
        await existingUser.save();
        await order.save();
        return res.status(200).json({
            success:true,
            message:'Order Placed',
            data: order,
            err:{}
        });
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'Error Encountered in depositing money',
            data: {},
            err:error
        });
    }
}

const getUserDetails = async ( req,res ) => {
    try{
        const id = req.params.id;
        const existingUser = await User.findById(id);
        return res.status(200).json({
            success:true,
            message:'User Details',
            data: existingUser,
            err:{}
        });
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'Error Encountered in depositing money',
            data: {},
            err:error
        });
    }
}

const getPortfolio = async ( req,res ) => {
    try{
        const id = req.params.id;
        const stocks = await Stock.find({user:id});
        return res.status(200).json({
            success:true,
            message:'Recieved all stocks',
            data: stocks,
            err:{}
        });
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'Error Encountered in depositing money',
            data: {},
            err:error
        });
    }
}

const getOrders = async ( req,res ) => {
    try{
        const id = req.params.id;
        const stocks = await Order.find({user:id});
        return res.status(200).json({
            success:true,
            message:'Recieved all orders',
            data: stocks,
            err:{}
        });
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'Error Encountered in depositing money',
            data: {},
            err:error
        });
    }
}

module.exports = { 
    register,
    login,
    deposit,
    getAllUserTransaction,
    orderStock,
    getUserDetails,
    getPortfolio,
    getOrders
};