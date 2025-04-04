const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT || 3002,
    MONGO_DB_URL: process.env.MONGO_DB_URL,
}