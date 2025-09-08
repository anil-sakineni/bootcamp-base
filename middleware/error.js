const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (err, request, response, next) => {

    let error = {...err};

    error.message = err.message;

    if(err.name === "CastError"){
        const message = `Resource not found for id: ${err.value}`;
        error = new ErrorResponse(message, 404)
    }

    if(err.code === 11000){
        const message = "Duplicate field value entered";
        error = new ErrorResponse(message, 409);
    }

    if(err.name === "ValidationError"){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 409);
    }

    response.status(error.statusCode || 500).json({
        succes: false,
        error: error.message || "server error"
    });
}


module.exports = errorHandler;