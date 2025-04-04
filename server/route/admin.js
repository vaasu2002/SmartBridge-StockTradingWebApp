const express = require('express');
const {AdminController} = require('../controller')

const adminRouter = express.Router();

adminRouter.get('/stats', AdminController.getAdminStats);
adminRouter.get('/stats/transaction', AdminController.getTransaction);


module.exports = adminRouter;