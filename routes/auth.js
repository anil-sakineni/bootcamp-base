const express = require("express");
const { route } = require("./bootcamps");

const router = express.Router();

route.post("/resgitser", register);
route.post("/login", login);
router.get("/me", getMe);
route.post("/forgotPassword", login);
route.put("/resetPassword", login);
route.put("/updateDetails", login);
route.put("/updatePassword", login);
route.get("/logout", login);


module.exports = router;
