var express = require("express");
var router = express.Router();
const { validate } = require("../core/middlewares/validator");
const { parse, entry } = require("../core/middlewares/jsonParser");
const { transaction: controller } = require("../app/controllers");
const { transaction: validation } = require("../app/validations");

router.get("/approval", controller.ldar.approval.get);
router.get("/approval/:id", controller.ldar.approval.get);
router.post(
  "/approval",
  validate(validation.ldar.approval.add),
  entry("insert"),
  controller.ldar.approval.add
);
router.put(
  "/approval",
  validate(validation.ldar.approval.update),
  entry("update"),
  controller.ldar.approval.update
);
router.delete(
  "/approval",
  validate(validation.ldar.approval.delete),
  controller.ldar.approval.delete
);

router.get("/", controller.ldar.get);
router.get("/:id", controller.ldar.get);
router.post(
  "/",
  validate(validation.ldar.add),
  entry("insert"),
  controller.ldar.add
);
router.put(
  "/status",
  validate(validation.ldar.update_status),
  entry("update"),
  controller.ldar.update
);
router.put(
  "/pe/accepted",
  validate(validation.ldar.update_pe_accepted),
  entry("update"),
  controller.ldar.update
);
router.put(
  "/pe",
  validate(validation.ldar.update_pe),
  entry("update"),
  controller.ldar.update
);
router.put(
  "/edm",
  validate(validation.ldar.update_edm),
  entry("update"),
  controller.ldar.update
);
router.put(
  "/",
  validate(validation.ldar.update),
  entry("update"),
  controller.ldar.update
);
router.delete("/", validate(validation.ldar.delete), controller.ldar.delete);

module.exports = router;
