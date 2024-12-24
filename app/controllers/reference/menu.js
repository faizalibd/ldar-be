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
    const result = await db.reference.menu.get(
      req.params.id,
      req.query.parentId,
      req.query.name,
      req.query.code,
      req.query.status,
      req.query.sub,
      req.query.limit,
      req.query.offset
    );
    if (!result.length) {
      response.code = MessageProvider.status(Messages.KEYS.NOT_FOUND);
      response.message = MessageProvider.message(
        Messages.KEYS.NOT_FOUND,
        "Menu"
      );
    } else {
      response.data = result.length == 1 ? result[0] : result;
      response.total_data = result.length;
    }
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.ERROR,
      "Menu"
    )} ${error.message || error}`;
  }
  res.status(response.code).json(response);
};

exports.add = async (req, res) => {
  let response = {
    code: MessageProvider.status(Messages.KEYS.ADD_SUCCESS),
    data: null,
    message: MessageProvider.message(Messages.KEYS.ADD_SUCCESS, "Menu"),
  };

  try {
    response.data = await db.reference.menu.add(req);
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.ERROR,
      "Menu"
    )} ${error.message || error}`;
  }
  res.status(response.code).json(response);
};

exports.update = async (req, res) => {
  let response = {
    code: MessageProvider.status(Messages.KEYS.UPDATE_SUCCESS),
    data: null,
    message: MessageProvider.message(Messages.KEYS.UPDATE_SUCCESS, "Menu"),
  };
  try {
    response.data = await db.reference.menu.update(req);
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.UPDATE_ERROR,
      "Menu"
    )} - ${error.message || error}`;
  }
  res.status(response.code).json(response);
};

exports.delete = async (req, res) => {
  let response = {
    code: MessageProvider.status(Messages.KEYS.DELETE_SUCCESS),
    data: null,
    message: MessageProvider.message(Messages.KEYS.DELETE_SUCCESS, "Menu"),
  };

  try {
    await db.reference.menu.delete(req);
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.ERROR,
      "Menu"
    )} ${error.message || error}`;
  }
  res.status(response.code).json(response);
};
