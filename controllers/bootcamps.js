const BootCamp = require("../models/BootCamp");
const jwt = require("jsonwebtoken");
const Errorresponse = require("../utils/errorResponse");

//@desc - get bootcamps via user
//@route - /api/v1/bootcamps
//@access - public
exports.getBootcamps = async (req, res, next) => {

    try {

        const bootcamps = await BootCamp.find();

        return res.status(200).json({
            success: true,
            "bootcamp": bootcamps
        });
    } catch (err) {
        next(err)
    }

}

//@desc - create bootcamp via publiser or admin
//@route - /api/v1/bootcamps
//@access - private
exports.createBootCamp = async (req, res, next) => {
    try {

        // add user to request body
        req.body.user = req.user.id;

        // check of bootcamp
        const publishedBootcamp = await BootCamp.findOne({ user: req.user.id });

        // - publisher is allowed to create only one bootcamp
        // - admin is allowed to create multiple bootcamps
        if (publishedBootcamp && req.user.role != "admin") {

            return next(new Errorresponse(`the user with id ${req.user.id} already published a one boot camp`, 400));
        }


        const bootCamp = await BootCamp.create(req.body);

        return res.status(201).json(
            {
                success: true,
                message: "BootCamp crteated successfully",
                data: bootCamp
            }
        );
    } catch (error) {
        console.log("Error occured while creating boot camp", error);
        next(error);

    }
}

//@desc - get bootcamp for user
//@route - /api/v1/bootcamps/:id
//@access - public
exports.getBootcamp = async (req, res, next) => {
    try {

        const bootcamp = await BootCamp.findById(req.params.id)
        console.log("bootcamp", bootcamp);


        return res.status(200).json({
            "success": true,
            "message": `founded bootcamp by ${req.params.id}`,
            "bootcamp": bootcamp
        })
    } catch (err) {
        next(err)
    }

}

//@desc - update bootcamp via publiser or admin
//@route - /api/v1/bootcamps/:id
//@access - private
exports.updateBootCamp = async (req, res, next) => {
    try {

        const bootCamp = await BootCamp.findById(req.params.id);

        if (!bootCamp) {
            return next(new Errorresponse(`no bootcamp found by this ${req.params.id}`, 404));
        }

        if (bootCamp.user != req.user.id && req.user.role != "admin") {
            return next(new Errorresponse(`not alloed to update`, 400))

        }


        const updatedBootcamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedBootcamp) {
            return res.status(404).json({
                success: false,
                message: `bootcamp not found with id ${req.params.id}`
            });
        }
        return res.status(200).json({
            "success": true,
            "message": "Bootcamp updated successfully"
        })
    } catch (err) {
        next(err)
    }

}

//@desc - delete bootcamp only by admin
//@route - /api/v1/bootcamps/:id
//@access - private
exports.deleteBootcamp = async (req, res, next) => {
    try {


        const bootCamp = await BootCamp.findById(req.params.id);

        if (!bootCamp) {
            return next(new Errorresponse(`no bootcamp found by this ${req.params.id}`, 404));
        }

        if (bootCamp.user != req.user.id && req.user.role != "admin") {
            return next(new Errorresponse(`not alloed to delete`, 400))

        }

        await BootCamp.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            "success": true,
            "message": "Bootcamp deleted successfully"

        })
    } catch (err) {
        next(err)
    }

}
