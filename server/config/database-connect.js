const mongoose = require('mongoose');
const ServerConfig = require('./server-config');

const dbConnect = async () => {
    const connectionParams = {dbName: 'brokersky'};
  
    await mongoose.connect(ServerConfig.MONGO_DB_URL,connectionParams);
  
    mongoose.connection.on('connected', () => {
        console.log('connected to database sucessfully')
    })
  
    mongoose.connection.on('error', (err) => {
        console.log('Error occured while connecting' + err)
    })
  
    mongoose.connection.on('disconnected', (err) => {
        console.log('Database disconnected')
    })
  
};

module.exports = dbConnect;