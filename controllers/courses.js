const course = require("../models/courses");
const Errorresponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");
const BootCamp = require("../models/BootCamp");

exports.getCourses = async (req, res, next) => {
    try {
        const courses = await course.find();
        res.status(200).json({
            message: "courses fetched success",
            courses: courses
        })
    } catch (err) {
        next(err)
    }


}

exports.createCourse = async (req, res, next) => {
    try {
        let token;
        if (req.cookies.token1) {
            token = req.cookies.token1;
        }
        else {
            return next(new Errorresponse("no token found", 404))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const bootcamp = await BootCamp.findById(decoded.id);
        if (!bootcamp) {
            return res.status(400).json({
                success: false,
                message: "no bootcamp found"
            })

        }
        req.body.bootcamp = bootcamp.id;
        req.body.user = req.user.id;
        const createCourse = await course.create(req.body);
        res.status(201).json({
            message: "course create successfully",
            course: createCourse
        })
    } catch (err) {
        next(err)
    }
}

exports.updateCourse = async (req, res, next) => {
    try {
        const updated = await course.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({
            "success": true,
            "message": "course updated ssuccessfully"

        })

    } catch (err) {
        next(err)
    }
}

exports.deleteCourse = async (req, res, next) => {
    try {
        const deleteCourse = await course.findByIdAndDelete(req.params.id);
        res.status(200).json({
            "success": true,
            "message": "successfully deleted course"
        })
    } catch (err) {
        next(err)
    }
}