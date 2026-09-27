const express = require("express");
const router =
  express.Router();
const {
  loginAdmin,
  getMe,
  updateCredentials,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const {
  protect,
} = require("../middleware/authMiddleware");

router.post(
  "/login",
  loginAdmin,
);
router.post(
  "/forgotpassword",
  forgotPassword,
);
router.put(
  "/resetpassword/:token",
  resetPassword,
);

// Protected Routes
router.get(
  "/me",
  protect,
  getMe,
);
router.put(
  "/credentials",
  protect,
  updateCredentials,
);

module.exports =
  router;
