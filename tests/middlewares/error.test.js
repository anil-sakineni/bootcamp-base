const errorHandler = require("../../middleware/error");
const ErrorResponse = require("../../utils/errorResponse");


describe("error midlleware", () => {
    let req, res, next;
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()

        };
        next = jest.fn();

    })

    it("should handle cast error", () => {
        const err = { name: "CastError", value: "123" };
        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({
            succes: false,
            error: "Resource not found for id: 123"
        })
    })

    it("should hamdle duplicate error", () => {
        const err = { code: 11000 };
        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            succes: false,
            error: "Duplicate field value entered"
        })

    })

    it("should handle validation error", () => {
        let err = {
            name: "ValidationError",
            errors: {
                name: { message: "Please add a name" },
                email: { message: "Please add an email" }
            },
            message: "validation failed"

        }

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            succes: false,
            error: "Please add a name,Please add an email"
        })
    })

    it("should handle server error", () => {
        const err = { message: "server error" };

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            succes: false,
            error: "server error"
        })
    })
})