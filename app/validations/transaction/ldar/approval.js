const { body, check } = require("express-validator");
const {
  oracle: { db },
} = require("../../../database");
const { Messages, MessageProvider } = require("../../../../core");
const { api } = require("../../../api");

exports.add_de = [
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
    .custom(async (val, { req }) => {
      let found;

      found =
        (await db.transaction.ldar.exists(
          val,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "3"
        )) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(
              Messages.KEYS.NOT_FOUND,
              "LDAR with Status 3"
            )
        );
      }

      found = (await db.transaction.ldar.approval.exists("", val)) >= 1;
      if (found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.ALREADY_EXIST) +
            "|" +
            MessageProvider.message(
              Messages.KEYS.ALREADY_EXIST,
              "LDAR Approval"
            )
        );
      }

      return true;
    }),
  body("nik").custom(async (val, { req }) => {
    let valid = Array.isArray(val) && val.length > 0;
    if (!valid) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.MIN_ARRAY) +
          "|" +
          MessageProvider.message(Messages.KEYS.MIN_ARRAY, "NIK List", "1")
      );
    }

    let seen = new Set();
    valid = !val.some((d) => {
      return seen.size === seen.add(d).size;
    });
    if (!valid) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.ALREADY_EXIST) +
          "|" +
          "Duplicate NIK"
      );
    }

    valid = val.every((d) => {
      return d != null && d != undefined && d != "";
    });
    if (!valid) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
          "|" +
          MessageProvider.message(Messages.KEYS.NOT_EMPTY, "NIK")
      );
    }

    valid = val.every((d) => {
      return d.length <= 6;
    });
    if (!valid) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
          "|" +
          MessageProvider.message(Messages.KEYS.MAX_LENGTH, "NIK", 6)
      );
    }

    valid = await Promise.all(
      req.body.nik.map(async (d) => {
        return (
          (await api.info.employee.get(d)) &&
          (await db.reference.user_role.exists(d, "", "DE")) == 1
        );
      })
    ).then((arr) => arr.every((a) => a));
    if (!valid) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.NOT_FOUND) +
          "|" +
          MessageProvider.message(Messages.KEYS.NOT_FOUND, "Employee")
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
      let found;

      found = (await db.transaction.ldar.approval.exists(val, "", "0")) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "LDAR Approval")
        );
      }

      found =
        (await db.transaction.ldar.exists(
          (
            await db.transaction.ldar.approval.get(val)
          )[0].LDARId,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "4"
        )) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(
              Messages.KEYS.NOT_FOUND,
              "LDAR with Status 4"
            )
        );
      }

      return true;
    }),
  body("typeCode")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Approval Type Code")
    )
    .bail()
    .isNumeric()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NUMERIC) +
        "|" +
        MessageProvider.message(Messages.KEYS.NUMERIC, "Approval Type Code")
    )
    .bail()
    .isLength({ max: 5 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(
          Messages.KEYS.MAX_LENGTH,
          "Approval Type Code",
          5
        )
    )
    .bail()
    .custom(async (val, { req }) => {
      let found;

      found = val == 0 || val == "0";

      if (found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.UNPROCESSABLE_ENTITY) +
            "|" +
            MessageProvider.message(
              Messages.KEYS.UNPROCESSABLE_ENTITY,
              "Approval Type"
            )
        );
      }

      found = (await db.reference.approval_type.exists(val)) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Approval Type")
        );
      }

      return true;
    }),
  body("remark")
    .optional()
    .isLength({ max: 1000 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Remark", 1000)
    ),
  check("file").custom(async (val, { req }) => {
    let valid = false;
    valid = !req.file || req.file.originalname.length <= 250;
    if (!valid) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
          "|" +
          MessageProvider.message(Messages.KEYS.MAX_LENGTH, "File", 250)
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
      let found =
        (await db.transaction.ldar.approval.exists(val, "", "0")) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(
              Messages.KEYS.NOT_FOUND,
              "LDAR Approval with Approval Type 0"
            )
        );
      }

      return true;
    }),
];

exports.download = [
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
      let found;

      found = (await db.transaction.ldar.approval.exists(val)) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "LDAR Approval")
        );
      }

      found = await db.transaction.ldar.approval.download(val);
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(
              Messages.KEYS.NOT_FOUND,
              "LDAR Approval File"
            )
        );
      }

      return true;
    }),
];
