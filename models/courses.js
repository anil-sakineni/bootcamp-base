const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const schema = {
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    weeks: {
        type: Number,
        required: true
    },
    tuitionFee: {
        type: Number,
        required: true
    },
    minimumSkill: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced']

    },
    ScholarshipAvailable: {
        type: Boolean,
        required: true
    },
    bootcamp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BootCamp",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    }
}

const courseSchema = new mongoose.Schema(schema);

module.exports = mongoose.model("Course", courseSchema);

courseSchema.methods.getJwtToken=function (){
    const generateToken=jwt.sign(
        {id:this._id},process.env.JWT_SECRET,
        {expiresIn:process.env.EXPIRES_IN}
    )
    return generateToken;
}