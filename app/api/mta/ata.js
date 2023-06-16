const axios = require("axios").default;
const { MessageProvider } = require("../../../core");

let uri = "/api/referensi/ata";

class AtaApi {
  constructor({ connection }) {
    this.connection = connection;
  }
  async get(token, id, no) {
    let param = "?";
    let url = this.connection.host + uri + (id ? `/${id}` : "");
    param += no ? `&no=${no}` : "";
    url += param;

    this.connection.config.authorization = "Bearer " + token;

    return await axios
      .get(url, this.connection.config)
      .then(({ data }) => {
        console.log(data);
        return data.code == 200 ? data.data : null;
      })
      .catch((error) => {
        throw MessageProvider.api(error);
      });
  }
}

module.exports = AtaApi;
