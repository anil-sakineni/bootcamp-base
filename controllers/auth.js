const User = require("../models/User");
const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const logger = require("../utils/logger");

//@desc - register a user
//@route - api/v1/auth/register
//@access - public
exports.register = async function (req, res, next) {
  logger.debug("registering new user", req.requestId);
  try {
    logger.debug("req.body is reccieved", req.requestId);
    const { name, email, role, password } = req.body;
    if (!["user"].includes(role)) {
      logger.warn(
        "user is trying to register with invalid role",
        req.requestId
      );
      return res.status(400).json({
        success: false,
        message: "not allowed to register",
      });
    }
    logger.debug("user is allowed to register ", req.requestId);
    const user = await User.create({ name, email, role, password });
    logger.info("user registered successfully", req.requestId);
    logger.debug("sending token", req.requestId);
    sendToken(user, 201, "user created successfully", res);
  } catch (err) {
    logger.error("error occured during registeration", req.requestId);
    next(err);
  }
};

//@desc - login a user
//@route - api/v1/auth/login
//@access - public

exports.login = async function (req, res, next) {
  logger.debug("entering the login controller", req.requestId);
  try {
    logger.debug("req.body is received", req.requestId);
    const { email, password } = req.body;
    logger.debug("trying to find one user with email", req.requestId);
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      logger.debug("no user found by this email ", req.requestId);
      return next(new ErrorResponse("no user founded", 404));
    }
    logger.debug("trying to match password", req.requestId);
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      logger.warn("password is invalid", req.requestId);
      return next(new ErrorResponse("invalid password", 400));
    }
    logger.info("user login success", req.requestId);
    logger.debug("sending token", req.requestId);
    sendToken(user, 201, "user login successfully", res);
  } catch (err) {
    logger.error("error occured during login", req.requestId);
    next(err);
  }
};

//@desc - get me
//@route - api/v1/auth/me
//@access - public
exports.getMe = async function (req, res, next) {
  logger.debug("entering into getme controllor", req.requestId);
  try {
    logger.debug("trying to find user", req.requestId);
    const user = req.user;
    logger.info("user find success", req.requestId);
    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (err) {
    logger.error("error occured  while finding user", req.requestId);
    next(err);
  }
};

//@desc - forgot password
//@route - api/v1/auth/forgotPassword
//@access - public
exports.forgotPassword = async function (req, res, next) {
  logger.debug("entering into forgot password controller", req.requestId);
  try {
    logger.debug("trying to find one user through email", req.requestId);
    const user = await User.findOne({ email: req.body.email });

    // two factor authentication or send token to the perticular email

    if (!user) {
      logger.warn("no user found by this email", req.requestId);
      return next(
        new ErrorResponse(`user not found with the email ${req.body.email}`),
        404
      );
    }
    logger.info("user founded by email", req.requestId);
    logger.debug("generating reset password token", req.requestId);
    //get reset token
    const resetToken = user.generateResetPasswordToken();
    logger.debug("saving user in database", req.requestId);
    //save the user
    await user.save();
    logger.debug("generating reset url for reset password", req.requestId);
    //create reset url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetPassword/${resetToken}`;
    logger.info(
      "successfully generated url for reset password ",
      req.requestId
    );
    const message = `You are receiving this email because you (or someone else) has requested the reset of password. 
        if you have requested the reset password please click below link to generate new password: \n\n ${resetUrl}`;

    // return res.status(200).json({
    //     "success": true,
    //     "message": message,
    //     " reseturl": resetUrl
    // })
    logger.debug("sending reset password tokeken to the email", req.requestId);
    await sendEmail({
      gmail: user.email,
      subject: "password reset token",
      text: message,
    });
    logger.info("successfully sended the token to the email", req.requestId);
    res.status(200).json({
      success: true,
      message: message,
    });
  } catch (err) {
    logger.error(
      "error occured while generating the reset token on user forgoting password",
      req.requestId
    );
    next(err);
  }
};

//@desc - reset password
//@route - api/v1/auth/resetPassword
//@access - public

exports.resetPassword = async (req, res, next) => {
  logger.debug(
    "entering into reset password controller function",
    req.requestId
  );
  try {
    logger.debug("trying to create newpassword ", req.requestId);
    const newPassword = req.body.newPassword;
    const resetToken = req.params.resetToken;
    if (!newPassword) {
      logger.warn("newpassword is required", req.requestId);
      return res.status(400).json({
        success: false,
        error: "New password is required",
      });
    }

    logger.debug("gcreating one hashed token ", req.requestId);
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    logger.debug("trying to find user who forgets password", req.requestId);
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      logger.warn("Invalid or expired reset token", req.requestId);
      return res.status(400).json({
        success: false,
        error: "Invalid or expired reset token",
      });
    }
    logger.debug("attaching newpassword to the user.password", req.requestId);
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    logger.debug("saving password in database", req.requestId);
    await user.save();
    logger.info("successfully updated password", req.requestId);
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    logger.error("error occoured while updating password", req.requestId);
    next(err);
  }
};

//@desc - update details
//@route - api/v1/auth/updateDetails
//@access - public
exports.updateDetails = async function (req, res, next) {
  logger.debug(
    "entering into update details controller function",
    req.requestId
  );
  try {
    logger.debug("trying to find one user id", req.requestId);
    const id = req.user.id;
    logger.debug("user trying to update details", req.requestId);
    const { name, email } = req.body;
    logger.debug("updating user by id", req.requestId);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      {
        new: true,
        runValidators: true,
      }
    );
    logger.info("user successfully updated", req.requestId);
    return res.status(200).json({
      success: true,
      message: "user updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    logger.error("error occured while upadating details", req.requestId);
    next(err);
  }
};

//@desc - update password
//@route - api/v1/auth/updatePassword
//@access - public
exports.updatePassword = async function (req, res, next) {
  logger.debug(
    "entering into update password controller function",
    req.requestId
  );
  try {
    logger.debug(
      "trying to find currentpassword and newpassword",
      req.requestId
    );
    const { currentPassword, newPassword } = req.body;
    logger.debug("trying to find one user", req.requestId);
    const id = req.user.id;
    if (!currentPassword && !newPassword) {
      logger.warn("current and newPassword is required", req.requestId);
      return res.status(400).json({
        success: false,
        message: "curret and newpassword required",
      });
    }
    logger.debug("trying to find one user by id ", req.requestId);
    const user = await User.findById(id).select("+password");

    if (!user) {
      logger.warn("no user is founded", req.requestId);
      return next(new ErrorResponse("no user found", 404));
    }
    logger.debug("trying to match password", req.requestId);
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      logger.warn("current password is not matched", req.requestId);
      throw new Error("current password not matcheed");
    }
    logger.debug("attaching new password to user.passoword", req.requestId);
    user.password = newPassword;
    logger.debug("trying to save user in database", req.requestId);

    await user.save();
    logger.info(
      "passowrd updated successfully and saving the user in database",
      req.requestId
    );
    return res.status(200).json({
      success: true,
      message: "password updated successfully",
    });
  } catch (err) {
    logger.error("error occured while updating the password", req.requestId);
    next(err);
  }
};

//@desc - logout user
//@route - api/v1/auth/logout
//@access - public
exports.logout = async function (req, res, next) {
  logger.debug("entering into logout controller function", req.requestId);
  try {
    logger.debug("trying to make the cookie null and expire", req.requestId);
    res.cookie("token", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    logger.info("user logout successfully", req.requestId);
    return res.status(200).json({
      success: true,
      message: "logout successfully",
    });
  } catch (err) {
    logger.error("error occured during logout", req.requestId);
    next(err);
  }
};

sendToken = async (user, statusCode, message, res) => {
  const token = await user.getJwtToken();
  const options = {
    secure: true,
    expires: new Date(Date.now() + 10 * 60 * 1000),
    httpOnly: true,
  };
  return res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message: message,
  });
};
