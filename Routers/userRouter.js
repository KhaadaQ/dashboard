const express = require("express");
const {
  login,
  register,
  getRefreshToken,
} = require("../Controllers/userController");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/refresh-token", getRefreshToken);

module.exports = router;
