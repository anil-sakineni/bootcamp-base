const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getBootcamps,
  getBootcamp,
  createBootCamp,
  updateBootCamp,
  deleteBootcamp,
} = require("../controllers/bootcamps");

const advancedResults=require("../middleware/advancedResults");

// Include Other Resourse Routers
const courseRouter = require("./courses");
const reviewRouter= require("./review");
const BootCamp = require("../models/BootCamp");

const router = express.Router();

// Re route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/review", reviewRouter);

router
  .route("/")
  .get(advancedResults(BootCamp,{path:"courses",select:"title  description"}), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootCamp);

router
  .route("/:id")
  .get(protect, authorize("user", "publisher", "admin"), getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootCamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

module.exports = router;
