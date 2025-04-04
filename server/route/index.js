const express = require('express');
const userRouter = require('./user');
const adminRouter = require('./admin');
const apiRouter = express.Router();

apiRouter.use('/user', userRouter); 
apiRouter.use('/admin', adminRouter); 

module.exports = apiRouter;