const {
  oracle: { db },
} = require("../../../database");
const { Messages, MessageProvider } = require("../../../../core");

exports.approval = require("./approval");
exports.file = require("./file");
exports.drawing = require("./drawing");

exports.get = async (req, res) => {
  let response = {
    code: MessageProvider.status(Messages.KEYS.SUCCESS),
    total_data: 0,
    data: null,
    message: MessageProvider.message(Messages.KEYS.SUCCESS),
  };
  try {
    const result = await db.transaction.ldar.get(
      req.params.id,
      req.query.number,
      req.query.modelCode,
      req.query.nik,
      req.query.submittedNik,
      req.query.submittedDate,
      req.query.LSNUnit,
      req.query.EDMNik,
      req.query.refCode,
      req.query.refNumber,
      req.query.PENik,
      req.query.PEDate,
      req.query.group,
      req.query.version,
      req.query.drawingNumber,
      req.query.drawingIndex,
      req.query.status,
      req.query.statusDate,
      req.query.typeCode,
      req.query.nikApproval,
      req.query.limit,
      req.query.offset
    );
    if (!result.length) {
      response.code = MessageProvider.status(Messages.KEYS.NOT_FOUND);
      response.message = MessageProvider.message(
        Messages.KEYS.NOT_FOUND,
        "LDAR"
      );
    } else {
      response.data = result.length == 1 ? result[0] : result;
      response.total_data = result.length;
    }
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.ERROR,
      "LDAR"
    )} ${error.message || error}`;
  }
  res.status(response.code).json(response);
};

exports.add = async (req, res) => {
  let response = {
    code: MessageProvider.status(Messages.KEYS.ADD_SUCCESS),
    data: null,
    message: MessageProvider.message(Messages.KEYS.ADD_SUCCESS, "LDAR"),
  };

  try {
    response.data = await db.transaction.ldar.add(req);
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.ERROR,
      "LDAR"
    )} ${error.message || error}`;
  }
  res.status(response.code).json(response);
};

exports.update = async (req, res) => {
  let response = {
    code: MessageProvider.status(Messages.KEYS.UPDATE_SUCCESS),
    data: null,
    message: MessageProvider.message(Messages.KEYS.UPDATE_SUCCESS, "LDAR"),
  };
  try {
    response.data = await db.transaction.ldar.update(req);
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.UPDATE_ERROR,
      "LDAR"
    )} - ${error.message || error}`;
  }
  res.status(response.code).json(response);
};

exports.delete = async (req, res) => {
  let response = {
    code: MessageProvider.status(Messages.KEYS.DELETE_SUCCESS),
    data: null,
    message: MessageProvider.message(Messages.KEYS.DELETE_SUCCESS, "LDAR"),
  };

  try {
    await db.transaction.ldar.delete(req);
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.ERROR,
      "LDAR"
    )} ${error.message || error}`;
  }
  res.status(response.code).json(response);
};
