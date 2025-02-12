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
    const result = await db.transaction.ldar.file.get(
      req.params.id,
      req.query.LDARId,
      req.query.name,
      req.query.groups,
      req.query.limit,
      req.query.offset
    );
    if (!result.length) {
      response.code = MessageProvider.status(Messages.KEYS.NOT_FOUND);
      response.message = MessageProvider.message(
        Messages.KEYS.NOT_FOUND,
        "LDAR File"
      );
    } else {
      response.data = result.length == 1 ? result[0] : result;
      response.total_data = result.length;
    }
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.ERROR,
      "LDAR File"
    )} ${error.message || error}`;
  }
  res.status(response.code).json(response);
};

exports.add = async (req, res) => {
  let response = {
    code: MessageProvider.status(Messages.KEYS.ADD_SUCCESS),
    data: null,
    message: MessageProvider.message(Messages.KEYS.ADD_SUCCESS, "LDAR File"),
  };

  try {
    response.data = await db.transaction.ldar.file.add(req);
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.ERROR,
      "LDAR File"
    )} ${error.message || error}`;
  }
  res.status(response.code).json(response);
};

exports.update = async (req, res) => {
  let response = {
    code: MessageProvider.status(Messages.KEYS.UPDATE_SUCCESS),
    data: null,
    message: MessageProvider.message(Messages.KEYS.UPDATE_SUCCESS, "LDAR File"),
  };
  try {
    response.data = await db.transaction.ldar.file.update(req);
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.UPDATE_ERROR,
      "LDAR File"
    )} - ${error.message || error}`;
  }
  res.status(response.code).json(response);
};

exports.delete = async (req, res) => {
  let response = {
    code: MessageProvider.status(Messages.KEYS.DELETE_SUCCESS),
    data: null,
    message: MessageProvider.message(Messages.KEYS.DELETE_SUCCESS, "LDAR File"),
  };

  try {
    await db.transaction.ldar.file.delete(req);
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.ERROR,
      "LDAR File"
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
    res.download(await db.transaction.ldar.file.download(req.params.id));
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.ERROR,
      "File File"
    )} ${error.message || error}`;
  }
};
