const express = require("express");
const router = express.Router();

var coreRouter = require("./core.routes");
var ldarRouter = require("./ldar.routes");
var sapRouter = require("./sap.routes");

router.use("/", coreRouter);
router.use("/ldar", ldarRouter);
router.use("/sap", sapRouter);

module.exports = router;
