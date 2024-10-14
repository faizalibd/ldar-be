const { transaction: sql } = require("../../../sql");

class DrawingRepository {
  constructor(db) {
    this.db = db;
  }

  async get(
    id,
    LDARId,
    drawingNumber,
    adcn,
    drawingSheet,
    entry,
    limit,
    offset
  ) {
    let condition = " WHERE 1=1";
    let orderby = " ORDER BY 1";
    let values = {};
    let rows = "";

    if (id) {
      condition += " AND I_ID_LDARDRAW = :id";
      values.id = id;
    }
    if (LDARId) {
      condition += " AND I_ID_LDAR = :LDARId";
      values.LDARId = LDARId;
    }
    if (drawingNumber) {
      condition += " AND I_LDAR_DRAWDISPO = :drawingNumber";
      values.drawingNumber = drawingNumber;
    }
    if (adcn) {
      condition += " AND I_LDAR_ADCNDCN = :adcn";
      values.adcn = adcn;
    }
    if (drawingSheet) {
      condition += " AND I_LDAR_DRAWSHEET = :drawingSheet";
      values.drawingSheet = drawingSheet;
    }
    if (entry) {
      condition += " AND I_ENTRY = :entry";
      values.entry = entry;
    }
    if (limit) {
      rows = " OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY";
      values.offset = offset ? offset : 0;
      values.limit = limit;
    }

    return (
      await this.db.execute(
        "dbapdm",
        sql.ldar.drawing.select + condition + orderby + rows,
        values
      )
    ).rows;
  }

  async exists(id, LDARId, drawingNumber, adcn, drawingSheet, entry, idNot) {
    let condition = " WHERE 1=1";
    let values = {};
    if (id) {
      condition += " AND I_ID_LDARDRAW = :id";
      values.id = id;
    }
    if (LDARId) {
      condition += " AND I_ID_LDAR = :LDARId";
      values.LDARId = LDARId;
    }
    if (drawingNumber) {
      condition += " AND I_LDAR_DRAWDISPO = :drawingNumber";
      values.drawingNumber = drawingNumber;
    }
    if (adcn) {
      condition += " AND I_LDAR_ADCNDCN = :adcn";
      values.adcn = adcn;
    }
    if (drawingSheet) {
      condition += " AND I_LDAR_DRAWSHEET = :drawingSheet";
      values.drawingSheet = drawingSheet;
    }
    if (entry) {
      condition += " AND I_ENTRY = :entry";
      values.entry = entry;
    }
    if (idNot == 0 || idNot) {
      condition += " AND I_ID_LDARDRAW != :idNot";
      values.idNot = idNot;
    }
    return (
      await this.db.execute(
        "dbapdm",
        sql.ldar.drawing.exists + condition,
        values
      )
    ).rows[0].ct;
  }

  async add({ body: values }) {
    return await this.db
      .execute("dbapdm", sql.ldar.drawing.insert, values, { autoCommit: true })
      .then(
        async () => (await this.get("", values.LDARId, values.drawingNumber))[0]
      )
      .catch((err) => {
        throw err;
      });
  }

  async update({ body: values }) {
    return await this.db
      .execute("dbapdm", sql.ldar.drawing.update, values, { autoCommit: true })
      .then(async () => (await this.get(values.id))[0])
      .catch((err) => {
        throw err;
      });
  }

  async delete({ body: { id } }) {
    await this.db
      .execute(
        "dbapdm",
        sql.ldar.drawing.delete,
        { id: id },
        { autoCommit: true }
      )
      .catch((err) => {
        throw err;
      });
  }
}

module.exports = DrawingRepository;
