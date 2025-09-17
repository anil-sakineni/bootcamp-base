const { register } = require("../../controllers/auth");
const User = require("../../models/User");
const crypto = require("crypto");

jest.mock("../../models/User")
jest.mock("crypto")

describe("auth controller", () => {
    let req, res, next;
    beforeEach(() => {
        req = {
            body: {
                name: "Anil",
                email: "anilbabu@gmail.com",
                password: "Srinu@9.",
                role: "user"
            }
        }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn().mockReturnThis(),
        }
        next = jest.fn()
        jest.clearAllMocks()
    })

    it("should not allow if the role is invalid", async () => {
        req.body.role = "admin"

        await register(req, res, next)

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            "success": false,
            "message": "not allowed to register"
        })
    })

    it("should register user on success", async () => {
        const fakeUser = {
            name: "Anil",
            email: "anilbabu@gmail.com",
            password: "Srinu@9.",
            role: "user"
        }

        User.create.mockResolvedValue(fakeUser);

        await register(req, res, next);

        expect(User.create).toHaveBeenCalledWith({
            name: "Anil",
            email: "anilbabu@gmail.com",
            password: "Srinu@9.",
            role: "user"
        })
    })
})