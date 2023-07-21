const { body, check } = require("express-validator");
const {
  oracle: { db },
} = require("../../../database");
const { Messages, MessageProvider } = require("../../../../core");
const { api } = require("../../../api");
const apiValidation = process.env.API_VALIDATION === "TRUE";

exports.approval = require("./approval");
exports.file = require("./file");

exports.add = [
  body("modelCode")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Model")
    )
    .bail()
    .isLength({ max: 8 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Model", 8)
    )
    .bail()
    .custom(async (val, { req }) => {
      let found =
        !apiValidation ||
        (await api.engineering.model.get(req.headers.authorization, val));
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Model")
        );
      }

      return true;
    }),
  body("phone")
    .optional()
    .isLength({ max: 15 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Phone", 15)
    ),
  body("location")
    .optional()
    .isLength({ max: 100 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Location", 100)
    ),
  body("refCode")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Reference Code")
    )
    .bail()
    .isLength({ max: 1 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Reference Code", 1)
    )
    .bail()
    .isIn(["1", "2", "3", "9"])
    .withMessage(
      MessageProvider.status(Messages.KEYS.IN) +
        "|" +
        MessageProvider.message(
          Messages.KEYS.IN,
          "Reference Code",
          "1 = RT; 2 = SOM; 3 = ELR; 9 = Other"
        )
    ),
  body("refNumber")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Reference Number")
    )
    .bail()
    .isLength({ max: 25 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(
          Messages.KEYS.MAX_LENGTH,
          "Reference Number",
          25
        )
    )
    .bail()
    .custom(async (val, { req }) => {
      let found;

      found =
        req.body.refCode == 9 ||
        !apiValidation ||
        (await api.sap.referensi.get(val, req.body.refCode));
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Reference Number")
        );
      }

      found =
        (await db.transaction.ldar.exists(
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          req.body.refCode,
          val
        )) == 1;
      if (found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.ALREADY_EXIST) +
            "|" +
            MessageProvider.message(
              Messages.KEYS.ALREADY_EXIST,
              "Reference Number"
            )
        );
      }

      return true;
    }),
  body("version")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Version")
    )
    .bail()
    .isLength({ max: 25 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Version", 25)
    ),
  body("drawingNumber")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Drawing Number")
    )
    .bail()
    .isLength({ max: 50 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Drawing Number", 50)
    )
    .bail()
    .custom(async (val, { req }) => {
      let found =
        !apiValidation ||
        (await api.siedm.drawing.get(
          req.headers.authorization,
          "",
          val,
          req.body.drawingIndex
        ));
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Drawing")
        );
      }

      return true;
    }),
  body("drawingIndex")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Drawing Index")
    )
    .bail()
    .isLength({ max: 5 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Drawing Index", 5)
    )
    .bail()
    .custom(async (val, { req }) => {
      let found =
        !apiValidation ||
        (await api.siedm.drawing.get(
          req.headers.authorization,
          "",
          req.body.drawingNumber,
          val
        ));
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Drawing")
        );
      }

      return true;
    }),
  body("drawingDesignation")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Drawing Designation")
    )
    .bail()
    .isLength({ max: 100 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(
          Messages.KEYS.MAX_LENGTH,
          "Drawing Designation",
          100
        )
    ),
  body("manHour")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Man Hour")
    )
    .bail()
    .isNumeric()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NUMERIC) +
        "|" +
        MessageProvider.message(Messages.KEYS.NUMERIC, "Man Hour")
    )
    .bail()
    .isLength({ max: 2 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Man Hour", 2)
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
      let found =
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
          "0"
        )) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(
              Messages.KEYS.NOT_FOUND,
              "LDAR with Status 0"
            )
        );
      }

      return true;
    }),
  body("modelCode")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Model")
    )
    .bail()
    .isLength({ max: 8 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Model", 8)
    )
    .bail()
    .custom(async (val, { req }) => {
      let found =
        !apiValidation ||
        (await api.engineering.model.get(req.headers.authorization, val));
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Model")
        );
      }

      return true;
    }),
  body("phone")
    .optional()
    .isLength({ max: 15 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Phone", 15)
    ),
  body("location")
    .optional()
    .isLength({ max: 100 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Location", 100)
    ),
  body("refCode")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Reference Code")
    )
    .bail()
    .isLength({ max: 1 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Reference Code", 1)
    )
    .bail()
    .isIn(["1", "2", "3", "9"])
    .withMessage(
      MessageProvider.status(Messages.KEYS.IN) +
        "|" +
        MessageProvider.message(
          Messages.KEYS.IN,
          "Reference Code",
          "1 = RT; 2 = SOM; 3 = ELR; 9 = Other"
        )
    ),
  body("refNumber")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Reference Number")
    )
    .bail()
    .isLength({ max: 25 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(
          Messages.KEYS.MAX_LENGTH,
          "Reference Number",
          25
        )
    )
    .bail()
    .custom(async (val, { req }) => {
      let found;

      found =
        req.body.refCode == 9 ||
        !apiValidation ||
        (await api.sap.referensi.get(val, req.body.refCode));
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Reference Number")
        );
      }

      found =
        (await db.transaction.ldar.exists(
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          req.body.refCode,
          val,
          "",
          "",
          "",
          "",
          "",
          "",
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
              "Reference Number"
            )
        );
      }

      return true;
    }),
  body("version")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Version")
    )
    .bail()
    .isLength({ max: 25 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Version", 25)
    ),
  body("drawingNumber")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Drawing Number")
    )
    .bail()
    .isLength({ max: 50 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Drawing Number", 50)
    )
    .bail()
    .custom(async (val, { req }) => {
      let found =
        !apiValidation ||
        (await api.siedm.drawing.get(
          req.headers.authorization,
          "",
          val,
          req.body.drawingIndex
        ));
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Drawing")
        );
      }

      return true;
    }),
  body("drawingIndex")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Drawing Index")
    )
    .bail()
    .isLength({ max: 5 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Drawing Index", 5)
    )
    .bail()
    .custom(async (val, { req }) => {
      let found =
        !apiValidation ||
        (await api.siedm.drawing.get(
          req.headers.authorization,
          "",
          req.body.drawingNumber,
          val
        ));
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Drawing")
        );
      }

      return true;
    }),
  body("drawingDesignation")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Drawing Designation")
    )
    .bail()
    .isLength({ max: 100 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(
          Messages.KEYS.MAX_LENGTH,
          "Drawing Designation",
          100
        )
    ),
  body("manHour")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Man Hour")
    )
    .bail()
    .isNumeric()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NUMERIC) +
        "|" +
        MessageProvider.message(Messages.KEYS.NUMERIC, "Man Hour")
    )
    .bail()
    .isLength({ max: 2 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Man Hour", 2)
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
  // .bail()
  // .custom(async (val) => {
  //   let found = await api.info.employee.get(val);
  //   if (!found) {
  //     throw new Error(
  //       MessageProvider.status(Messages.KEYS.NOT_FOUND) +
  //         "|" +
  //         MessageProvider.message(Messages.KEYS.NOT_FOUND, "Employee")
  //     );
  //   }

  //   return true;
  // }),
];

exports.update_edm = [
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
          "1"
        )) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(
              Messages.KEYS.NOT_FOUND,
              "LDAR with Status 1"
            )
        );
      }

      return true;
    }),
  body("PENik")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "NIK PE")
    )
    .bail()
    .isLength({ max: 6 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "NIK PE", 6)
    )
    .bail()
    .custom(async (val) => {
      let found =
        (await api.info.employee.get(val)) &&
        (await db.reference.user_role.exists(val, "", "PE")) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Employee (PE)")
        );
      }

      return true;
    }),
  body("groupAta")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Group/Ata")
    )
    .bail()
    .isLength({ max: 40 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Group/Ata", 40)
    )
    .bail()
    .custom(async (val, { req }) => {
      let found;
      if (apiValidation) {
        let data = (await db.transaction.ldar.get(req.body.id))[0];
        let program = (
          await api.engineering.model.get(
            req.headers.authorization,
            data.modelCode
          )
        ).kode_program;

        found = await api.mta.ata.get(
          req.headers.authorization,
          "",
          program,
          val
        );
        if (!found) {
          throw new Error(
            MessageProvider.status(Messages.KEYS.NOT_FOUND) +
              "|" +
              MessageProvider.message(Messages.KEYS.NOT_FOUND, "Group/Ata")
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
    .custom(async (val, { req }) => {
      let found = await api.info.employee.get(val);
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Employee")
        );
      }

      let EDM = (await db.transaction.ldar.get(req.body.id))[0].EDMNik;

      found = !EDM || EDM == val;

      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.ALREADY_EXIST) +
            "|Already accepted by other EDM"
        );
      }
      return true;
    }),
];

exports.update_pe_accepted = [
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
          "2"
        )) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(
              Messages.KEYS.NOT_FOUND,
              "LDAR with Status 2"
            )
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

exports.update_pe = [
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
  body("acceptedReason")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Accepted Reason")
    )
    .bail()
    .isLength({ max: 50 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Accepted Reason", 50)
    ),
  body("planningReview")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Planning Review")
    )
    .bail()
    .isLength({ max: 300 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(
          Messages.KEYS.MAX_LENGTH,
          "Planning Review",
          300
        )
    ),
  body("drawingFlag")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "See Drawing Flag")
    )
    .bail()
    .isLength({ max: 1 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "See Drawing Flag", 1)
    )
    .bail()
    .isIn(["0", "1"])
    .withMessage(
      MessageProvider.status(Messages.KEYS.IN) +
        "|" +
        MessageProvider.message(
          Messages.KEYS.IN,
          "See Drawing Flag",
          "0 = False; 1 = True"
        )
    ),
  body("otherFlag")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Other Flag")
    )
    .bail()
    .isLength({ max: 1 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Other Flag", 1)
    )
    .bail()
    .isIn(["0", "1"])
    .withMessage(
      MessageProvider.status(Messages.KEYS.IN) +
        "|" +
        MessageProvider.message(
          Messages.KEYS.IN,
          "Other Flag",
          "0 = False; 1 = True"
        )
    ),
  body("reasonFlag")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "See Reason Flag")
    )
    .bail()
    .isLength({ max: 1 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "See Reason Flag", 1)
    )
    .bail()
    .isIn(["0", "1"])
    .withMessage(
      MessageProvider.status(Messages.KEYS.IN) +
        "|" +
        MessageProvider.message(
          Messages.KEYS.IN,
          "See Reason Flag",
          "0 = False; 1 = True"
        )
    ),
  body("indicatedFlag")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Indicated Below Flag")
    )
    .bail()
    .isLength({ max: 1 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(
          Messages.KEYS.MAX_LENGTH,
          "Indicated Below Flag",
          1
        )
    )
    .bail()
    .isIn(["0", "1"])
    .withMessage(
      MessageProvider.status(Messages.KEYS.IN) +
        "|" +
        MessageProvider.message(
          Messages.KEYS.IN,
          "Indicated Below Flag",
          "0 = False; 1 = True"
        )
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

exports.update_status = [
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
    .custom(async (val, { req }) => {
      let found;
      let allowed;
      let ref;
      let user;
      switch (req.body.status) {
        case "1":
          allowed = "0";
          user = "EDM";
          break;
        case "2":
          allowed = "1";
          break;
        case "4":
          allowed = "3";
          user = "DE";
          break;
        case "5":
          allowed = "4";
          user = "AWOP";
          break;
        case "6":
          allowed = "4";
          break;
        case "7":
          ref = "3";
          allowed = "5";
          break;
        case "8":
          ref = "3";
          allowed = "5";
          break;
        case "9":
          allowed = "5,6,7,8";
          break;
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
          ref,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          allowed
        )) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(
              Messages.KEYS.NOT_FOUND,
              "LDAR with Status " +
                allowed.split(",").join(", ") +
                (ref ? " and Reference ELR Document" : "")
            )
        );
      }

      // AWOP ref 1 = false
      // AWOP ref 0 = true
      // EDM ref X = false
      found =
        !user ||
        !(
          user != "AWOP" ||
          (user == "AWOP" &&
            (await db.transaction.ldar.exists(
              val,
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "3"
            )) == 1)
        ) ||
        (await db.reference.user_role.exists("", "", user)) >= 1;

      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(
              Messages.KEYS.NOT_FOUND,
              `Employee (${user})`
            )
        );
      }

      let data = (await db.transaction.ldar.get(val))[0];

      found =
        !["5", "6"].includes(req.body.status) ||
        (await db.transaction.ldar.approval.exists(
          "",
          val,
          "0",
          "",
          "",
          data.PENik
        )) == 0;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.UNPROCESSABLE_ENTITY) +
            "|There's still approval to be done"
        );
      }

      return true;
    }),
  body("status")
    .notEmpty()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
        "|" +
        MessageProvider.message(Messages.KEYS.NOT_EMPTY, "Status")
    )
    .bail()
    .isNumeric()
    .withMessage(
      MessageProvider.status(Messages.KEYS.NUMERIC) +
        "|" +
        MessageProvider.message(Messages.KEYS.NUMERIC, "Status")
    )
    .bail()
    .isLength({ max: 1 })
    .withMessage(
      MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
        "|" +
        MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Status", 1)
    )
    .bail()
    .isIn(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])
    .withMessage(
      MessageProvider.status(Messages.KEYS.IN) +
        "|" +
        MessageProvider.message(
          Messages.KEYS.IN,
          "Status",
          "0 = Created; 1 = Submit to EDM; 2 = Submit to PE; 3 = Received by PE; 4 = Assigned to DE; 5 = Approved by PE; 6 = Rejected by PE; 7 = Accepted by AWO Panel; 8 = Rejected by AWO Panel; 9 = Closed"
        )
    ),
  body("nik").custom(async (val, { req }) => {
    if (req.body.status == "4") {
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
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Employee (DE)")
        );
      }
    }
    return true;
  }),
  body("remark").custom(async (val, { req }) => {
    let valid = true;

    valid =
      !["5", "6", "7", "8"].includes(req.body.status) ||
      !val ||
      val.length <= 1000;
    if (!valid) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
          "|" +
          MessageProvider.message(Messages.KEYS.MAX_LENGTH, "Remark", 1000)
      );
    }

    return true;
  }),
  check("file").custom(async (val, { req }) => {
    let valid = false;

    valid =
      !["5", "6", "7", "8"].includes(req.body.status) ||
      !req.file ||
      req.file.originalname.length <= 250;
    if (!valid) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
          "|" +
          MessageProvider.message(Messages.KEYS.MAX_LENGTH, "File", 250)
      );
    }

    return true;
  }),
  body("AWOPNik").custom(async (val, { req }) => {
    let valid = true;

    valid = !(req.body.status == "5") || val;
    if (!valid) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.NOT_EMPTY) +
          "|" +
          MessageProvider.message(Messages.KEYS.NOT_EMPTY, "AWOP Nik")
      );
    }
    valid = !(req.body.status == "5") || val.length <= 6;
    if (!valid) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.MAX_LENGTH) +
          "|" +
          MessageProvider.message(Messages.KEYS.MAX_LENGTH, "AWOP Nik", 6)
      );
    }

    valid =
      !(req.body.status == "5") ||
      ((await api.info.employee.get(val)) &&
        (await db.reference.user_role.exists(val, "", "AWOP")) == 1);
    if (!valid) {
      throw new Error(
        MessageProvider.status(Messages.KEYS.NOT_FOUND) +
          "|" +
          MessageProvider.message(Messages.KEYS.NOT_FOUND, "Employee (AWOP)")
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
    .custom(async (val, { req }) => {
      let found;
      found =
        !["7", "8"].includes(req.body.status) ||
        ((await api.info.employee.get(val)) &&
          (await db.reference.user_role.exists(val, "", "AWOP")) == 1 &&
          (await db.transaction.ldar.approval.exists(
            "",
            req.body.id,
            "",
            val
          )) == 1);

      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "Employee (AWOP)")
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
      let found = (await db.transaction.ldar.exists(val)) == 1;
      if (!found) {
        throw new Error(
          MessageProvider.status(Messages.KEYS.NOT_FOUND) +
            "|" +
            MessageProvider.message(Messages.KEYS.NOT_FOUND, "LDAR")
        );
      }

      return true;
    }),
];
