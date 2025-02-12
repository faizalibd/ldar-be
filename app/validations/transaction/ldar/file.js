const { body, check, param } = require("express-validator");
const {
  oracle: { db },
} = require("../../../database");
const { Messages, MessageProvider } = require("../../../../core");

exports.add = [
  body("LDARId")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "LDAR ID")
    )
    .bail()
    .isNumeric()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NUMERIC) +
        "|" +
        MessageProvider.message(Messages.KEYS.NUMERIC, "LDAR ID")
    )
    .bail()
    .isLength({ max: 5 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "LDAR ID", 5)
    )
    .bail()
    .custom(async (val) => {
      let found;

      found = (await db.transaction.ldar.exists(val)) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "LDAR")
        );
      }

      return true;
    }),
  check("file").custom(async (val, { req }) => {
    let valid = false;

    valid = req.file;

    if (!valid) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
          "|" +
          MessageProvider.message(Messages.KEYS.NOT_EMPTY, "LDAR File")
      );
    }
    valid = req.file.originalname.length <= 80;
    if (!valid) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
          "|" +
          MessageProvider.message(Messages.KEYS.MAX_LENGTH, "LDAR File", 80)
      );
    }

    valid =
      (await db.transaction.ldar.file.exists(
        "",
        req.body.LDARId,
        req.file.originalname,
        req.body.groups
      )) == 0;
    if (!valid) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.ALREADY_EXIST) +
          "|" +
          MessageProvider.message(Messages.KEYS.ALREADY_EXIST, "LDAR File")
      );
    }

    return true;
  }),
  body("groups")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Groups")
    )
    .bail()
    .isNumeric()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NUMERIC) +
        "|" +
        MessageProvider.message(Messages.KEYS.NUMERIC, "Groups")
    )
    .bail()
    .isLength({ max: 1 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Groups", 1)
    ),
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

exports.update = [
  body("id")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "ID")
    )
    .bail()
    .isNumeric()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NUMERIC) +
        "|" +
        MessageProvider.message(Messages.KEYS.NUMERIC, "ID")
    )
    .bail()
    .isLength({ max: 5 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "ID", 5)
    )
    .bail()
    .custom(async (val) => {
      let found = (await db.transaction.ldar.file.exists(val)) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "LDAR File")
        );
      }

      return true;
    }),
  check("file").custom(async (val, { req }) => {
    let valid = false;
    let data = (await db.transaction.ldar.file.get(req.body.id))[0];

    valid = req.file;

    if (!valid) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
          "|" +
          MessageProvider.message(Messages.KEYS.NOT_EMPTY, "LDAR File")
      );
    }
    valid = req.file.originalname.length <= 80;
    if (!valid) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
          "|" +
          MessageProvider.message(Messages.KEYS.MAX_LENGTH, "LDAR File", 80)
      );
    }

    valid =
      (await db.transaction.ldar.file.exists(
        "",
        data.LDARId,
        req.file.originalname,
        data.groups,
        req.body.id
      )) == 0;
    if (!valid) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.ALREADY_EXIST) +
          "|" +
          MessageProvider.message(Messages.KEYS.ALREADY_EXIST, "LDAR File")
      );
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
  body("id")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "ID")
    )
    .bail()
    .isNumeric()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NUMERIC) +
        "|" +
        MessageProvider.message(Messages.KEYS.NUMERIC, "ID")
    )
    .bail()
    .isLength({ max: 5 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "ID", 5)
    )
    .bail()
    .custom(async (val) => {
      let found = (await db.transaction.ldar.file.exists(val)) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "LDAR File")
        );
      }

      return true;
    }),
];

exports.download = [
  param("id")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "ID")
    )
    .bail()
    .isNumeric()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NUMERIC) +
        "|" +
        MessageProvider.message(Messages.KEYS.NUMERIC, "ID")
    )
    .bail()
    .isLength({ max: 5 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "ID", 5)
    )
    .bail()
    .custom(async (val) => {
      let found;

      found = (await db.transaction.ldar.file.exists(val)) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "LDAR File")
        );
      }

      found = await db.transaction.ldar.file.download(val);
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "LDAR File")
        );
      }

      return true;
    }),
];
