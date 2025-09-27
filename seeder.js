const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "config/config.dev.env"),
});
const connectDB = require("./config/db");

console.log("args",args);


//load env data
const bootcamps = require("./_data/bootcamps");
const courses = require("./_data/courses");
const reviews = require("./_data/reviews");
const users = require("./_data/users");

// load models
const bootcampModel = require("./models/BootCamp");
const courseModel = require("./models/Course");
const userModel = require("./models/User");
const reviewModel = require("./models/Review");

//connect to DB

//load all JSOn files
async function insert() {    
  await connectDB();
  await userModel.insertMany(users);
  await bootcampModel.insertMany(bootcamps);
  await courseModel.insertMany(courses);
  await reviewModel.insertMany(reviews);
  console.log("successfully inserted");
  
}

async function Delete() {
  await connectDB();
  await userModel.deleteMany();
  await bootcampModel.deleteMany();
  await courseModel.deleteMany();
  await reviewModel.deleteMany();
  console.log("successfully deleted");
}

// import data to DB if operation is -i
if (args.includes("-i")) {
  insert();
}
// delete data from. db if operation is -d
else if (args.includes("-d")) {
  console.log("delete function");

  Delete();
}
// seeder.js -i
// seeder.js -d
