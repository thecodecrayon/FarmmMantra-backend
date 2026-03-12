const express = require("express");
const {
  createNewInquiry,
  listInquiries,
} = require("../../controllers/inquiry/index.controller.js");

const router = express.Router();

router.route("/").get(listInquiries).post(createNewInquiry);
// router.route("/:id").get(getInquiryById);

module.exports = router;
