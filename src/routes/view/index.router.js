const express = require("express");

const {
  getViewsByProduct,
  addViewsByProduct,
  getOverallViews,
} = require("../../controllers/view/index.controller.js");

const router = express.Router();

router.route("/").get(getOverallViews);
router.route("/:productId").get(getViewsByProduct).post(addViewsByProduct);

module.exports = router;
