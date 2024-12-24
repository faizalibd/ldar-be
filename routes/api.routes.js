const express = require("express");
const router = express.Router();

var coreRouter = require("./core.routes");
var ldarRouter = require("./ldar.routes");

router.use("/", coreRouter);
router.use("/ldar", ldarRouter);

module.exports = router;
