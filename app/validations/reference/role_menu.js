const { body } = require("express-validator");
const {
  oracle: { db },
} = require("../../database");
const { Messages, MessageProvider } = require("../../../core");

exports.add = [
  body("roleId")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Role ID")
    )
    .bail()
    .isNumeric()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NUMERIC) +
        "|" +
        MessageProvider.message(Messages.KEYS.NUMERIC, "Role ID")
    )
    .bail()
    .isLength({ max: 5 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Role ID", 5)
    )
    .bail()
    .custom(async (val) => {
      let found;

      found = (await db.reference.role.exists(val)) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Role")
        );
      }

      return true;
    }),
  body("menu").custom(async (val) => {
    let found;

    if (!val || (Array.isArray(val) && val.length == 0)) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
          "|" +
          MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Menu")
      );
    }
    try {
      if (Array.isArray(val)) {
        val.forEach(async (v) => {
          if (isNaN(v)) {
            throw new Error("1");
          }
          if (v.toString().length > 5) {
            throw new Error("2");
          }
          found = (await db.reference.menu.exists(v)) == 1;
          if (!found) {
            throw new Error("3");
          }
        });
      } else {
        if (isNaN(val)) {
          throw new Error("1");
        }
        if (val.toString().length > 5) {
          throw new Error("2");
        }
        found = (await db.reference.menu.exists(val)) == 1;
        if (!found) {
          throw new Error("3");
        }
      }
    } catch (e) {
      switch (e.message) {
        case "1":
          throw new Error(
            MessageProvider.status(Messages.KEYS.NUMERIC) +
              "|" +
              MessageProvider.message(Messages.KEYS.NUMERIC, "Menu ID")
          );
        case "2":
          throw new Error(
            MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
              "|" +
              MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Menu ID", 5)
          );
        case "3":
          throw new Error(
            MessageProvider.status(Messages.KEYS.NOT_FOUND) +
              "|" +
              MessageProvider.message(Messages.KEYS.NOT_FOUND, "Menu")
          );
      }
    }

    return true;
  }),
  body("entry")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Entry")
    )
    .bail()
    .isLength({ max: 6 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Entry", 6)
    ),
];

exports.delete = [
  body("roleId")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Role ID")
    )
    .bail()
    .isNumeric()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NUMERIC) +
        "|" +
        MessageProvider.message(Messages.KEYS.NUMERIC, "Role ID")
    )
    .bail()
    .isLength({ max: 5 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Role ID", 5)
    )
    .bail()
    .custom(async (val, { req }) => {
      let found;

      found = (await db.reference.role.exists(val)) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Role")
        );
      }

      found = (await db.reference.role_menu.exists(val, req.body.menuId)) >= 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Role Menu")
        );
      }

      return true;
    }),
  body("menuId")
    .optional()
    .isNumeric()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NUMERIC) +
        "|" +
        MessageProvider.message(Messages.KEYS.NUMERIC, "Menu ID")
    )
    .bail()
    .isLength({ max: 5 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Menu ID", 5)
    )
    .bail()
    .custom(async (val) => {
      let found;

      found = (await db.reference.menu.exists(val)) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Menu")
        );
      }

      found = (await db.reference.role_menu.exists(req.body.nik, val)) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Role Menu")
        );
      }

      return true;
    }),
];
