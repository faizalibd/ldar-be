const axios = require("axios").default;
const { MessageProvider } = require("../../../core");

let uri = "/zrest_api/ldar/elr";

class ElrApi {
  constructor({ connection }) {
    this.connection = connection;
  }
  async getElr(number) {
    let url = this.connection.host + uri + "?";
    url += number ? `&number=${number}` : "";
    return await axios
      .get(url, this.connection.config)
      .then(({ data }) => {
        return data.info == "sukses" ? data.data : null;
      })
      .catch((error) => {
        MessageProvider.api(error);
      });
  }
}

module.exports = ElrApi;
