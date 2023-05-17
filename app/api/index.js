const name = process.env.API_NAME.split(",");
const host = process.env.API_HOST.split(",");
const auth = process.env.API_AUTH.split(",");
const username = process.env.API_USER.split(",");
const password = process.env.API_PASSWORD.split(",");
const token = process.env.API_TOKEN.split(",");

let connection = {};

name.forEach(async (n, i) => {
  connection[n] = {
    host: host[i],
    config: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  };

  switch (auth[i]) {
    case "basic":
      connection[n].config.auth = {
        username: username[i],
        password: password[i],
      };
      break;
    case "bearer":
      connection[n].config.authorization = "Bearer " + token[i];
      break;
  }
});

const classApi = {
  info: {
    employee: {
      api: require("./info/employee"),
    },
  },
};

const api = {
  info: {
    employee: new classApi.info.employee.api({
      connection: connection.info,
    }),
  },
};

module.exports = { api };
