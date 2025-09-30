const express = require("express");

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const User = require("../models/User");
const advancedResults=require("../middleware/advancedResults");

const router = express.Router();

router.route("/").get(advancedResults(User, ""),getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
