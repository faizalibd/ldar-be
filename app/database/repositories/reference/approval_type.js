const { reference: sql } = require("../../sql");

class ApprovalTypeRepository {
  constructor(db) {
    this.db = db;
  }

  async get(code, description, limit, offset) {
    let condition = " WHERE 1=1";
    let orderby = " ORDER BY 1";
    let values = {};
    let rows = "";

    if (code) {
      condition += " AND I_ID_LDARAPRVTYPE = :code";
      values.code = code;
    }
    if (description) {
      condition += " AND E_LDAR_APRVTYPE LIKE '%' || :description || '%'";
      values.description = description;
    }
    if (limit) {
      rows = " OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY";
      values.offset = offset ? offset : 0;
      values.limit = limit;
    }

    return (
      await this.db.execute(
        "dbapdm",
        sql.approval_type.select + condition + orderby + rows,
        values
      )
    ).rows;
  }

  async exists(code, description, codeNot) {
    let condition = " WHERE 1=1";
    let values = {};
    if (code) {
      condition += " AND I_ID_LDARAPRVTYPE = :code";
      values.code = code;
    }
    if (description) {
      condition += " AND E_LDAR_APRVTYPE = :description";
      values.description = description;
    }
    if (codeNot == 0 || codeNot) {
      condition += " AND I_ID_LDARAPRVTYPE != :codeNot";
      values.codeNot = codeNot;
    }
    return (
      await this.db.execute(
        "dbapdm",
        sql.approval_type.exists + condition,
        values
      )
    ).rows[0].ct;
  }

  async add({ body: values }) {
    return await this.db
      .execute("dbapdm", sql.approval_type.insert, values, { autoCommit: true })
      .then(async () => (await this.get(values.code))[0])
      .catch((err) => {
        throw err;
      });
  }

  async update({ body: values }) {
    return await this.db
      .execute("dbapdm", sql.approval_type.update, values, { autoCommit: true })
      .then(async () => (await this.get(values.code))[0])
      .catch((err) => {
        throw err;
      });
  }

  async delete({ body: { code } }) {
    await this.db
      .execute(
        "dbapdm",
        sql.approval_type.delete,
        { code: code },
        { autoCommit: true }
      )
      .catch((err) => {
        throw err;
      });
  }
}

module.exports = ApprovalTypeRepository;
