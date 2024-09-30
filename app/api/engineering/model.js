const axios = require("axios").default;
const { MessageProvider } = require("../../../core");

let uri = "/api/referensi/model";

class ModelApi {
  constructor({ connection }) {
    this.connection = connection;
  }
  async get(token, kode) {
    let url = this.connection.host + uri;
    url += kode ? `/${kode}` : "";
    this.connection.config.headers.authorization = token;

    return await axios
      .get(url, this.connection.config)
      .then(({ data }) => {
        return data.data;
      })
      .catch((error) => {
        MessageProvider.api(error);
      });
  }
}

module.exports = ModelApi;
