const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../../models/User");
const { authorize, protect } = require("../../middleware/auth");
const ErrorResponse = require("../../utils/errorResponse");

jest.mock("jsonwebtoken");
jest.mock("bcrypt");
jest.mock("crypto");
jest.mock("../../models/User");

describe("auth middleware", () => {
    let req, res, next, user;

    beforeEach(() => {
        req = { headers: {} };
        res = {};
        next = jest.fn();
        jest.clearAllMocks();

        user = new User({
            name: "anil",
            email: "anilbabu@gmail.com",
            password: "Srinu@9.",
            role: "admin"
        })
    })

    it("should return error if no token provided", async () => {
        await protect(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
        expect(next.mock.calls[0][0].statusCode).toBe(401)
    })

    it("should return error if token is invalid", async () => {
        req.headers.authorization = "Bearer token";
        jwt.verify.mockImplementation(() => {
            throw new Error("invalid token");
        });


        await protect(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
        expect(next.mock.calls[0][0].statusCode).toBe(401);
    })

    it("should return success if it is valid", async () => {
        req.headers.authorization = "Bearer token";
        jwt.verify.mockReturnValue({ id: "789" });
        User.findById.mockResolvedValue({ id: "789", role: "admin" });
        await protect(req, res, next);

        expect(User.findById).toHaveBeenCalledWith("789");
        expect(req.user).toEqual({ id: "789", role: "admin" });
        expect(next).toHaveBeenCalled();
    })

    it("should return error if role is not allowed", async () => {
        req.user = { role: "user" };
        const middlware = authorize("admin");
        middlware(req, res, next)
        expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse))
        expect(next.mock.calls[0][0].statusCode).toBe(403);

    })

    it("should return error if the role is allow", async () => {
        req.user = { role: "admin" }
        const middleware = authorize("admin")
        middleware(req, res, next);
        expect(next).toHaveBeenCalled()
    })
})

