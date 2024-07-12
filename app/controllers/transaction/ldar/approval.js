const {
  oracle: { db },
} = require("../../../database");
const { Messages, MessageProvider } = require("../../../../core");

exports.get = async (req, res) => {
  let response = {
    code: MessageProvider.status(Messages.KEYS.SUCCESS),
    total_data: 0,
    data: null,
    message: MessageProvider.message(Messages.KEYS.SUCCESS),
  };
  try {
    const result = await db.transaction.ldar.approval.get(
      req.params.id,
      req.query.LDARId,
      req.query.typeCode,
      req.query.nik,
      req.query.role,
      req.query.limit,
      req.query.offset
    );
    if (!result.length) {
      response.code = MessageProvider.status(Messages.KEYS.NOT_FOUND);
      response.message = MessageProvider.message(
        Messages.KEYS.NOT_FOUND,
        "LDAR Approval"
      );
    } else {
      response.data = result.length == 1 ? result[0] : result;
      response.total_data = result.length;
    }
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.ERROR,
      "LDAR Approval"
    )} ${error.message || error}`;
  }
  res.status(response.code).json(response);
};

exports.update = async (req, res) => {
  let response = {
    code: MessageProvider.status(Messages.KEYS.UPDATE_SUCCESS),
    data: null,
    message: MessageProvider.message(
      Messages.KEYS.UPDATE_SUCCESS,
      "LDAR Approval"
    ),
  };
  try {
    response.data = await db.transaction.ldar.approval.update(req);
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.UPDATE_ERROR,
      "LDAR Approval"
    )} - ${error.message || error}`;
  }
  res.status(response.code).json(response);
};

exports.delete = async (req, res) => {
  let response = {
    code: MessageProvider.status(Messages.KEYS.DELETE_SUCCESS),
    data: null,
    message: MessageProvider.message(
      Messages.KEYS.DELETE_SUCCESS,
      "LDAR Approval"
    ),
  };

  try {
    await db.transaction.ldar.approval.delete(req);
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.ERROR,
      "LDAR Approval"
    )} ${error.message || error}`;
  }
  res.status(response.code).json(response);
};

exports.download = async (req, res) => {
  let response = {
    code: MessageProvider.status(Messages.KEYS.SUCCESS),
    data: null,
    message: MessageProvider.message(Messages.KEYS.SUCCESS),
  };
  try {
    res.download(await db.transaction.ldar.approval.download(req.params.id));
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.ERROR,
      "Approval File"
    )} ${error.message || error}`;
  }
};
