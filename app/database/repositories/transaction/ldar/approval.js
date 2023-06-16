const { transaction: sql } = require("../../../sql");
const {
  create_dir,
  create_file,
  delete_file,
  download_file,
} = require("../../../../functions/common");
const { join } = require("path");

const dir = create_dir("Approval");

class ApprovalRepository {
  constructor(db) {
    this.db = db;
  }

  async get(id, LDARId, typeCode, nik, limit, offset) {
    let condition = " WHERE 1=1";
    let orderby = " ORDER BY 1";
    let values = {};
    let rows = "";

    if (id) {
      condition += " AND I_ID_LDARAPRV = :id";
      values.id = id;
    }
    if (LDARId) {
      condition += " AND I_ID_LDAR = :LDARId";
      values.LDARId = LDARId;
    }
    if (typeCode) {
      condition += " AND B.I_ID_LDARAPRVTYPE = :typeCode";
      values.typeCode = typeCode;
    }
    if (nik) {
      condition += " AND I_LDAR_APRV = :nik";
      values.nik = nik;
    }
    if (limit) {
      rows = " OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY";
      values.offset = offset ? offset : 0;
      values.limit = limit;
    }

    return (
      await this.db.execute(
        "dbapdm",
        sql.ldar.approval.select + condition + orderby + rows,
        values
      )
    ).rows;
  }

  async exists(id, LDARId, typeCode, nik, idNot) {
    let condition = " WHERE 1=1";
    let values = {};
    if (id) {
      condition += " AND I_ID_LDARAPRV = :id";
      values.id = id;
    }
    if (LDARId) {
      condition += " AND I_ID_LDAR = :LDARId";
      values.LDARId = LDARId;
    }
    if (typeCode) {
      condition += " AND B.I_ID_LDARAPRVTYPE = :typeCode";
      values.typeCode = typeCode;
    }
    if (nik) {
      condition += " AND I_LDAR_APRV = :nik";
      values.nik = nik;
    }
    if (idNot == 0 || idNot) {
      condition += " AND I_ID_LDARAPRV != :idNot";
      values.idNot = idNot;
    }
    return (
      await this.db.execute(
        "dbapdm",
        sql.ldar.approval.exists + condition,
        values
      )
    ).rows[0].ct;
  }

  async add({ body: values }) {
    return await this.add_func(values);
  }

  async add_func(values) {
    return await this.db
      .execute("dbapdm", sql.ldar.approval.insert, values, { autoCommit: true })
      .then(async () => (await this.get("", values.LDARId, "0", values.nik))[0])
      .catch((err) => {
        throw err;
      });
  }

  async update({ body: values, file }) {
    values.file = file ? file.originalname : "";

    return await this.db
      .execute("dbapdm", sql.ldar.approval.update, values, { autoCommit: true })
      .then(async () => {
        if (file) {
          create_file(join(dir, values.id), file);
        }
      })
      .then(async () => (await this.get(values.id))[0])
      .catch((err) => {
        throw err;
      });
  }

  async delete({ body: { id } }) {
    var approval = (await this.get(id))[0];
    await this.db
      .execute(
        "dbapdm",
        sql.ldar.approval.delete,
        { id: id },
        { autoCommit: true }
      )
      .then(async () => {
        delete_file(join(dir, id), approval.file, true);
      })
      .catch((err) => {
        throw err;
      });
  }

  async download(id) {
    let approval = (await this.get(id))[0];
    return download_file(join(dir, id), approval.file);
  }
}

module.exports = ApprovalRepository;
