require("dotenv").config({ path: "./config/config.dev.env" });
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const requestIdMiddleware = require("./middleware/requestId");

const cookieParser = require("cookie-parser");
//route files
const bootcamps = require("./routes/bootcamps");
const User = require("./routes/user");
const auth = require("./routes/auth");

// connect to Database
connectDB();

const app = express();

//RequestId generator
app.use(requestIdMiddleware);

// Body Parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

//enable cors

app.use(cors());

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/user", User);
app.use("/api/v1/auth", auth);

// Error handle middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.get("/health", (request, response) => {
  response.status(200).json({ message: "API is running" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port : ${PORT}`);
  
});
