const express = require("express");
const {
  createNewUser,
  getAllUsers,
  loginUser,
  logoutUser,
} = require("../../controllers/user/index.controller.js");
const { checkAuth } = require("../../middlewares/auth.middleware.js");
const router = express.Router();

router.route("/").get(checkAuth, getAllUsers);
router.route("/signup").post(createNewUser);

router.route("/login").post(loginUser);

router.route("/logout").post(checkAuth, logoutUser);

module.exports = router;
