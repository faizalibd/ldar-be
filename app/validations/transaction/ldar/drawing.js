const { body, check } = require("express-validator");
const {
  oracle: { db },
} = require("../../../database");
const { Messages, MessageProvider } = require("../../../../core");
const { api } = require("../../../api");
const { log } = require("../../../../core/logger/orm_logger");
const apiValidation = process.env.API_VALIDATION === "TRUE";

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
      // found = (await db.transaction.ldar.approval.exists(val, "", "0")) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "LDAR")
        );
      }

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
  body("idDrawingSheet").custom(async (val, { req }) => {
    let found;

    if (!req.body.drawingNumber && !val) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
          "|" +
          MessageProvider.message(
            Messages.KEYS.NOT_EMPTY,
            "Drawing Sheet & Drawing Number"
          )
      );
    } else if (val && req.body.drawingNumber) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.UNPROCESSABLE_ENTITY) +
          "|Do not enter the Drawing Sheet id and Drawing Number together "
      );
    }

    if (val) {
      found =
        !apiValidation ||
        (await api.siedm.sheet.get(req.headers.authorization, val));
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Drawing Sheet")
        );
      }

      found = await db.transaction.ldar.drawing.exists(
        "",
        req.body.LDARId,
        val
      );
      if (found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.ALREADY_EXIST) +
            "|" +
            MessageProvider.message(Messages.KEYS.ALREADY_EXIST, "Drawing")
        );
      }
    }
    return true;
  }),
  body("drawingNumber").custom(async (val, { req }) => {
    let found;
    if (val) {
      if (val.length > 50) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
            "|" +
            MessageProvider.message(
              Messages.KEYS.MAX_LENGTH,
              "Drawing Number",
              50
            )
        );
      }
    }

    return true;
  }),
  body("adcn").custom(async (val, { req }) => {
    let found;

    if (req.body.drawingNumber) {
      if (!val) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_EMPTY, "ADCN/DCN")
        );
      }

      if (val.length > 5) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
            "|" +
            MessageProvider.message(Messages.KEYS.MAX_LENGTH, "ADCN/DCN", 5)
        );
      }

      found =
        !apiValidation ||
        (await api.siedm.drawing.get(
          req.headers.authorization,
          "",
          req.body.drawingNumber,
          "",
          "",
          "",
          val
        ));
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Drawing Number")
        );
      }

      found = await db.transaction.ldar.drawing.exists(
        "",
        req.body.LDARId,
        null,
        req.body.drawingNumber,
        val
      );
      if (found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.ALREADY_EXIST) +
            "|" +
            MessageProvider.message(Messages.KEYS.ALREADY_EXIST, "Drawing")
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
    )
    .bail()
    .custom(async (val) => {
      let found = await api.info.employee.get(val);
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Employee")
        );
      }

      return true;
    }),
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

      found = (await db.transaction.ldar.drawing.exists(val)) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "LDAR Drawing")
        );
      }

      found =
        (await db.transaction.ldar.exists(
          (
            await db.transaction.ldar.drawing.get(val)
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
  body("adcn")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "ADCN / DCN")
    )
    .bail()
    .isLength({ max: 5 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "ADCN / DCN", 5)
    ),
  body("drawingNumber")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Drawing Number")
    )
    .bail()
    .isLength({ max: 40 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Drawing Number", 40)
    )
    .bail()
    .custom(async (val, { req }) => {
      let found;
      let adcn = req.body.adcn;

      found =
        !apiValidation ||
        (await api.siedm.drawing.get(
          req.headers.authorization,
          null,
          val,
          null,
          null,
          null,
          adcn
        ));
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Drawing Number")
        );
      }

      found =
        (await db.transaction.ldar.drawing.exists(
          "",
          (
            await db.transaction.ldar.drawing.get(req.body.id)
          )[0].LDARId,
          val,
          "",
          "",
          req.body.id
        )) == 1;
      if (found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.ALREADY_EXIST) +
            "|" +
            MessageProvider.message(
              Messages.KEYS.ALREADY_EXIST,
              "Drawing Number with this LDAR"
            )
        );
      }
      return true;
    }),
  body("drawingSheet")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Drawing Sheet")
    )
    .bail()
    .isLength({ max: 3 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Drawing Sheet", 3)
    )
    .bail()
    .custom(async (val, { req }) => {
      let found;
      let drawingNumber = req.body.drawingNumber;

      found =
        !apiValidation ||
        (await api.siedm.sheet.get(
          req.headers.authorization,
          null,
          null,
          val,
          drawingNumber
        ));
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Drawing Sheet")
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
    )
    .bail()
    .custom(async (val) => {
      let found = await api.info.employee.get(val);
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Employee")
        );
      }

      return true;
    }),
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
      let found = (await db.transaction.ldar.drawing.exists(val)) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "LDAR Drawing")
        );
      }

      return true;
    }),
];
