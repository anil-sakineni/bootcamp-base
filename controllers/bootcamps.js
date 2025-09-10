const BootCamp = require("../models/BootCamp");
const jwt = require("jsonwebtoken");

//@desc - get bootcamps via user
//@route - /api/v1/bootcamps
//@access - public
exports.getBootcamps = async (req, res, next) => {

    try {

        const token = req.cookies.token || req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, error: "Not authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decoded;


        if (!["user", "publisher", "admin"].includes(role)) {
            return res.status(403).json({ success: false, error: " not allowed" });
        }

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
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, error: "Not authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decoded;


        if (!["publisher", "admin"].includes(role)) {
            return res.status(403).json({ success: false, error: " not allowed" });
        }

        const { name, description, phone, email, address } = req.body;
        const bootCamp = await BootCamp.create({ name, description, phone, email, address, user: id });
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

//@desc - get bootcamp for user
//@route - /api/v1/bootcamps/:id
//@access - public
exports.getBootcamp = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, error: "Not authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { role } = decoded;


        if (!["user", "publisher", "admin"].includes(role)) {
            return res.status(403).json({ success: false, error: " not allowed" });
        }

        const bootcamp = await BootCamp.findById(req.params.id)

        return res.status(200).json({
            "success": true,
            "message": `founded bootcamp by ${req.params.id}`,
            bootcamp
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

        const token = req.cookies.token || req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, error: "Not authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { role } = decoded;


        if (!["publisher", "admin"].includes(role)) {
            return res.status(403).json({ success: false, error: " not allowed" });
        }
        const bootcamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body)
        return res.status(200).json({
            "success": true,
            "message": "Bootcamp updated by admin or publisher",
            "updated": bootcamp
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
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, error: "Not authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { role } = decoded;

        if (!["admin"].includes(role)) {
            return res.status(403).json({ success: false, error: " not allowed" });
        }
        await BootCamp.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            "success": true,
            "message": "Bootcamp deleted by admin"

        })
    } catch (err) {
        next(err)
    }

}
