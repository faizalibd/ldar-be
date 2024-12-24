const axios = require("axios").default;
const { MessageProvider } = require("../../../core");

let uri = "/api/transaction/drawing";

class DrawingApi {
  constructor({ connection }) {
    this.connection = connection;
  }
  async get(token, id, number, revision, title, program_ref, adcn) {
    let url = this.connection.host + uri;
    url += id ? `/${id}?` : "?";
    url += number ? `&number=${number}` : "";
    url += revision ? `&revision=${revision}` : "";
    url += title ? `&title=${title}` : "";
    url += program_ref ? `&program_ref=${program_ref}` : "";
    url += adcn ? `&adcn=${adcn}` : "";

    this.connection.config.authorization = token;

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

module.exports = DrawingApi;
