const {
  oracle: { db },
} = require("../../database");
const { Messages, MessageProvider } = require("../../../core");

exports.get = async (req, res) => {
  let response = {
    code: MessageProvider.status(Messages.KEYS.SUCCESS),
    total_data: 0,
    data: null,
    message: MessageProvider.message(Messages.KEYS.SUCCESS),
  };
  try {
    const result = await db.reference.approval_type.get(
      req.params.code,
      req.query.description,
      req.query.limit,
      req.query.offset
    );
    if (!result.length) {
      response.code = MessageProvider.status(Messages.KEYS.NOT_FOUND);
      response.message = MessageProvider.message(
        Messages.KEYS.NOT_FOUND,
        "Approval Type"
      );
    } else {
      response.data = result.length == 1 ? result[0] : result;
      response.total_data = result.length;
    }
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.ERROR,
      "Approval Type"
    )} ${error.message || error}`;
  }
  res.status(response.code).json(response);
};

exports.add = async (req, res) => {
  let response = {
    code: MessageProvider.status(Messages.KEYS.ADD_SUCCESS),
    data: null,
    message: MessageProvider.message(
      Messages.KEYS.ADD_SUCCESS,
      "Approval Type"
    ),
  };

  try {
    response.data = await db.reference.approval_type.add(req);
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.ERROR,
      "Approval Type"
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
      "Approval Type"
    ),
  };
  try {
    response.data = await db.reference.approval_type.update(req);
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.UPDATE_ERROR,
      "Approval Type"
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
      "Approval Type"
    ),
  };

  try {
    await db.reference.approval_type.delete(req);
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.ERROR,
      "Approval Type"
    )} ${error.message || error}`;
  }
  res.status(response.code).json(response);
};
