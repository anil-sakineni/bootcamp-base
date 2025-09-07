
const express = require("express");
const connectDB = require("./config/db");


//route files
const bootcamps = require("./routes/bootcamps.js");

// connect to Database
connectDB();

const app = express();

// Body Parser
app.use(express.json());

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);


const PORT = 5000;


app.get('/health', (request, response) =>{
    response.status(200).json({message: "API is running"})
});


app.listen(PORT, () =>{
    console.log(`Server is listening on port : ${PORT}`);
});



