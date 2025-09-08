
const express = require("express");
const connectDB = require("./config/db");
const dotenv=require("dotenv");
const cors = require("cors");
const errorHandler = require("./middleware/error");

//route files
const bootcamps = require("./routes/bootcamps");
const User=require("./routes/user")


// load the env varaiables
dotenv.config({path: './config/config.dev.env'});

// connect to Database
connectDB();

const app = express();

// Body Parser
app.use(express.json());

//enable cors

app.use(cors())

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/user",User);
app.use("/api/v1/auth",User);



// Erro handle middleware
app.use(errorHandler);





const PORT = process.env.PORT || 5000;


app.get('/health', (request, response) =>{
    response.status(200).json({message: "API is running"})
});


app.listen(PORT, () =>{
    console.log(`Server is listening on port : ${PORT}`);
});



