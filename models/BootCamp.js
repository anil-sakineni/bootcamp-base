const mongoose = require("mongoose");


const schema = {
    name: {
        type: String,
        required : [true, "Please add bootcamp name"],
        unique: true,
        maxLength: [50, "name can not more than 50 characters"]
    },

    description: {
        type: String,
        required: [true, 'Please Add Description'],
        maxlength: [500, 'description can not be more than 500 characters']
    },

    phone: {
        type: String,
        maxlength: [10, 'phone can not be more than 10 characters']
    },

    email: {
        type: String,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'please use a valid email']
    },
    address: {
        type: String,
        required: [true, 'please add an address']
    },

    // TODO - location

    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },

    user: {

    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}


const BootCampSchema = new mongoose.Schema(schema);

module.exports = mongoose.model("BootCamp", BootCampSchema);