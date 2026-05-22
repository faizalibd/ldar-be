var express = require("express");
const { validationResult } = require("express-validator");

exports.validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    let err = errors.array()[0].msg;
    // console.log(err);

    let response = {
      code: err.split("|")[0],
      data: null,
      message: err.split("|")[1],
    };
    res.status(response.code).json(response);
  };
};
