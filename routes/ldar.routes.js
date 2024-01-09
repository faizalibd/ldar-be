const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const { validate } = require("../core/middlewares/validator");
const { parse, entry } = require("../core/middlewares/jsonParser");
const { transaction: controller } = require("../app/controllers");
const { transaction: validation } = require("../app/validations");

router.get("/approval", controller.ldar.approval.get);
router.get("/approval/:id", controller.ldar.approval.get);
router.get(
  "/approval/:id/download",
  validate(validation.ldar.approval.download),
  controller.ldar.approval.download
);
router.put(
  "/approval",
  upload.single("file"),
  validate(validation.ldar.approval.update),
  entry("update"),
  controller.ldar.approval.update
);
router.delete(
  "/approval",
  validate(validation.ldar.approval.delete),
  controller.ldar.approval.delete
);

router.get("/file", controller.ldar.file.get);
router.get("/file/:id", controller.ldar.file.get);
router.get(
  "/file/:id/download",
  validate(validation.ldar.file.download),
  controller.ldar.file.download
);
router.post(
  "/file",
  upload.single("file"),
  validate(validation.ldar.file.add),
  entry("insert"),
  controller.ldar.file.add
);
router.put(
  "/file",
  upload.single("file"),
  validate(validation.ldar.file.update),
  entry("update"),
  controller.ldar.file.update
);
router.delete(
  "/file",
  validate(validation.ldar.file.delete),
  controller.ldar.file.delete
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
  upload.single("file"),
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
  "/pe/manhour",
  validate(validation.ldar.update_pe_manhour),
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
