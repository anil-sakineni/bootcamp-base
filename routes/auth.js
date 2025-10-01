const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:resetToken", resetPassword);
router.put("/updateDetails", protect, updateDetails);
router.put("/updatePassword", protect, updatePassword);
router.get("/logout", protect, logout);

module.exports = router;
