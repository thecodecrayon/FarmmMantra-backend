const express = require("express");
const {
  createArtisan,
  listArtisans,
} = require("../../controllers/artisan/index.controller.js");

const router = express.Router();

router.route("/").post(createArtisan).get(listArtisans);

module.exports = router;
