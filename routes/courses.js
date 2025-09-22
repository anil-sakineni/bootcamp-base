const express = require("express");
const { protect, authorize } = require("../middleware/auth")
const {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse
} = require("../controllers/courses");

const router = express.Router();

router.get("/", getCourses);
router.post("/", protect, authorize("publisher", "admin"), createCourse);
router.put("/:id", protect, authorize("publisher", "admin"), updateCourse);
router.delete("/:id", protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;