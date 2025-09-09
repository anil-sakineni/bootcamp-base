const BootCamp = require("../models/BootCamp");
const asyncHandler = require("../utils/asyncHandler");

exports.getBootcamps = async (req, res, next) => {
    // take the request

    // intiate service call

    //send the response
    return res.status(200).json({ success: true });

}
exports.createBootCamp = async (req, res, next) => {
    try {
        const bootCamp = await BootCamp.create(req.body);
        return res.status(201).json(
            {
                success: true,
                data: bootCamp
            }
        );
    } catch (error) {
        console.log("Error occured while creating boot camp", error);
        next(error);

    }
}



exports.getBootcamp = async (req, res, next) => {
    try {
        return res.status(200).json({
            "success": true
        })
    } catch (err) {
        next(err)
    }

}

exports.updateBootCamp = async (req, res, next) => {
    try {
        return res.status(200).json({
            "success": true
        })
    } catch (err) {
        next(err)
    }

}

exports.deleteBootcamp = async (req, res, next) => {
    try {
        return res.status(200).json({
            "success": true
        })
    } catch (err) {
        next(err)
    }

}
