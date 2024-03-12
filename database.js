const mongoose = require("mongoose")
require("dotenv").config()

const ConnectToMongoDB = ()=>{
   try {
    mongoose.connect(process.env.APP_DATABASE_URL)
   } catch (error) {
    console.log("Unable to connect to database");
   }
}

module.exports = ConnectToMongoDB