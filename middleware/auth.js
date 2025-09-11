const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");


// protect routes
exports.protect = async(request, response, next) => {
    let token;
    
    if(req.headers.authorization && req.headers.authorization.startsWith("")){
        // set token from the bearer token from header
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        return next(new ErrorResponse("User Unauthorized to access this endpoint", 401));
    }

    // verify the token
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        request.user = await User.findById(decodedToken.id);
        next();
    }catch(error){
        return next(new ErrorResponse("not authorized to access this route", 401));
    }

}


//grant access to specific roles
exports.authorize = async (...roles)=>{

    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`user role ${req.user.role} is not authorized to access this endpoint`, 403));
        }
        next();

    }
    
}