const express = require("express");
const {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword,
    logout
} = require("../controllers/auth")
const { route } = require("./bootcamps");

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.get("/me", getMe);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword", resetPassword);
router.put("/updateDetails", updateDetails);
router.put("/updatePassword", updatePassword);
router.get("/logout", logout);


module.exports = router;
