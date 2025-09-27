const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
} = require("../controllers/review");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  protect,
  authorize("user", "publisher", "admin"),
  createReview
);
router.get("/", protect, authorize("user", "publisher", "admin"), getReviews);
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
