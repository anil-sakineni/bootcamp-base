const User = require("../models/User")

exports.createUser = async (req, res, next) => {
    // hash passowrd and modify in the req.body
    const user = await User.create(req.body)
    res.status(200).json({
        "success": true,
        "message": "user created successfully",
        "user": user
    })

}

exports.getUsers = async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        "succes": true,
        "message": "found all users",
        "users": users
    })

}

exports.getUser = async (req, res, next) => {
    const user = await User.findById(req.params.id)
    res.status(200).json({
        "message": "User found",
        "User": user
    })
}

exports.updateUser = async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json({
        "message": "user updatted",
        "User": user
    })
}

exports.deleteUser = async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id)
    res.status(200).json({
        "message": "user deleted successfully",
        "User": user
    })
}