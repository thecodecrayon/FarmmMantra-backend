const express = require("express");
const {
  createCategory,
  listCategories,
} = require("../../controllers/category/index.controller.js");

const router = express.Router();

router.route("/").post(createCategory).get(listCategories);

module.exports = router;
