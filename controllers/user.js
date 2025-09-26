const User = require("../models/User");
const Errorresponse = require("../utils/errorResponse");
const logger = require("../utils/logger");

//@desc - create a user
//@route - /api/v1/user/?createUser
//@access - public
exports.createUser = async (req, res, next) => {
  logger.debug(
    "passowrd updated successfully and saving the user in database",
    req.requestId
  );
  try {
    logger.debug("trying to create user", req.requestId);
    const user = await User.create(req.body);
    logger.info("user created successfully", req.requestId);
    res.status(200).json({
      success: true,
      message: "user created successfully",
      user: user,
    });
  } catch (err) {
    logger.error("error occured while creating user", req.requestId);
    next(err);
  }
};

//@desc - get users
//@route - /api/v1/user/?getUsers
//@access - public
exports.getUsers = async (req, res, next) => {
  logger.debug("entering into getusers controller function", req.requestId);
  try {
    logger.debug("trying to find users in database", req.requestId);
    const users = await User.find();
    logger.info("users find success", req.requestId);
    res.status(200).json({
      succes: true,
      message: "found all users",
      users: users,
    });
  } catch (err) {
    logger.error("error occured while geting users", req.requestId);
    next(err);
  }
};

//@desc - get user by id
//@route - /api/v1/user/:id
//@access - public
exports.getUser = async (req, res, next) => {
  logger.debug("entering into getUser controller function", req.requestId);
  try {
    logger.debug("trying to find one user by id ", req.requestId);
    const user = await User.findById(req.params.id);
    logger.info("successfully found user by id", req.requestId);
    res.status(200).json({
      succes: true,
      message: "User found",
      User: user,
    });
  } catch (err) {
    logger.error("error occured while finding user", req.requestId);
    next(err);
  }
};

//@desc - update user by id
//@route - /api/v1/user/:id
//@access - public
exports.updateUser = async (req, res, next) => {
  logger.debug("entering into updateUser controller function", req.requestId);
  try {
    logger.debug(
      "trying to find one user and respective body to update",
      req.requestId
    );
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    logger.info("user updated successfully", req.requestId);
    res.status(200).json({
      succes: true,
      message: "user updated",
      User: user,
    });
  } catch (err) {
    logger.error("error occured while updating user", req.requestId);
    next(err);
  }
};

//@desc - delete user by id
//@route - /api/v1/user/:id
//@access - public
exports.deleteUser = async (req, res, next) => {
  logger.debug("entering into deleteUser controller funcction", req.requestId);
  try {
    logger.debug("trying to find one user id for delete", req.requestId);
    const user = await User.findByIdAndDelete(req.params.id);
    logger.info("user deleted successfully", req.requestId);
    res.status(200).json({
      succes: true,
      message: "user deleted successfully",
      User: user,
    });
  } catch (err) {
    logger.error("error occured while deleting user", req.requestId);
    next(err);
  }
};
