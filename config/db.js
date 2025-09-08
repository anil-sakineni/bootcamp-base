const mongoose = require("mongoose");

const MONGO_SERVER = process.env.MONGO_SERVER || "";
const USERNAME = process.env.MONGO_USERNAME || "";
const PASSWORD = process.env.MONGO_PASSWORD || "";

const MONGO_URI = `mongodb+srv://${USERNAME}:${PASSWORD}@${MONGO_SERVER}`;


const connectDB = async function () {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("connected to db");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;