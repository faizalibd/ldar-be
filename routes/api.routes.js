const express = require("express");
const router = express.Router();


var coreRouter = require("./core.routes");

router.use("/", coreRouter);

module.exports = router;
