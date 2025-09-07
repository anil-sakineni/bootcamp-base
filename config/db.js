const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async function () {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify:false
        });

    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;