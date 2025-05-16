const { api } = require("../../../../api");

class SAPRepository {
  constructor(db) {
    this.db = db;
  }

  async get(limit = null, offset = 0, type, number) {
    let typeUpperCase = type.toUpperCase();
    // let codeRef;
    // if (type == "RT") {
    //   codeRef = "1";
    // } else if (type == "SOM") {
    //   codeRef = "2";
    // } else if ((type = "ELR")) {
    //   codeRef = "3";
    // }
    // let existedNumber = (
    //   await this.db.execute(
    //     "dbapdm",
    //     "SELECT I_LDAR_REFBY FROM DBAPDM.TMLDAR WHERE C_LDAR_REFBY =" +
    //       codeRef +
    //       "",
    //     []
    //   )
    // ).rows.map((number) => number.I_LDAR_REFBY);

    let dataSAP = await api.sap.referensi.get(number, typeUpperCase);

    let array = dataSAP;
    //   ? dataSAP.filter((data) => !existedNumber.includes(data.number))
    //   : [];
    // console.log(existedNumber, array);

    limit = limit ? limit : array ? array.length : 0;
    if (limit) {
      limit = array.length < limit ? array.length : limit;
    } else {
      limit = array ? array.length : 0;
    }

    offset = offset ? offset : 0;

    let result = [];
    for (let i = offset; i < +limit + +offset; i++) {
      if (array[i] != null) {
        result.push(array[i]);
      }
    }
    // console.log(result);

    return result;
  }
}

module.exports = SAPRepository;
