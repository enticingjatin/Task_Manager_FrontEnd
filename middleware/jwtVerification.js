const jwt = require('jsonwebtoken');
const UserModel = require('../model/user');
const { default: mongoose } = require('mongoose');
require("dotenv").config()

const jwtVerification = async (req, res, next) => {
    try {

        const token = req.headers["user-token"];
        if(!token){
            return res.status(401).json({
                status: false,
                message: "Unauthorized Request! Please Login First."
            })
        }

        const jwtData = jwt.verify(token, process.env.JWT_KEY)

        const UserDetails = await UserModel.findById(new mongoose.Types.ObjectId(jwtData.id))

        if(!UserDetails){
            return res.status(401).json({
                status: false,
                message: "Unauthorized Request! Please Login First."
            })
        }

        req.user = UserDetails;

        next();

    } catch (error) {
        return res.status(401).json({
            status: false,
            message: "Unauthorized Request! Please Login First."
        })
    }

}

module.exports = jwtVerification;