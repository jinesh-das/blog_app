const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();


const userAuth = async (req, res, next) => {
    const { token } = req.cookies;
    
    if (!token) {
        return res.status(401).json({ error: "please login" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
       
        const user =await User.findById(decodedToken.userId);
       
        
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user;
       
        
       
        
        next();

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expired" });
        }
        return res.status(401).json({ error: "Invalid token" });
    }

}


module.exports = { userAuth };