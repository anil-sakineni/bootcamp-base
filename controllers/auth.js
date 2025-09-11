const User = require('../models/User');
const crypto = require("crypto");


//@desc - register a user
//@route - api/v1/auth/register
//@access - public
exports.register = async function (req, res, next) {
    try {
        const { name, email, role, password } = req.body;
        if (!['user', 'publisher'].includes(role)) {
            return res.status(400).json({
                "success": false,
                "message": "not allowed to register",
            })
        }
        const user = await User.create({ name, email, role, password })
        const token = await user.getJwtToken()
        const options = {
            secure: true,
            expires: new Date(Date.now() + 10 * 60 * 1000),
            httpOnly: true
        }
        return res.status(200).cookie("token", token, options).json({
            "success": true,
            "message": "User created successfully",
            "User": user
        })
    } catch (err) {
        next(err)
    }
}

//@desc - login a user
//@route - api/v1/auth/login
//@access - public

exports.login = async function (req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            throw new Error("invalid user deatils")
        }

        const isMatch = await user.matchPassword(password)

        if (!isMatch) {
            throw new Error("invalid password")
        }

        const token = await user.getJwtToken();

        const options = {
            secure: true,
            expires: new Date(Date.now() + 10 * 60 * 1000),
            httpOnly: true
        }

        return res.status(200).cookie("token", token, options).json({
            "success": true,
            "Message": "login success",
            "loginUser": user
        })
    } catch (err) {
        next(err)
    }

}

//@desc - get me 
//@route - api/v1/auth/me
//@access - public
exports.getMe = async function (req, res, next) {
    try {
        return res.status(200).json({
            "success": true
        })

    } catch (err) {
        next(err)
    }
}

//@desc - forgot password
//@route - api/v1/auth/forgotPassword
//@access - public
exports.forgotPassword = async function (req, res, next) {
    try {

        const { email } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            throw new Error(" user not found ")
        }

        const resetToken = user.generateResetPasswordToken()
        await user.save()

        const resetUrl = `http://localhost:3000/api/v1/auth/resetPassword/${resetToken}`;


        return res.status(200).json({
            "success": true,
            "message": "reset link ",
            " reseturl": resetUrl
        })
    } catch (err) {
        next(err)
    }
}

//@desc - reset password
//@route - api/v1/auth/resetPassword
//@access - public

exports.resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({
                success: false,
                error: "New password is required"
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "Invalid or expired reset token"
            });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully", user

        });

    } catch (err) {
        next(err);
    }
};

//@desc - update details
//@route - api/v1/auth/updateDetails
//@access - public
exports.updateDetails = async function (req, res, next) {

    try {
        const id = req.params.id
        const { name, email } = req.body
        const updatedUser = await User.findByIdAndUpdate(id, { name, email })
        return res.status(200).json({
            "success": true,
            "message": "user updated successfully",
            "user": updatedUser
        })
    } catch (err) {
        next(err)
    }

}

//@desc - update password
//@route - api/v1/auth/updatePassword
//@access - public
exports.updatePassword = async function (req, res, next) {

    try {
        const { currentPassword, newPassword } = req.body;
        const id = req.params.id
        if (!currentPassword && !newPassword) {
            return res.status(400).json({
                "success": false,
                "message": "curret and newpassword required"
            })
        }
        const user = await User.findById(id).select("+password");

        if (!user) {
            throw new Error("user not found")
        }

        const isMatch = await user.matchPassword(currentPassword)

        if (!isMatch) {
            throw new Error("current password not matcheed")
        }

        user.password = newPassword;
        await user.save()
        return res.status(200).json({
            "success": true,
            "message": "password updated successfully"

        })
    } catch (err) {
        next(err)
    }

}

//@desc - logout user
//@route - api/v1/auth/logout
//@access - public
exports.logout = async function (req, res, next) {

    try {
        return res.status(200).json({
            "success": true
        })
    } catch (err) {
        next(err)
    }

}