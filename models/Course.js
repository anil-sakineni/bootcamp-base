const mongoose = require("mongoose");

const schema = {
  title: {
    type: String,
    required: [true, "please add tittle"],
  },
  description: {
    type: String,
    required: [true, "please add description"],
  },
  weeks: {
    type: Number,
    required: [true, "please add weeks"],
  },
  tuitionFee: {
    type: Number,
    required: [true, "please mention amount"],
  },
  minimumSkill: {
    type: String,
    required: [true, "please add minimim skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  ScholarshipAvailable: {
    type: Boolean,
    required: [true, "please mention scholorship is available or not"],
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

const courseSchema = new mongoose.Schema(schema);

module.exports = mongoose.model("Course", courseSchema);
