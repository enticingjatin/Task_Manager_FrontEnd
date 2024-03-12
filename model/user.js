const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    name: {type: String, required: false},
    username: { type: String, required: true, unique: true },
    mobile: {type: Number},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now()}
})

const  UserModel = mongoose.model("user", UserSchema);
UserModel.createIndexes();

module.exports = UserModel;