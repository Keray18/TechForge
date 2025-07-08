const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = () => { mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => console.log(err, 'Error connecting to MongoDB'));
};

module.exports = connectDB;