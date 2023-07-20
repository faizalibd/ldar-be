const Messages = require("./messages_library");
const { find } = require("lodash");

const isExists = (key) => {
  return Messages.KEYS && key ? key in Messages.KEYS : false;
};

const messageObject = (key) => {
  const language = process.env.DEFAULT_LANGUAGE;
  if (key) {
    const message = find(Messages.DATA, {
      key: key,
      language: language,
    });
    return message;
  }
  return null;
};

const message = (key, object, detail) => {
  if (isExists(key)) {
    const { value, suffix } = messageObject(key);
    return value
      ? (object ? object + value : value) +
          (detail ? detail : "") +
          (suffix ? " " + suffix : "")
      : "";
  }
  return "";
};

const status = (key) => {
  if (isExists(key)) {
    const { status } = messageObject(key);
    return status ? status : "";
  }
  return 500;
};

const api = (error) => {
  if (error.response) {
    // Request made and server responded
    console.log(error.response.data);
  } else if (error.request) {
    // The request was made but no response was received
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error", error.message);
  }
};

const MessageProvider = {
  message,
  status,
  api,
};

module.exports = MessageProvider;
