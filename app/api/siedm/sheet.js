const axios = require("axios").default;
const { MessageProvider } = require("../../../core");

let uri = "/api/transaction/sheet";

class SheetApi {
  constructor({ connection }) {
    this.connection = connection;
  }
  async get(token, id, idDrawing, sheet, number, type) {
    let url = this.connection.host + uri;
    url += id ? `/${id}?` : "?";
    url += idDrawing ? `&idDrawing=${idDrawing}` : "";
    url += sheet ? `&sheet=${sheet}` : "";
    url += number ? `&number=${number}` : "";
    url += type ? `&type=${type}` : "";

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

module.exports = SheetApi;
