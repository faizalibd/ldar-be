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

module.exports = ModelApi;
