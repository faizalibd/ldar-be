const axios = require("axios").default;
const { MessageProvider } = require("../../../core");

let uri = "/api/referensi/ata";

class AtaApi {
  constructor({ connection }) {
    this.connection = connection;
  }
  async get(token, id, program, no) {
    let param = "?";
    let url = this.connection.host + uri + (id ? `/${id}` : "");
    param += program ? `&program=${program}` : "";
    param += no ? `&no=${no}` : "";
    url += param;

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

module.exports = AtaApi;
