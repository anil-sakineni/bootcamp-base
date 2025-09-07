
const express = require("express");
const connectDB = require("./config/db.js");
const dotenv=require("dotenv")


//route files
const bootcamps = require("./routes/bootcamps.js");
const User=require("./routes/user.js")

// dotenv config
dotenv.config()

// connect to Database
connectDB();

const app = express();

// Body Parser
app.use(express.json());

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/user",User)


const PORT = 5000;


app.get('/health', (request, response) =>{
    response.status(200).json({message: "API is running"})
});


app.listen(PORT, () =>{
    console.log(`Server is listening on port : ${PORT}`);
});



