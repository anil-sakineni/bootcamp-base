const User = require("../models/User");

//@desc - create a user
//@route - /api/v1/user/?createUser
//@access - public
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({
      success: true,
      message: "user created successfully",
      user: user,
    });
  } catch (err) {
    next(err);
  }
};

//@desc - get users
//@route - /api/v1/user/?getUsers
//@access - public
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      succes: true,
      message: "found all users",
      users: users,
    });
  } catch (err) {
    next(err);
  }
};

//@desc - get user by id
//@route - /api/v1/user/:id
//@access - public
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      succes: true,
      message: "User found",
      User: user,
    });
  } catch (err) {
    next(err);
  }
};

//@desc - update user by id
//@route - /api/v1/user/:id
//@access - public
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      succes: true,
      message: "user updated",
      User: user,
    });
  } catch (err) {
    next(err);
  }
};

//@desc - delete user by id
//@route - /api/v1/user/:id
//@access - public
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      succes: true,
      message: "user deleted successfully",
      User: user,
    });
  } catch (err) {
    next(err);
  }
};
