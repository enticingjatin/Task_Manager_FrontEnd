const express = require("express")
const routes = express.Router();
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken');
require("dotenv").config()
const UserModel = require("../model/user")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { body, validationResult } = require('express-validator');

// Resistration
routes.post( "/signup", [

    body("name").notEmpty().withMessage("Name is required"), 
    body("username").custom(async(data)=>{
    
        if(!data){
            throw new Error("Username is required")
        }else{
            const UserDetails = await UserModel.findOne({username: data})

            if(UserDetails) {
                throw new Error ("Username already exists");
            }else{
                return true;
            }
        }
    }), 
    body("mobile").notEmpty().withMessage("Mobile Number is required"), 
    body("password").custom((data)=>{
        if(!data){
            throw new Error("Password is required");
        }else if(data.length < 6) {
            throw new Error("The password must be at least 6 characters long");
        }else{
            return true
        }
    }), 

],async (req, res) => {
    // Finds the errores within
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(422).json({
            status: false,
            message: errors.errors[0].path+" : "+errors.errors[0].msg,
            errors
        })
    };

    try {

        const {
            name, username, mobile, password
        } = req.body

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPassword = bcrypt.hashSync(password, salt);

        const saveUser = new UserModel();
        
        saveUser.name = name;
        saveUser.username = username;
        saveUser.password = hashPassword;
        saveUser.mobile = mobile;

        await saveUser.save()

        const jwtData = {
            id: saveUser._id
        }

        const jwtToken = jwt.sign(jwtData, process.env.JWT_KEY);

        res.status(200).json({
            status : true ,
            message: "User has been created successfully!",
            accessToken: jwtToken
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal error!"+error,
        })
    }
})

// Login api
routes.post("/signin", [
    body("username").custom(async(data)=>{
    
        if(!data){
            throw new Error("Username is required")
        }else{
            const UserDetails = await UserModel.findOne({username: data})

            if(!UserDetails) {
                throw new Error ("This username does not exists");
            }else{
                return true;
            }
        }
    }), 
    body("password").custom((data)=>{
        if(!data){
            throw new Error("Password is required");
        }else if(data.length < 6) {
            throw new Error("The password must be at least 6 characters long");
        }else{
            return true
        }
    }), 
],async (req, res)=>{
    // Finds the errores within
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(422).json({
            status: false,
            message: errors.errors[0].path+" : "+errors.errors[0].msg,
            errors
        })
    };

    try {
        const {
            username, password
        } = req.body

        const UserDetails = await UserModel.findOne({username: username});
        const passwordCheck = await bcrypt.compare(password, UserDetails.password);

        if(!passwordCheck){
            return res.status(400).json({
                status: false,
                message: "Invalid Password!"
            })
        }

        const jwtData = {
            id: UserDetails._id
        }

        const jwtToken = jwt.sign(jwtData, process.env.JWT_KEY);

        return res.status(200).json({
            status: true,
            message: "User has been logged in successfully!",
            accessToken : jwtToken
        })


        
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal error!"+error,
        })
    }
})

module.exports =  routes;