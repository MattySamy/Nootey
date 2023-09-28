const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

mongoose.set('strictQuery', false);


const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to MongoDB =>', conn.connection.host)
    } catch (err) {
        console.log(err);
    }
}

module.exports = connectDB;