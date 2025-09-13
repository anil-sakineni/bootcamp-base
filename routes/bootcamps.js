const express = require("express");
const { protect, authorize } = require("../middleware/auth")
const {
    getBootcamps,
    getBootcamp,
    createBootCamp,
    updateBootCamp,
    deleteBootcamp
} = require("../controllers/bootcamps");

const router = express.Router();

router
    .route("/")
    .get(protect, authorize("user", "publisher", "admin"), getBootcamps)
    .post(protect, authorize("publisher", "admin"), createBootCamp);

router
    .route("/:id")
    .get(protect, authorize("user", "publisher", "admin"), getBootcamp)
    .put(protect, authorize("publisher","admin"), updateBootCamp)
    .delete(protect, authorize("admin"), deleteBootcamp);

module.exports = router;
