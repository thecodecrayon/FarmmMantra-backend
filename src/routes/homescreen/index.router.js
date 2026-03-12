const express = require("express");
const {
  getHomescreenData,
} = require("../../controllers/homescreen/index.controller.js");

const router = express.Router();

router.route("/").get(getHomescreenData);

module.exports = router;
