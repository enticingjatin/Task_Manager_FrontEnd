const mongoose = require("mongoose")

const TaskSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "user", required:true},
    createdAt: {type: Date, default: Date.now()}
})

const  TaskModel = mongoose.model("task", TaskSchema);
TaskModel.createIndexes();

module.exports = TaskModel;