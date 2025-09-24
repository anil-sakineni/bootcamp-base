const mongoose = require("mongoose");
const logger = require("../utils/logger");

const MONGO_SERVER = process.env.MONGO_SERVER || "";
const USERNAME = process.env.MONGO_USERNAME || "";
const PASSWORD = process.env.MONGO_PASSWORD || "";

const MONGO_URI = `mongodb+srv://${USERNAME}:${PASSWORD}@${MONGO_SERVER}`;

const connectDB = async function () {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("connected to db");
  } catch (error) {
    logger.error("connection failed", error);
  }
};

module.exports = connectDB;
