const axios = require("axios").default;
const { MessageProvider } = require("../../../core");

let uri = "/api/transaction/drawing";

class DrawingApi {
  constructor({ connection }) {
    this.connection = connection;
  }
  async get(token, id, number, revision, title, program_ref) {
    let url = this.connection.host + uri;
    url += id ? `/${id}?` : "?";
    url += number ? `&number=${number}` : "";
    url += revision ? `&revision=${revision}` : "";
    url += title ? `&title=${title}` : "";
    url += program_ref ? `&program_ref=${program_ref}` : "";

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

module.exports = DrawingApi;
