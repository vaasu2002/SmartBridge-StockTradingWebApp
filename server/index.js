const express = require('express');
var cors = require('cors')

const apiRouter = require('./route');
const { ServerConfig,dbConnect } = require('./config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
const corsOptions = {
    origin: '*',
}
app.use(cors(corsOptions));
app.use('/api', apiRouter);

app.listen(ServerConfig.PORT, async () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
    dbConnect();
});