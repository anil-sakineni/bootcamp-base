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
const { protect } = require("../middleware/auth")

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.get("/me", getMe);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.put("/updateDetails/:id", updateDetails);
router.put("/updatePassword/:id", updatePassword);
router.get("/logout", logout);


module.exports = router;
