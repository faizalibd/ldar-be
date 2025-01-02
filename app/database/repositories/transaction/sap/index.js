const { api } = require("../../../../api");

class SAPRepository {
  constructor() {}

  async get(limit = null, offset = 0, type, number) {
    let typeUpperCase = type.toUpperCase();
    let array = await api.sap.referensi.get(number, typeUpperCase);
    limit = limit ? limit : array ? array.length : 0;

    let result = [];
    for (let i = offset; i < +limit + +offset; i++) {
      result.push(array[i]);
    }
    console.log(result);

    return result;
  }
}

module.exports = SAPRepository;
