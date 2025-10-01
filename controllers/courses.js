const Course = require("../models/Course");
const Course = require("../models/Course");
const Errorresponse = require("../utils/errorResponse");
const BootCamp = require("../models/BootCamp");

//@desc - get all courses
//@route - /api/v1/bootcamps/:bootcampId/courses/
//@access - public
exports.getCourses = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (err) {
    next(err);
  }
};

//@desc - create new course
//@route - /api/v1/bootcamps/:bootcampId/courses/
//@access - private
exports.createCourse = async (req, res, next) => {
  try {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await BootCamp.findById(req.params.bootcampId);

    if (!bootcamp) {
      logger.warn("no bootcamp found by id", req.requestId);
      return next(
        new Errorresponse(
          `Bootcamp not found with id ${req.params.bootcampId}`,
          404
        )
      );
    }

    if (bootcamp.user.toString() != req.user.id && req.user.role != "admin") {
      return next(
        new Errorresponse(
          `user ${req.user.id} is not authorized to create course`,
          401
        )
      );
    }
    const existingCourse = await Course.findOne({ title: req.body.title });
    if (existingCourse) {
      return next(
        new Errorresponse(`course already existed with ${req.body.title}`, 400)
      );
    }
    const course = await Course.create(req.body);
    res.status(201).json({
      message: "course create successfully",
      success: true,
      course: course,
    });
  } catch (err) {
    next(err);
  }
};

//@desc - get course  by id
//@route - /api/v1/bootcamps/:bootcampId/courses/:id
//@access - public

exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    res.status(200).json({
      success: true,
      message: `course found by ${req.params.id}`,
      course: course,
    });
  } catch (err) {
    next(err);
  }
};
//@desc - update course  by id
//@route - /api/v1/bootcamps/:bootcampId/courses/:id
//@access - private
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course.user.toString() != req.user.id && req.user.role != "admin") {
      next(
        new Errorresponse(
          `user with ${req.user.id} not allowed to update the course`,
          401
        )
      );
    }
    await Course.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "course updated ssuccessfully",
    });
  } catch (err) {
    next(err);
  }
};

//@desc - delete courses by id
//@route - /api/v1/bootcamps/:bootcampId/courses/:id
//@access - private
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return next(
        new Errorresponse(
          `no course is available from this ${req.params.id}`,
          404
        )
      );
    }
    if (course.user.toString() != req.user.id && req.user.role != "admin") {
      return next(
        new Errorresponse(
          `user with ${req.user.id} not allowed to delete the course`,
          401
        )
      );
    }
    await course.deleteOne();
    res.status(200).json({
      success: true,
      message: "successfully deleted course",
    });
  } catch (err) {
    next(err);
  }
};
