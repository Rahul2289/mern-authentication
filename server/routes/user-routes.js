const express = require("express");

const router = express.Router();

const {
  SignUp,
  Login,
  verifyToken,
  getUser,
  refreshToken,
  Logout,
} = require("../controller/user-controller");

router.post("/signup", SignUp);
router.post("/login", Login);
router.get("/user", verifyToken, getUser);
router.get("/refresh", refreshToken, verifyToken, getUser);
router.post("/logout", verifyToken, Logout);
module.exports = router;
