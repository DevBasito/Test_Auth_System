const jwt = require("jsonwebtoken")
require('dotenv').config();
const {SECRET} = process.env

exports.authenticateUsers = (req, res, next) => {
    const token = req.headers.authorization;
    

    if (!token) {
        return res.status(401).json({
            statusCode: 401,
            message: "No token, Authorization denied"
        })
        
    }

    try {
        const decoded = jwt.verify(token, SECRET )

        req.user = decoded.user;
        next()
    } catch (error) {
        return res.status(401).json({
            statusCode: 401,
            message: "Token Invalid"
        })
        
        
    }
}

exports.checkIfAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' ){
        res.status(401).json({
            message: 'Sorry!, This route can only be accessed by Admin'
        })
    }

    return next();

}