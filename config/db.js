const mongoose = require("mongoose");






const connectDB = async function () {
    try {
        await mongoose.connect("mongodb+srv://anil_sakineni:vdWvXe7emwNTD8EG@cluster-1.uzh01oa.mongodb.net/bootcamp?retryWrites=true&w=majority&appName=cluster-1", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: false
        });
        console.log("connected to db");
        

    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;