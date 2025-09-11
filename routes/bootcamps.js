const express = require("express");
const {protect, authorize} = require("../middleware/auth")
const { getBootcamps, getBootcamp, createBootCamp, updateBootCamp, deleteBootcamp } = require("../controllers/bootcamps");

const router = express.Router();

router.route("/").get(getBootcamps).post(protect, authorize("publisher", "admin"), createBootCamp);

router
    .route("/:id")
    .get(getBootcamp)
    .put(updateBootCamp)
    .delete(deleteBootcamp);

module.exports = router;
