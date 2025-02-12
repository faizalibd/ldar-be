const { reference: sql } = require("../../sql");

class MenuRepository {
  constructor(db) {
    this.db = db;
  }

  async get(id, parentId, name, code, status, sub, limit, offset) {
    let condition = " WHERE 1=1";
    let orderby = " ORDER BY C_LDAR_SORTMENU";
    let values = {};
    let rows = "";

    if (id) {
      condition += " AND I_ID_LDARMENU = :id";
      values.id = id;
    }
    if (parentId) {
      condition += " AND I_ID_PARENT = :parentId";
      values.parentId = parentId;
    }
    if (name) {
      condition += " AND N_LDAR_MENU LIKE '%' || :name || '%'";
      values.name = name;
    }
    if (code) {
      condition += " AND C_LDAR_SORTMENU = :code";
      values.code = code;
    }
    if (status) {
      condition += " AND C_LDAR_ACTMENU = :status";
      values.status = status;
    }
    if (limit) {
      rows = " OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY";
      values.offset = offset ? offset : 0;
      values.limit = limit;
    }

    if (sub) {
      return await this.checkChild(
        (
          await this.db.execute(
            "dbapdm",
            sql.menu.select + condition + " AND I_ID_PARENT IS NULL" + orderby,
            values
          )
        ).rows,
        status
      );
    } else {
      return (
        await this.db.execute(
          "dbapdm",
          sql.menu.select + condition + orderby + rows,
          values
        )
      ).rows;
    }
  }

  async checkChild(parent, status) {
    let condition = " WHERE 1=1";
    let values = {};
    let orderby = " ORDER BY C_LDAR_SORTMENU";

    if (status) {
      condition += " AND C_LDAR_ACTMENU = :status";
      values.status = status;
    }

    return Promise.all(
      parent.map(async (d) => {
        let child = (
          await this.db.execute(
            "dbapdm",
            sql.menu.select +
              condition +
              " AND I_ID_PARENT = " +
              d.id +
              orderby,
            values
          )
        ).rows;
        if (child) {
          child = await this.checkChild(child, status);
        }
        d.sub = child;
        return d;
      })
    );
  }

  async exists(id, parentId, name, code, status, idNot) {
    let condition = " WHERE 1=1";
    let values = {};
    if (id) {
      condition += " AND I_ID_LDARMENU = :id";
      values.id = id;
    }
    if (parentId) {
      condition += " AND I_ID_PARENT = :parentId";
      values.parentId = parentId;
    }
    if (name) {
      condition += " AND N_LDAR_MENU = :name";
      values.name = name;
    }
    if (code) {
      condition += " AND C_LDAR_SORTMENU = :code";
      values.code = code;
    }
    if (status) {
      condition += " AND I_status_LDARAPRVTYPE = :status";
      values.status = status;
    }
    if (idNot == 0 || idNot) {
      condition += " AND I_ID_LDARMENU != :idNot";
      values.idNot = idNot;
    }
    return (
      await this.db.execute("dbapdm", sql.menu.exists + condition, values)
    ).rows[0].ct;
  }

  async add({ body: values }) {
    values.parentId = values.parentId ? values.parentId : null;
    values.url = values.url ? values.url : null;
    values.icon = values.icon ? values.icon : null;
    return await this.db
      .execute("dbapdm", sql.menu.insert, values, { autoCommit: true })
      .then(async () => (await this.get("", "", "", values.code))[0])
      .catch((err) => {
        throw err;
      });
  }

  async update({ route: { path }, body: values }) {
    let query;
    switch (path) {
      case "/menu":
        query = sql.menu.update;
        values.parentId = values.parentId ? values.parentId : null;
        values.url = values.url ? values.url : null;
        values.icon = values.icon ? values.icon : null;
        break;
      case "/menu/status":
        query = sql.menu.update_status;
        break;
    }
    return await this.db
      .execute("dbapdm", query, values, { autoCommit: true })
      .then(async () => (await this.get(values.id))[0])
      .catch((err) => {
        throw err;
      });
  }

  async delete({ body: { id } }) {
    await this.db
      .execute("dbapdm", sql.menu.delete, { id: id }, { autoCommit: true })
      .catch((err) => {
        throw err;
      });
  }
}

module.exports = MenuRepository;
