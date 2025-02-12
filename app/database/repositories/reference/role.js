const { reference: sql } = require("../../sql");

class RoleRepository {
  constructor(db) {
    this.db = db;
  }

  async get(id, name, limit, offset) {
    let condition = " WHERE 1=1";
    let orderby = " ORDER BY 1";
    let values = {};
    let rows = "";

    if (id) {
      condition += " AND I_ID_LDARROLE = :id";
      values.id = id;
    }
    if (name) {
      condition += " AND N_ROLE = :name";
      values.name = name;
    }
    if (limit) {
      rows = " OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY";
      values.offset = offset ? offset : 0;
      values.limit = limit;
    }

    return (
      await this.db.execute(
        "dbapdm",
        sql.role.select + condition + orderby + rows,
        values
      )
    ).rows;
  }

  async exists(id, name, idNot) {
    let condition = " WHERE 1=1";
    let values = {};
    if (id) {
      condition += " AND I_ID_LDARROLE = :id";
      values.id = id;
    }
    if (name) {
      condition += " AND N_ROLE = :name";
      values.name = name;
    }
    if (idNot == 0 || idNot) {
      condition += " AND I_ID_LDARROLE != :idNot";
      values.idNot = idNot;
    }
    return (
      await this.db.execute("dbapdm", sql.role.exists + condition, values)
    ).rows[0].ct;
  }

  async add({ body: values }) {
    return await this.db
      .execute("dbapdm", sql.role.insert, values, { autoCommit: true })
      .then(async () => (await this.get("", values.name))[0])
      .catch((err) => {
        throw err;
      });
  }

  async update({ body: values }) {
    return await this.db
      .execute("dbapdm", sql.role.update, values, { autoCommit: true })
      .then(async () => (await this.get(values.id))[0])
      .catch((err) => {
        throw err;
      });
  }

  async delete({ body: { id } }) {
    await this.db
      .execute("dbapdm", sql.role.delete, { id: id }, { autoCommit: true })
      .catch((err) => {
        throw err;
      });
  }
}

module.exports = RoleRepository;
