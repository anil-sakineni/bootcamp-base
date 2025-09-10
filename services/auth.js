const User = require('../models/User');
const crypto = require("crypto");

exports.register = async function (body) {
    return await User.create(body)
}

exports.login = async function (email, password) {
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
        throw new Error("invalid user deatils")
    }


    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
        throw new Error("invalid password")
    }
    return { user: { id: user.id, email: user.email, role: user.role } }
}

exports.forgotPassword = async function (email) {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error(" user not found ")
    }

    const resetToken = user.generateResetPasswordToken()
       await user.save()

    const resetUrl = `http://localhost:3000/api/v1/auth/resetPassword/${resetToken}`;
       return resetUrl;
}


exports.resetPassword = async function (token, newPassword) {

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        throw new Error("Invalid or expired reset token");
    }

    if (!newPassword) {
        throw new Error("New password is required");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return true;
};

exports.updateDetails = async function (userId, body) {

    return await User.findByIdAndUpdate(userId, body)

}

exports.updatePassword = async function (userId, currentPassword, newPassword) {

    const user = await User.findById(userId).select("+password");

    if (!user) {
        throw new Error("user not found")    }

    const isMatch = await user.matchPassword(currentPassword)

    if (!isMatch) {
        throw new Error("current password not matcheed")
    }

    user.password = newPassword;
    await user.save()
    return true;

}