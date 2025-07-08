const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/usersModel');
const dotenv = require('dotenv');
dotenv.config();

// Register User
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, industry, company, email, phone, password, confirmPassword } = req.body;
        const userExist = await User.findOne({ email });

        if(userExist) return res.status(400).json({ message: "User already exists" });
        if(password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ 
            firstName, 
            lastName, 
            industry, 
            company, 
            email, 
            phone, 
            password: hashedPassword });

        res.status(201).json({ message: "User created successfully", user: user._id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


// Login User
const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;   
        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({ message: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign({ usrId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({ message: "User logged in successfully", user: user._id });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


module.exports = { registerUser, loginUser };
