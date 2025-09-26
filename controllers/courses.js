const Course = require("../models/Course");
const Errorresponse = require("../utils/errorResponse");
const BootCamp = require("../models/BootCamp");
const logger = require("../utils/logger");

//@desc - get all courses
//@route - /api/v1/bootcamps/:bootcampId/courses/
//@access - public
exports.getCourses = async (req, res, next) => {
  logger.debug("entering into getCourses controller function", req.requestId);
  try {
    logger.debug("trying to find courses by bootcamp", req.requestId);
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    logger.info("successfully find courses by bootcamp", req.requestId);
    res.status(200).json({
      message: "courses fetched success",
      courses: courses,
    });
  } catch (err) {
    logger.debug("error occured while fetching courses", req.requestId);
    next(err);
  }
};

//@desc - create new course
//@route - /api/v1/bootcamps/:bootcampId/courses/
//@access - private
exports.createCourse = async (req, res, next) => {
  logger.debug("entering into createCourse controller function", req.requestId);
  try {
    logger.info("trying to create course ", req.requestId);
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
      logger.warn("you are not allowed to createc course", req.requestId);
      return next(
        new Errorresponse(
          `user ${req.user.id} is not authorized to create course`,
          401
        )
      );
    }
    logger.debug(
      "trying to check if the course is already exists or not",
      req.requestId
    );
    const existingCourse = await Course.findOne({ title: req.body.title });
    if (existingCourse) {
      logger.warn("the course with title already exists ", req.requestId);
      return next(
        new Errorresponse(`course already existed with ${req.body.title}`, 400)
      );
    }
    logger.debug("trying to create course", req.requestId);
    const course = await Course.create(req.body);
    logger.info("successfully created course", req.requestId);
    res.status(201).json({
      message: "course create successfully",
      success: true,
      course: course,
    });
  } catch (err) {
    logger.debug("error occured while creating course", req.requestId);
    next(err);
  }
};

//@desc - update course  by id
//@route - /api/v1/bootcamps/:bootcampId/courses/:id
//@access - private
exports.updateCourse = async (req, res, next) => {
  logger.debug(
    "entering into the updateCourse controller function",
    req.requestId
  );
  try {
    logger.debug("trying to find course by id", req.requestId);
    const course = await Course.findById(req.params.id);

    if (course.user.toString() != req.user.id && req.user.role != "admin") {
      logger.warn("you are allowed to update the course ", req.requestId);
      next(
        new Errorresponse(
          `user with ${req.user.id} not allowed to update the course`,
          401
        )
      );
    }
    logger.debug("trying to update the course", req.requestId);
    await Course.findByIdAndUpdate(req.params.id, req.body);
    logger.info("successfully updated the course", req.requestId);
    res.status(200).json({
      success: true,
      message: "course updated ssuccessfully",
    });
  } catch (err) {
    logger.error("error occuered while updating the course", req.requestId);
    next(err);
  }
};

//@desc - delete courses by id
//@route - /api/v1/bootcamps/:bootcampId/courses/:id
//@access - private
exports.deleteCourse = async (req, res, next) => {
  logger.debug("entering into deleteCourse controller function", req.requestId);
  try {
    logger.debug("trying to find the course by id", req.requestId);
    const course = await Course.findById(req.params.id);
    if (!course) {
      logger.warn("no course is found by id", req.requestId);
      return next(
        new Errorresponse(
          `no course is available from this ${req.params.id}`,
          404
        )
      );
    }
    if (course.user.toString() != req.user.id && req.user.role != "admin") {
      logger.warn("you are not allowed to delete the course", req.requestId);
      return next(
        new Errorresponse(
          `user with ${req.user.id} not allowed to delete the course`,
          401
        )
      );
    }
    logger.debug("trying to delete the course", req.requestId);
    await course.deleteOne();
    logger.info("course deleted successfully", req.requestId);
    res.status(200).json({
      success: true,
      message: "successfully deleted course",
    });
  } catch (err) {
    logger.error("error occured while deleting the course", req.requestId);
    next(err);
  }
};
