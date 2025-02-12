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
      case "RT":
        url += "&type=RT";
        break;
      case "2":
      case "SOM":
        url += "&type=SOM";
        break;
      case "3":
      case "ELR":
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
