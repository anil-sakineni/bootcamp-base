const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");
const advancedResults=require("../middleware/advancedResults");
const Course = require("../models/Course");

const router = express.Router({ mergeParams: true });

router.get("/",advancedResults(Course,{path:"bootcamp",select:"name description"}), getCourses);
router.post("/", protect, authorize("publisher", "admin"), createCourse);
router.get("/:id",getCourseById)
router.put("/:id", protect, authorize("publisher", "admin"), updateCourse);
router.delete("/:id", protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
