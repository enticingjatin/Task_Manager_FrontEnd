const express = require("express")
const cors = require("cors"); // Import the cors middleware
const ConnectToMongoDB = require("./database")

// Make app
const app = express();
app.use(express.json()); 

// Make port
const port = 5000;
ConnectToMongoDB()

app.use(cors());

// Routes
app.use("/api/auth", require("./routes/user"))
app.use("/api/task", require("./routes/task"))


// Listen port
app.listen(port, ()=>{
    console.log("App is listening on port : "+port)
})