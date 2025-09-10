const User = require('../models/User')
const { register, login, forgotPassword, resetPassword, updateDetails, updatePassword } = require('../services/auth')

//@desc - register a user
//@route - api/v1/auth/register
//@access - public
exports.register = async function (req, res, next) {
    try {
        const user = await register(req.body)
        return res.status(200).json({
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
        const loginUser = await login(email, password)
        return res.status(200).json({
            "success": true,
            "Message": "login success",
            "loginUser": loginUser
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
        const reseturl = await forgotPassword(email)
        
        return res.status(200).json({
            "success": true,
            "message": "reset link ",
            reseturl
        })
    } catch (err) {
        next(err)
    }
}

//@desc - reset password
//@route - api/v1/auth/resetPassword
//@access - public
exports.resetPassword = async function (req, res, next) {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ success: false, error: "New password is required" });
        }
        const reset = await resetPassword(token, newPassword);
        return res.status(200).json({
            "success": true,
            "message": "password reseted successfully",
            "reset": reset
        })
    } catch (err) {
        next(err)
    }
}

//@desc - update details
//@route - api/v1/auth/updateDetails
//@access - public
exports.updateDetails = async function (req, res, next) {

    try {
        const updatedUser = await updateDetails(req.params.id, req.body)
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
        if (!currentPassword && !newPassword) {
            return res.status(400).json({
                "success": false,
                "message": "curret and newpassword required"
            })
        }
        await updatePassword(req.params.id, currentPassword, newPassword)
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