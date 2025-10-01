const Review = require("../models/Review");
const BootCamp = require("../models/BootCamp");
const Errorresponse = require("../utils/errorResponse");

//@desc - create new review
//@route - /api/v1/bootcamps/:bootcampId/review
//@access - public
exports.createReview = async (req, res, next) => {
  try {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await BootCamp.findById(req.params.bootcampId);

    if (!bootcamp) {
      return next(
        new Errorresponse(`no bootcamp found by ${req.params.bootcampId}`, 404)
      );
    }

    const review = await Review.create(req.body);
    res.status(201).json({
      success: true,
      message: "review created successfully",
      review: review,
    });
  } catch (err) {
    next(err);
  }
};

//@desc - get reviews
//@route - /api/v1/bootcamps/:bootcampId/review
//@access - public
exports.getReviews = async (req, res, next) => {
  try {   
   res.status(200).json(res.advancedResults);
  } catch (err) {
    next(err);
  }
};

//@desc - update review
//@route - /api/v1/bootcamps/:bootcampId/review/:id
//@access - private

exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      next(new Errorresponse(`no user found  by ${req.params.id}`, 404));
    }
    if (review.user.toString() != req.user.id && req.user.role != "admin") {
      next(new Errorresponse("not allowed to updata", 401));
    }

    await Review.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "review updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      next(
        new Errorresponse(`no review found by ${req.params.id} delete`, 404)
      );
    }
    if (review.user.toString() != req.user.id && req.user.role != "admin") {
      next(new Errorresponse("not allowed to updata", 401));
    }
    await Review.deleteOne();
    res.status(200).json({
      success: true,
      message: "review deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
