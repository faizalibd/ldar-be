var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var helmet = require("helmet");
var compression = require("compression");
var cors = require("cors");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use("*", cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ########### LOG ###########

if (process.env.LOG === "TRUE") {
  var logger = require("morgan");
  var { ApplicationLogger } = require("./core");

  ApplicationLogger.stream = {
    write: function (message, encoding) {
      ApplicationLogger.info(message, encoding);
    },
  };
  app.use(logger("dev", { stream: ApplicationLogger.stream }));
}

// ########### JWT ###########

if (process.env.JWT === "TRUE") {
  var { expressjwt: jwt } = require("express-jwt");
  var fs = require("fs");

  var key = fs.readFileSync(
    path.join(__dirname, "core/key/") + process.env.JWT_SECRET_OR_KEY
  );
  app.use(
    jwt({ secret: key, algorithms: [process.env.JWT_TOKEN_HASH_ALGO] }).unless({
      path: ["/"],
    })
  );

  app.use(function (err, req, res, next) {
    if (err.status == 401) {
      let response = {
        code: 401,
        data: null,
        message: "Unauthorized User",
      };
      res.status(401).json(response);
    } else {
      next();
    }
  });
}

app.use("/", require("./routes/index.routes"));
app.use("/api", require("./routes/api.routes"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error =
    req.app.get("env") === "local" || req.app.get("env") === "development"
      ? err
      : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
