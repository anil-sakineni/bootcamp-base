const express = require("express");
const { protect, authorize } = require("../middleware/auth")
const {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse
} = require("../controllers/courses");
const router = express.Router();

router.get("/getCourses", protect, authorize("user", "publisher", "admin"), getCourses);
router.post("/createCourse", protect, authorize("publisher", "admin"), createCourse);
router.put("/updateCourse/:id", protect, authorize("publisher", "admin"), updateCourse);
router.delete("/deleteCourse/:id", protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;