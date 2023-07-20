const axios = require("axios").default;
const { MessageProvider } = require("../../../core");

let uri = "/zrest_api/ldar/cust";

class CustomerApi {
  constructor({ connection }) {
    this.connection = connection;
  }
  async get(number, name) {
    let url = this.connection.host + uri + "?";
    url += number ? `&number=${number}` : "";
    url += name ? `&name=${name}` : "";
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

module.exports = CustomerApi;
