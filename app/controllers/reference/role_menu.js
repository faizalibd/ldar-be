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
    const result = await db.reference.role_menu.get(
      req.params.roleId || req.query.roleId,
      req.query.menuId,
      req.query.limit,
      req.query.offset
    );
    if (!result.length) {
      response.code = MessageProvider.status(Messages.KEYS.NOT_FOUND);
      response.message = MessageProvider.message(
        Messages.KEYS.NOT_FOUND,
        "Role Menu"
      );
    } else {
      response.data = result.length == 1 ? result[0] : result;
      response.total_data = result.length;
    }
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.ERROR,
      "Role Menu"
    )} ${error.message || error}`;
  }
  res.status(response.code).json(response);
};

exports.add = async (req, res) => {
  let response = {
    code: MessageProvider.status(Messages.KEYS.ADD_SUCCESS),
    data: null,
    message: MessageProvider.message(Messages.KEYS.ADD_SUCCESS, "Role Menu"),
  };

  try {
    await db.reference.role_menu.add(req);
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.ERROR,
      "Role Menu"
    )} ${error.message || error}`;
  }
  res.status(response.code).json(response);
};

exports.delete = async (req, res) => {
  let response = {
    code: MessageProvider.status(Messages.KEYS.DELETE_SUCCESS),
    data: null,
    message: MessageProvider.message(Messages.KEYS.DELETE_SUCCESS, "Role Menu"),
  };

  try {
    await db.reference.role_menu.delete(req.body.roleId, req.body.menuId);
  } catch (error) {
    response.code = MessageProvider.status(Messages.KEYS.ERROR);
    response.message = `${MessageProvider.message(
      Messages.KEYS.ERROR,
      "Role Menu"
    )} ${error.message || error}`;
  }
  res.status(response.code).json(response);
};
