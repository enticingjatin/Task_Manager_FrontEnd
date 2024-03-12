const express = require("express")
const routes = express.Router();
const mongoose = require("mongoose")
const TaskModel = require("../model/task")
const jwtVerification = require("../middleware/jwtVerification")
const { body, validationResult } = require('express-validator');
require("dotenv").config()

// create task
routes.post("/create", [jwtVerification],[
    body("title").not().isEmpty().withMessage("Title is required."), 
    body("description").not().isEmpty().withMessage("Description is required."), 
],async (req,res)=>{
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
            title, description
        } = req.body
    
        const saveTasks = new TaskModel();
        saveTasks.title=title;
        saveTasks.description=description;
        saveTasks.createdBy=req.user._id;
        await saveTasks.save();

        return res.status(200).json({
            status: true,
            message: "Task has been created successfully!",
            data: saveTasks
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal error!"+error,
        })
    }

})

// Update task
routes.post("/update/:taskId", [jwtVerification],[
    body("title").not().isEmpty().withMessage("Title is required."), 
    body("description").not().isEmpty().withMessage("Description is required."), 
],async (req,res)=>{
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

        const task = await TaskModel.findById(new mongoose.Types.ObjectId(req.params.taskId));

        if(!task){
            return res.status(500).json({
                status: false,
                message: "Invalid Task! No such a task exists.",
            })
        }
        
        const {
            title, description
        } = req.body

        const UpdateData = {
            title : title,
            description : description
        }
    
        const UpdateTask = await TaskModel.findByIdAndUpdate(new mongoose.Types.ObjectId(req.params.taskId), UpdateData)

        const UpdatedTask = await TaskModel.findById(new mongoose.Types.ObjectId(req.params.taskId))

        return res.status(200).json({
            status: true,
            message: "Task has been Updated successfully!",
            data: UpdatedTask
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal error!"+error,
        })
    }

})

// delete task
routes.post("/delete/:taskId", [jwtVerification], async (req,res)=>{

    try {

        const task = await TaskModel.findById(new mongoose.Types.ObjectId(req.params.taskId));

        if(!task){
            return res.status(500).json({
                status: false,
                message: "Invalid Task! No such a task exists.",
            })
        }
    
        const UpdateTask = await TaskModel.findByIdAndDelete(new mongoose.Types.ObjectId(req.params.taskId))

        return res.status(200).json({
            status: true,
            message: "Task has been Deleted successfully!",
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal error!"+error,
        })
    }

})


// get tasks
routes.get("/get/", [jwtVerification], async (req,res)=>{

    try {

        const tasks = await TaskModel.find({createdBy: new mongoose.Types.ObjectId(req.user._id)})

        return res.status(200).json({
            status: true,
            message: "Task has been Deleted successfully!",
            data: tasks
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal error!"+error,
        })
    }

})



module.exports =  routes;