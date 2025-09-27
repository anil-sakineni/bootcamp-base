const mongoose = require("mongoose");


const schema = {
  title: {
    type: String,
    required: [true, "please add the title"],
  },
  text: {
    type: String,
    required: [true, "please add the text"],
  },
  rating: {
    type: Number,
    required: [true, "please add the rating"],
  },
  bootcamp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BootCamp",
    required: [true, "please add bootcamp"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "please add user"],
  },
};

const reviewSchema = new mongoose.Schema(schema);

module.exports = mongoose.model("Review", reviewSchema);
