const User = require('../models/User');
const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");


//@desc - register a user
//@route - api/v1/auth/register
//@access - public
exports.register = async function (req, res, next) {
    try {
        const { name, email, role, password } = req.body;
        if (!['user'].includes(role)) {
            return res.status(400).json({
                "success": false,
                "message": "not allowed to register",
            })
        }
        const user = await User.create({ name, email, role, password })
        sendToken(user, 201, "user created successfully", res)
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
            next(new ErrorResponse("no user founded", 404));
        }

        const isMatch = await user.matchPassword(password)

        if (!isMatch) {
            next(new ErrorResponse("invalid password", 400));
        }

        sendToken(user, 201, "user login successfully", res)

    } catch (err) {
        next(err)
    }

}

//@desc - get me 
//@route - api/v1/auth/me
//@access - public
exports.getMe = async function (req, res, next) {
    try {
        const id=req.user.id
               
        const user=await User.findById(id);
        if(!user){
            res.status(404).json({
                success:false,
                message:"no user found"
            })
        }


        return res.status(200).json({
            "success": true,
            "user":user
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

        //naresh.kakarla@gmail.com
        //anil.sa@gmail.com

        const user = await User.findOne({ email: req.body.email });

        // two factor authentication or send token to the perticular email

        if (!user) {
            next(new ErrorResponse(`user not found with the email ${req.body.email}`), 404);
        }
        //get reset token
        const resetToken = user.generateResetPasswordToken();

        //save the user
        await user.save();

        //create reset url
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of password. 
        if you have requested the reset password please click below link to generate new password: \n\n ${resetUrl}`;

        // return res.status(200).json({
        //     "success": true,
        //     "message": message,
        //     " reseturl": resetUrl
        // })

        await sendEmail({ gmail: user.email, subject: "password reset token", text: message })
        res.status(200).json({
            success: true,
            "message": message,

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
        const newPassword = req.body.newPassword;
        const resetToken = req.params.resetToken
        if (!newPassword) {
            return res.status(400).json({
                success: false,
                error: "New password is required"
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
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
            message: "Password reset successfully"

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
        const id = req.user.id
        const { name, email } = req.body
        const updatedUser = await User.findByIdAndUpdate(id, { name, email }, {
            new: true,
            runValidators: true
        })
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
        const id = req.user.id
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
        res.cookie("token",null,{
            httpOnly:true,
            expires: new Date(Date.now())
        })
        return res.status(200).json({
            "success": true,
            message:"logout successfully"
        })
    } catch (err) {
        next(err)
    }

}



sendToken = async (user, statusCode, message, res) => {
    const token = await user.getJwtToken()
    const options = {
        secure: true,
        expires: new Date(Date.now() + 10 * 60 * 1000),
        httpOnly: true
    }
    return res.status(statusCode).cookie("token", token, options).json({
        "success": true,
        "message": message,

    })
}