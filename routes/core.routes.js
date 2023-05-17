var express = require("express");
var router = express.Router();
const { validate } = require("../core/middlewares/validator");
const { parse, entry } = require("../core/middlewares/jsonParser");
const { reference: controller } = require("../app/controllers");
const { reference: validation } = require("../app/validations");

router.get("/approval/type", controller.approval_type.get);
router.get("/approval/type/:id", controller.approval_type.get);
router.post(
  "/approval/type",
  validate(validation.approval_type.add),
  entry("insert"),
  controller.approval_type.add
);
router.put(
  "/approval/type",
  validate(validation.approval_type.update),
  entry("update"),
  controller.approval_type.update
);
router.delete(
  "/approval/type",
  validate(validation.approval_type.delete),
  controller.approval_type.delete
);

router.get("/user", controller.user_role.get);
router.get("/user/:nik", controller.user_role.get);
router.post(
  "/user",
  parse("role"),
  validate(validation.user_role.add),
  entry("insert"),
  controller.user_role.add
);
router.delete(
  "/user",
  validate(validation.user_role.delete),
  controller.user_role.delete
);

router.get("/role/menu", controller.role_menu.get);
router.get("/role/menu/:roleId", controller.role_menu.get);
router.post(
  "/role/menu",
  parse("menu"),
  validate(validation.role_menu.add),
  entry("insert"),
  controller.role_menu.add
);
router.delete(
  "/role/menu",
  validate(validation.role_menu.delete),
  controller.role_menu.delete
);

router.get("/role", controller.role.get);
router.get("/role/:id", controller.role.get);
router.post(
  "/role",
  validate(validation.role.add),
  entry("insert"),
  controller.role.add
);
router.put(
  "/role",
  validate(validation.role.update),
  entry("update"),
  controller.role.update
);
router.delete(
  "/role",
  validate(validation.role.delete),
  controller.role.delete
);

router.get("/menu", controller.menu.get);
router.get("/menu/:id", controller.menu.get);
router.post(
  "/menu",
  validate(validation.menu.add),
  entry("insert"),
  controller.menu.add
);
router.put(
  "/menu",
  validate(validation.menu.update),
  entry("update"),
  controller.menu.update
);
router.put(
  "/menu/status",
  validate(validation.menu.update),
  entry("update"),
  controller.menu.update
);
router.delete(
  "/menu",
  validate(validation.menu.delete),
  controller.menu.delete
);

module.exports = router;
