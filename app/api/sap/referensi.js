const axios = require("axios").default;
const { MessageProvider } = require("../../../core");

let uri = "/zrest_api/ldar/ref";

class ReferensiApi {
  constructor({ connection }) {
    this.connection = connection;
  }
  async get(number, type) {
    let url = this.connection.host + uri + "?";
    url += number ? `&number=${number}` : "";
    switch (type) {
      case "1":
        url += "&type=RT";
        break;
      case "2":
        url += "&type=SOM";
        break;
      case "3":
        url += "&type=ELR";
        break;
    }
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

module.exports = ReferensiApi;
