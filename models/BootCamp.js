const mongoose = require("mongoose");

const schema = {
  name: {
    type: String,
    required: [true, "Please add bootcamp name"],
    unique: true,
    maxLength: [50, "name can not more than 50 characters"],
  },

  description: {
    type: String,
    required: [true, "Please Add Description"],
    maxlength: [500, "description can not be more than 500 characters"],
  },
  website: {
    type: String,
    required: [true, "please add website link"],
  },
  phone: {
    type: String,
    maxlength: [10, "phone can not be more than 10 characters"],
  },

  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please use a valid email",
    ],
  },
  address: {
    type: String,
    required: [true, "please add an address"],
  },

  carrers: {
    type: String,
    enum: ["FullStackWebDevelopment", "DataScience", "Devops"],
    default: "FullStackWebDevelopment",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGurantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating must can not more than 10"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
};

const BootCampSchema = new mongoose.Schema(schema);

BootCampSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await this.model("Course").deleteMany({ bootcamp: this._id });
    next();
  }
);

module.exports = mongoose.model("BootCamp", BootCampSchema);
