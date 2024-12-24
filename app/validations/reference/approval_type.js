const { body } = require('express-validator');
const { oracle: { db } } = require("../../database");
const { Messages, MessageProvider } = require("../../../core");

exports.add = [
    body('code')
        .notEmpty()
        .withMessage(MessageProvider.status(
            Messages.KEYS.NOT_EMPTY
        ) + "|" + MessageProvider.message(
            Messages.KEYS.NOT_EMPTY
            , "Code"))
        .bail()
        .isNumeric()
        .withMessage(MessageProvider.status(
            Messages.KEYS.NUMERIC
        ) + "|" + MessageProvider.message(
            Messages.KEYS.NUMERIC
            , "Code"))
        .bail()
        .isLength({ max: 5 })
        .withMessage(MessageProvider.status(
            Messages.KEYS.MAX_LENGTH
        ) + "|" + MessageProvider.message(
            Messages.KEYS.MAX_LENGTH
            , "Code", 5))
        .bail()
        .custom(async (val) => {
            let found = (await db.reference.approval_type.exists(val)) == 1;
            if (found) {
                throw new Error(MessageProvider.status(
                    Messages.KEYS.ALREADY_EXIST
                ) + "|" + MessageProvider.message(
                    Messages.KEYS.ALREADY_EXIST, "Approval Type"
                ))
            }

            return true;
        }),
    body('description')
        .notEmpty()
        .withMessage(MessageProvider.status(
            Messages.KEYS.NOT_EMPTY
        ) + "|" + MessageProvider.message(
            Messages.KEYS.NOT_EMPTY
            , "Description"))
        .bail()
        .isLength({ max: 50 })
        .withMessage(MessageProvider.status(
            Messages.KEYS.MAX_LENGTH
        ) + "|" + MessageProvider.message(
            Messages.KEYS.MAX_LENGTH
            , "Description", 50))
        .bail()
        .custom(async (val) => {
            let found = (await db.reference.approval_type.exists("", val)) == 1;
            if (found) {
                throw new Error(MessageProvider.status(
                    Messages.KEYS.ALREADY_EXIST
                ) + "|" + MessageProvider.message(
                    Messages.KEYS.ALREADY_EXIST, "Approval Type"
                ))
            }

            return true;
        }),
    body('entry')
        .notEmpty()
        .withMessage(MessageProvider.status(
            Messages.KEYS.NOT_EMPTY
        ) + "|" + MessageProvider.message(
            Messages.KEYS.NOT_EMPTY
            , "Entry"))
        .bail()
        .isLength({ max: 6 })
        .withMessage(MessageProvider.status(
            Messages.KEYS.MAX_LENGTH
        ) + "|" + MessageProvider.message(
            Messages.KEYS.MAX_LENGTH
            , "Entry", 6)),
]

exports.update = [
    body('code')
        .notEmpty()
        .withMessage(MessageProvider.status(
            Messages.KEYS.NOT_EMPTY
        ) + "|" + MessageProvider.message(
            Messages.KEYS.NOT_EMPTY
            , "Code"))
        .bail()
        .isNumeric()
        .withMessage(MessageProvider.status(
            Messages.KEYS.NUMERIC
        ) + "|" + MessageProvider.message(
            Messages.KEYS.NUMERIC
            , "Code"))
        .bail()
        .isLength({ max: 5 })
        .withMessage(MessageProvider.status(
            Messages.KEYS.MAX_LENGTH
        ) + "|" + MessageProvider.message(
            Messages.KEYS.MAX_LENGTH
            , "Code", 5))
        .bail()
        .custom(async (val) => {
            let found = (await db.reference.approval_type.exists(val)) == 1;
            if (!found) {
                throw new Error(MessageProvider.status(
                    Messages.KEYS.NOT_FOUND
                ) + "|" + MessageProvider.message(
                    Messages.KEYS.NOT_FOUND
                    , "Approval Type"))
            }

            return true;
        }),
    body('description')
        .notEmpty()
        .withMessage(MessageProvider.status(
            Messages.KEYS.NOT_EMPTY
        ) + "|" + MessageProvider.message(
            Messages.KEYS.NOT_EMPTY
            , "Description"))
        .bail()
        .isLength({ max: 50 })
        .withMessage(MessageProvider.status(
            Messages.KEYS.MAX_LENGTH
        ) + "|" + MessageProvider.message(
            Messages.KEYS.MAX_LENGTH
            , "Description", 50))
        .bail()
        .custom(async (val, { req }) => {
            let found = (await db.reference.approval_type.exists("", val, req.body.code)) == 1;
            if (found) {
                throw new Error(MessageProvider.status(
                    Messages.KEYS.ALREADY_EXIST
                ) + "|" + MessageProvider.message(
                    Messages.KEYS.ALREADY_EXIST, "Approval Type"
                ))
            }

            return true;
        }),
    body('entry')
        .notEmpty()
        .withMessage(MessageProvider.status(
            Messages.KEYS.NOT_EMPTY
        ) + "|" + MessageProvider.message(
            Messages.KEYS.NOT_EMPTY
            , "Entry"))
        .bail()
        .isLength({ max: 6 })
        .withMessage(MessageProvider.status(
            Messages.KEYS.MAX_LENGTH
        ) + "|" + MessageProvider.message(
            Messages.KEYS.MAX_LENGTH
            , "Entry", 6)),
]

exports.delete = [
    body('code')
        .notEmpty()
        .withMessage(MessageProvider.status(
            Messages.KEYS.NOT_EMPTY
        ) + "|" + MessageProvider.message(
            Messages.KEYS.NOT_EMPTY
            , "Code"))
        .bail()
        .isNumeric()
        .withMessage(MessageProvider.status(
            Messages.KEYS.NUMERIC
        ) + "|" + MessageProvider.message(
            Messages.KEYS.NUMERIC
            , "Code"))
        .bail()
        .isLength({ max: 5 })
        .withMessage(MessageProvider.status(
            Messages.KEYS.MAX_LENGTH
        ) + "|" + MessageProvider.message(
            Messages.KEYS.MAX_LENGTH
            , "Code", 5))
        .bail()
        .custom(async (val) => {
            let found;

            found = (await db.reference.approval_type.exists(val)) == 1;
            if (!found) {
                throw new Error(MessageProvider.status(
                    Messages.KEYS.NOT_FOUND
                ) + "|" + MessageProvider.message(
                    Messages.KEYS.NOT_FOUND
                    , "Approval Type"))
            }

            return true;
        }),
]