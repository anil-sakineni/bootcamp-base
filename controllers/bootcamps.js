const BootCamp = require("../models/BootCamp");
const Errorresponse = require("../utils/errorResponse");
const logger = require("../utils/logger");

//@desc - get bootcamps via user
//@route - /api/v1/bootcamps
//@access - public
exports.getBootcamps = async (req, res, next) => {
  logger.debug(
    "eentering into getBootCamps controller function",
    req.requestId
  );
  try {
    logger.debug("trying to find bootcamps", req.requestId);
    const bootcamps = await BootCamp.find();
    logger.info("successfully founded bootcamps", req.requestId);
    return res.status(200).json({
      success: true,
      bootcamp: bootcamps,
    });
  } catch (err) {
    logger.error("error occured while finding bootcamps", req.requestId);
    next(err);
  }
};

//@desc - create bootcamp via publiser or admin
//@route - /api/v1/bootcamps
//@access - private
exports.createBootCamp = async (req, res, next) => {
  logger.debug(
    "entering into createBootcamp controller function",
    req.requestId
  );
  try {
    logger.debug("attaching user.id to body.user", req.requestId);
    req.body.user = req.user.id;
    logger.debug("checking if any boootcamp exists by user", req.requestId);
    const publishedBootcamp = await BootCamp.findOne({ user: req.user.id });

    if (publishedBootcamp && req.user.role != "admin") {
      logger.warn("not allowed to create bootcamp", req.requestId);
      return next(
        new Errorresponse(
          `the user with id ${req.user.id} already published a one boot camp`,
          400
        )
      );
    }
    logger.debug("trying to create bootcamp", req.requestId);
    const bootCamp = await BootCamp.create(req.body);
    logger.info("succesfully created bootcamp", req.requestId);
    return res.status(201).json({
      success: true,
      message: "BootCamp crteated successfully",
      data: bootCamp,
    });
  } catch (error) {
    logger.error("error occured while created bootcamp", req.requestId);
    next(error);
  }
};

//@desc - get bootcamp for user
//@route - /api/v1/bootcamps/:id
//@access - public
exports.getBootcamp = async (req, res, next) => {
  logger.debug(
    "entering into the getBootcamp controller function",
    req.requestId
  );
  try {
    logger.debug("trying to find one bootcamp by id", req.requestId);
    const bootcamp = await BootCamp.findById(req.params.id);
    logger.info("successfully found bootcamp by id", req.requestId);
    return res.status(200).json({
      success: true,
      message: `founded bootcamp by ${req.params.id}`,
      bootcamp: bootcamp,
    });
  } catch (err) {
    logger.debug("error occured while getting bootcamp", req.requestId);
    next(err);
  }
};

//@desc - update bootcamp via publiser or admin
//@route - /api/v1/bootcamps/:id
//@access - private
exports.updateBootCamp = async (req, res, next) => {
  logger.debug(
    "entering into updtaeBootcamp controller function",
    req.requestId
  );
  try {
    logger.debug("trying to find one bootcamp", req.requestId);
    const bootCamp = await BootCamp.findById(req.params.id);

    if (!bootCamp) {
      logger.warn("no bootcamp found by id", req.requestId);
      return next(
        new Errorresponse(`no bootcamp found by this ${req.params.id}`, 404)
      );
    }

    if (bootCamp.user != req.user.id && req.user.role != "admin") {
      logger.warn("you are not allowed to update bootcamp", req.requestId);
      return next(new Errorresponse(`not alloed to update`, 400));
    }
    logger.debug("trying to update bootcamp", req.requestId);
    const updatedBootcamp = await BootCamp.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    logger.info("successfully updated bootcamp", req.requestId);
    return res.status(200).json({
      success: true,
      message: "Bootcamp updated successfully",
    });
  } catch (err) {
    logger.error("error occured while updating bootcamp", req.requestId);
    next(err);
  }
};

//@desc - delete bootcamp only by admin
//@route - /api/v1/bootcamps/:id
//@access - private
exports.deleteBootcamp = async (req, res, next) => {
  logger.debug(
    "entering into deleteBootcamp controller function",
    req.requestId
  );
  try {
    logger.debug("trying to find bootcamp by id", req.requestId);
    const bootCamp = await BootCamp.findById(req.params.id);

    if (!bootCamp) {
      logger.warn("no bootcamp found by id", req.requestId);
      return next(
        new Errorresponse(`no bootcamp found by this ${req.params.id}`, 404)
      );
    }

    if (bootCamp.user.toString() != req.user.id && req.user.role != "admin") {
      logger.warn("you are not allowed to delete", req.requestId);
      return next(new Errorresponse(`not alloed to delete`, 401));
    }
    logger.debug("trying to delete the bootcamp", req.requestId);
    await bootCamp.deleteOne();
    logger.info("successfully deleted bootcamp", req.requestId);
    return res.status(200).json({
      success: true,
      message: "Bootcamp deleted successfully",
    });
  } catch (err) {
    logger.debug("error occured while deleting bootcamp", req.requestId);
    next(err);
  }
};
