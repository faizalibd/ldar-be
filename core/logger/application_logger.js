const { createLogger, format, transports } = require("winston");

const { combine, colorize, printf, timestamp } = format;

const fs = require("fs");

if (process.env.LOG === "TRUE") {
  const logDirectory = process.env.LOG_DIR_NAME;
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }
  const logFormat = printf((info) => {
    return `[${info.timestamp}] ${info.level}: ${info.message}`;
  });

  var options = {
    console: {
      level: "debug",
      handleExceptions: true,
      format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      ),
    },
    verbose: {
      level: "info",
      filename: process.env.LOG_APP_FILE_NAME,
      dirname: logDirectory,
      handleExceptions: true,
      maxsize: process.env.LOG_MAX_SIZE,
      maxFiles: process.env.LOG_MAX_FILE,
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    },
  };

  const ApplicationLogger = createLogger({
    transports: [
      new transports.File(options.verbose),
      new transports.Console(options.console),
    ],
    exitOnError: false,
  });

  module.exports = ApplicationLogger;
}