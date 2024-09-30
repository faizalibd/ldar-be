const axios = require("axios").default;
const { MessageProvider } = require("../../../core");

let uri = "/general/employee";

class EmployeeApi {
  constructor({ connection }) {
    this.connection = connection;
  }
  async get(nik, organization) {
    let url = this.connection.host + uri + "?";
    url += nik ? `&nik=${nik}` : "";
    url += organization ? `&org=${organization}` : "";
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

module.exports = EmployeeApi;
