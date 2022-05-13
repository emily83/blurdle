const mongoose = require('mongoose');

const connectDB = async () => {
    try {

        const uri = process.env.NODE_ENV == 'development' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI
        const conn = await mongoose.connect(uri);

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    } catch (err) {
        console.log(`Error: ${err.message}`.red);
        process.exit(1);
    }
}

module.exports = connectDB;