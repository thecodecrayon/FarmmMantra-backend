const express = require("express");
const userRouter = require("./user/index.router.js");
const categoryRouter = require("./category/index.router.js");
const artisanRouter = require("./artisan/index.router.js");
const productRouter = require("./product/index.router.js");
const viewRouter = require("./view/index.router.js");
const homescreenRouter = require("./homescreen/index.router.js");
const inquiryRouter = require("./inquiry/index.router.js");

const router = express.Router();

router.use("/user", userRouter);
router.use("/category", categoryRouter);
router.use("/artisan", artisanRouter);
router.use("/product", productRouter);
router.use("/view", viewRouter);
router.use("/homescreen", homescreenRouter);
router.use("/inquiry", inquiryRouter);

module.exports = router;
