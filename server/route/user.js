const express = require('express');
const {UserController} = require('../controller')

const userRouter = express.Router();

userRouter.post('/login', UserController.login);
userRouter.post('/register',UserController.register);
userRouter.post('/deposit',UserController.deposit);
userRouter.post('/order',UserController.orderStock);
userRouter.get('/transactions/:id',UserController.getAllUserTransaction);
userRouter.get('/:id',UserController.getUserDetails);
userRouter.get('/portfolio/:id',UserController.getPortfolio);

module.exports = userRouter;