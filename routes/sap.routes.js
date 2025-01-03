const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const { validate } = require("../core/middlewares/validator");
const { parse, entry } = require("../core/middlewares/jsonParser");
const { transaction: controller } = require("../app/controllers");
const { transaction: validation } = require("../app/validations");

router.get("/ref", controller.sap.get);

module.exports = router;
