const Course = require("../models/Course");
const Errorresponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");
const BootCamp = require("../models/BootCamp");

//@desc - get all courses
//@route - /api/v1/bootcamps/:bootcampId/courses/
//@access - public
exports.getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find();
        res.status(200).json({
            message: "courses fetched success",
            courses: courses
        })
    } catch (err) {
        next(err)
    }
}


//@desc - create new course
//@route - /api/v1/bootcamps/:bootcampId/courses/
//@access - private
exports.createCourse = async (req, res, next) => {
    try {

        req.body.bootcamp = req.params.bootcampId;
        console.log("params===>",req.params.bootcampId);
        
        req.body.user = req.user.id;

        const bootcamp = await BootCamp.findById(req.params.bootcampId);
        console.log("bootcamp===>",bootcamp);
        

        if(!bootcamp){
           return next(new Errorresponse(`Bootcapm not found with id ${req.params.bootcampId}`, 404));
        }

        //make sure user owns the bootcamp or has admin role.

        if(bootcamp.user.toString() != req.user.id && req.user.role != "admin"){
            return next(new Errorresponse(`user ${req.user.id} is not authorized to create course`, 401));
        }
          
        const course = await Course.create(req.body);

        res.status(201).json({
            message: "course create successfully",
            success: true,
            course: course
        })

    } catch (err) {
        next(err)
    }
}

//@desc - update course  by id
//@route - /api/v1/bootcamps/:bootcampId/courses/:id
//@access - private
exports.updateCourse = async (req, res, next) => {
    try {
       
       const bootcamp=await BootCamp.findById(req.params.bootcampId);

       if(bootcamp.user.toString()!=req.user.id && req.user.role !="admin"){

        next(new Errorresponse("not allowed to update",401))

       }
        
        await Course.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({
            "success": true,
            "message": "course updated ssuccessfully"

        })

    } catch (err) {
        next(err)
    }
}

//@desc - delete courses by id
//@route - /api/v1/bootcamps/:bootcampId/courses/:id
//@access - private
exports.deleteCourse = async (req, res, next) => {
    try {

        const bootcamp=await BootCamp.findById(req.params.bootcampId)
        if(bootcamp.user.toString()!=req.user.id && req.user.role!="admin"){
            return next(new Errorresponse("not allowed to delete",401))
        }
         await Course.findByIdAndDelete(req.params.id);
        res.status(200).json({
            "success": true,
            "message": "successfully deleted course"
        })
    } catch (err) {
        next(err)
    }
}