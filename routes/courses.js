const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
} = require("../controllers/courses");
const Course = require("../models/Course");
const advancedResults=require("../middleware/advancedResults");
const router = express.Router({ mergeParams: true });

router.get("/",advancedResults(Course, "bootcamps"), getCourses);
router.post("/", protect, authorize("publisher", "admin"), createCourse);
router.get("/:id",protect,authorize("user","publisher","admin"),getCourseById)
router.put("/:id", protect, authorize("publisher", "admin"), updateCourse);
router.delete("/:id", protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
