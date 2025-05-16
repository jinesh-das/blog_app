const mongoose = require('mongoose');
require('dotenv').config();


const  connectDB = async () => {
    try{
        await mongoose.connect(process.env.DB_URI);
        console.log('db connected');
    }catch(err){
        console.log(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;