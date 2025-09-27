const fs = require("fs");
require("dotenv").config({ path: "./config/config.dev.env" });
const mongoose = require("mongoose");


//load env data


//loadModels
const BootCamp = require("./models/BootCamp");
const Course = require("./models/Course");
const User = require("./models/User");
const Review = require("./models/Review");

//connect to DB
const MONGO_SERVER = process.env.MONGO_SERVER || "";
const USERNAME = process.env.MONGO_USERNAME || "";
const PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_URI = `mongodb+srv://${USERNAME}:${PASSWORD}@${MONGO_SERVER}`;
mongoose.connect(MONGO_URI);


//read all JSON files
const bootcampData = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`));
const courseData = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`));;
const reviewsData = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`));
const userData = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`));


//import data
async function importData() {    
  await User.create(userData);
  await BootCamp.create(bootcampData);
  await Course.create(courseData);
  await Review.create(reviewsData);
  console.log("Data Imported");
  process.exit()
}

//delete data
async function deleteDate() {
  await User.deleteMany();
  await BootCamp.deleteMany();
  await Course.deleteMany();
  await Review.deleteMany();

  console.log("Data Destroyed");
  process.exit()
}

if(process.argv[2] === "-i"){
  importData();

} else if(process.argv[2] === "-d"){
  deleteDate();

}else {
  console.log("un supported operation")
}