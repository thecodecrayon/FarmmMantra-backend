const express = require("express");
const {
  listProducts,
  createNewProduct,
  listProductOptions,
  getProductById,
  getProductsByCategory,
} = require("../../controllers/product/index.controller.js");

const router = express.Router();

router.route("/").get(listProducts).post(createNewProduct);
router.route("/:id").get(getProductById);
router.route("/category/:id").get(getProductsByCategory);
router.route("/options").get(listProductOptions);

module.exports = router;
