const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");


// protect routes
exports.protect = async (request, response, next) => {
    let token;

    if (request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
        // set token from the bearer token from header
        token = request.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new ErrorResponse("User Unauthorized to access this endpoint", 401));
    }

    // verify the token
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        request.user = await User.findById(decodedToken.id);
        next();
    } catch (error) {
        return next(new ErrorResponse("not authorized to access this route", 401));
    }

}


//grant access to specific roles
exports.authorize = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`user role ${req.user.role} is not authorized to access this endpoint`, 403));
        }
        next();

    }

}