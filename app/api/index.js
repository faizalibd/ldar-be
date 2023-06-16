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
      if (token[i]) {
        connection[n].config.authorization = "Bearer " + token[i];
      }
      break;
  }
});

const classApi = {
  info: {
    employee: {
      api: require("./info/employee"),
    },
  },
  engineering: {
    model: {
      api: require("./engineering/model"),
    },
  },
  sap: {
    referensi: {
      api: require("./sap/referensi"),
    },
    customer: {
      api: require("./sap/customer"),
    },
  },
  siedm: {
    drawing: {
      api: require("./siedm/drawing"),
    },
  },
  mta: {
    ata: {
      api: require("./mta/ata"),
    },
  },
};

const api = {
  info: {
    employee: new classApi.info.employee.api({
      connection: connection.info,
    }),
  },
  engineering: {
    model: new classApi.engineering.model.api({
      connection: connection.engineering,
    }),
  },
  sap: {
    referensi: new classApi.sap.referensi.api({
      connection: connection.sap,
    }),
    customer: new classApi.sap.customer.api({
      connection: connection.sap,
    }),
  },
  siedm: {
    drawing: new classApi.siedm.drawing.api({
      connection: connection.siedm,
    }),
  },
  mta: {
    ata: new classApi.mta.ata.api({
      connection: connection.mta,
    }),
  },
};

module.exports = { api };
