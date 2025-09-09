const User = require('../models/User')

//@desc - register a user
//@route - api/v1/auth/register
//@access - public
exports.register = async function (req, res, next) {
    try {
        return res.status(200).json({
            "success": true
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
        return res.status(200).json({
            "success": true
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
        return res.status(200).json({
            "success": true
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
        return res.status(200).json({
            "success": true
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
        return res.status(200).json({
            "success": true
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
        return res.status(200).json({
            "success": true
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