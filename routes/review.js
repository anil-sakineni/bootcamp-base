const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
} = require("../controllers/review");
const advancedResults = require("../middleware/advancedResults");
const Review = require("../models/Review");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  protect,
  authorize("user", "publisher", "admin"),
  createReview
);
router.get("/", advancedResults(Review, "bootcamps"), getReviews);
router.put(
  "/:id",
  protect,
  authorize("user", "publisher", "admin"),
  updateReview
);
router.delete(
  "/:id",
  protect,
  authorize("user", "publisher", "admin"),
  deleteReview
);

module.exports = router;
