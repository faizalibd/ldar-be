const { transaction: sql } = require("../../../sql");
const {
  create_dir,
  create_file,
  delete_file,
  download_file,
} = require("../../../../functions/common");
const { join } = require("path");

const dir = create_dir("File");

class FileRepository {
  constructor(db) {
    this.db = db;
  }

  async get(id, LDARId, name, group, limit, offset) {
    let condition = " WHERE 1=1";
    let orderby = " ORDER BY 1";
    let values = {};
    let rows = "";

    if (id) {
      condition += " AND I_ID_LDARFILE = :id";
      values.id = id;
    }
    if (LDARId) {
      condition += " AND I_ID_LDAR = :LDARId";
      values.LDARId = LDARId;
    }
    if (name) {
      condition += " AND B.N_LDAR_FILENAME = :name";
      values.name = name;
    }
    if (group) {
      condition += " AND C_LDAR_FILEGRP = :group";
      values.group = group;
    }
    if (limit) {
      rows = " OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY";
      values.offset = offset ? offset : 0;
      values.limit = limit;
    }

    return (
      await this.db.execute(
        "dbapdm",
        sql.ldar.file.select + condition + orderby + rows,
        values
      )
    ).rows;
  }

  async exists(id, LDARId, name, group, idNot) {
    let condition = " WHERE 1=1";
    let values = {};
    if (id) {
      condition += " AND I_ID_LDARFILE = :id";
      values.id = id;
    }
    if (LDARId) {
      condition += " AND I_ID_LDAR = :LDARId";
      values.LDARId = LDARId;
    }
    if (name) {
      condition += " AND B.N_LDAR_FILENAME = :name";
      values.name = name;
    }
    if (group) {
      condition += " AND C_LDAR_FILEGRP = :group";
      values.group = group;
    }
    if (idNot == 0 || idNot) {
      condition += " AND I_ID_LDARFILE != :idNot";
      values.idNot = idNot;
    }
    return (
      await this.db.execute("dbapdm", sql.ldar.file.exists + condition, values)
    ).rows[0].ct;
  }

  async add({ body: values }) {
    return await this.db
      .execute("dbapdm", sql.ldar.file.insert, values, { autoCommit: true })
      .then(
        async () =>
          (
            await this.get("", values.LDARId, values.name, values.group)
          )[0]
      )
      .catch((err) => {
        throw err;
      });
  }

  async update({ body: values }) {
    return await this.db
      .execute("dbapdm", sql.ldar.file.update, values, { autoCommit: true })
      .then(async () => (await this.get(values.id))[0])
      .catch((err) => {
        throw err;
      });
  }

  async delete({ body: { id } }) {
    await this.db
      .execute("dbapdm", sql.ldar.file.delete, { id: id }, { autoCommit: true })
      .then(async () => {
        delete_file(join(dir, id), approval.file, true);
      })
      .catch((err) => {
        throw err;
      });
  }

  async download(id) {
    let file = (await this.get(id))[0];
    return download_file(join(dir, id), file.name);
  }
}

module.exports = FileRepository;
