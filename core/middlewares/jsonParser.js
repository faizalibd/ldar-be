exports.parse = (key) => {
  return async (req, res, next) => {
    if (req.body[key] && typeof req.body[key] === "string") {
      req.body[key] = JSON.parse(req.body[key]);
    }
    return next();
  };
};

exports.entry = (key) => {
  return async (req, res, next) => {
    // req.body.entry = isNaN(req.body.entry) ? -1 : parseInt(req.body.entry);
    switch (key) {
      case "insert":
        req.body.insertUser = req.body.entry;
        break;
      case "update":
        req.body.updateUser = req.body.entry;
        break;
    }
    delete req.body.entry;

    return next();
  };
};
