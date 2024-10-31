const { api } = require("../../../../api");
const { transaction: sql } = require("../../../sql");
const {
  create_dir,
  create_file,
  delete_file,
  download_file,
} = require("../../../../functions/common");
const { join } = require("path");
const { email } = require("../../../../functions");
const { log } = require("console");

const dir = create_dir("Approval");

class ApprovalRepository {
  constructor(db) {
    this.db = db;
  }

  async get(id, LDARId, typeCode, nik, role, limit, offset) {
    const employees = await api.info.employee.get();
    let condition = " WHERE 1=1";
    let orderby = " ORDER BY 1";
    let values = {};
    let rows = "";

    if (id) {
      condition += " AND I_ID_LDARAPRV = :id";
      values.id = id;
    }
    if (LDARId) {
      condition += " AND B.I_ID_LDAR = :LDARId";
      values.LDARId = LDARId;
    }
    if (typeCode) {
      condition +=
        " AND C.I_ID_LDARAPRVTYPE IN (" +
        typeCode
          .split(",")
          .map((d) => {
            return "'" + d + "'";
          })
          .join(",") +
        ")";
    }
    if (nik) {
      condition += " AND I_LDAR_APRV = :nik";
      values.nik = nik;
    }
    if (role) {
      condition += " AND E.N_ROLE = :role";
      values.role = role;
    }
    if (limit) {
      rows = " OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY";
      values.offset = offset ? offset : 0;
      values.limit = limit;
    }

    return await Promise.all(
      (
        await this.db.execute(
          "dbapdm",
          sql.ldar.approval.select + condition + orderby + rows,
          values
        )
      ).rows.map(async (r) => {
        let employee = employees.filter((employee) => {
          return employee.nik == r.nik;
        });
        r.nama = employee && employee.length > 0 ? employee[0].nama : "-";
        return r;
      })
    );
  }

  async exists(id, LDARId, typeCode, nik, idNot, nikNot) {
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
      condition += " AND I_ID_LDARAPRVTYPE = :typeCode";
      values.typeCode = typeCode;
    }
    if (nik) {
      condition += " AND I_LDAR_APRV = :nik";
      values.nik = nik;
    }
    if (idNot) {
      condition += " AND I_ID_LDARAPRV != :idNot";
      values.idNot = idNot;
    }
    if (nikNot) {
      condition += " AND I_LDAR_APRV != :nikNot";
      values.nikNot = nikNot;
    }

    return (
      await this.db.execute(
        "dbapdm",
        sql.ldar.approval.exists + condition,
        values
      )
    ).rows[0].ct;
  }

  // INI FUNGSI UNTUK ADD DE DOANG CUY
  async add({ body: values }) {
    let result = this.add_func(values);
    let from = process.env.EMAIL_FROM;
    let to = (await api.info.employee.get(values.nik))[0].email;
    let cc;
    let subject = "Email to DE (Assigned DE)";
    let text = `PLEASE REVIEW THE ATTACHED REQUEST problem and record your disposition.`;

    if (process.env.EMAIL == "FALSE") {
      text += `<br/><br/> REAL TO EMAIL: ${to}`;
      to = process.env.EMAIL_DUMMY;
    }
    email.sendMail(from, to, cc, subject, "", text);
    return result;
  }

  async add_func(values) {
    return await this.db
      .execute("dbapdm", sql.ldar.approval.insert, values, {
        autoCommit: true,
      })
      .then(async () => (await this.get("", values.LDARId, 0, values.nik))[0])
      .catch((err) => {
        throw err;
      });
  }

  async update({ body: values, file }) {
    return this.update_func(values, file);
  }

  async update_func(values, file) {
    const ldar = (await this.get(values.id))[0];
    let flag = 0;
    if (file) {
      // File di replace
      flag = 1;
      values.fileName = file.originalname;
    } else if (values.fileName) {
      // File tetap
      flag = 2;
    } else if (ldar.fileName) {
      // File di hapus
      flag = 3;
      values.fileName = "";
    }

    return await this.db
      .execute("dbapdm", sql.ldar.approval.update, values, { autoCommit: true })
      .then(async () => {
        switch (flag) {
          case 1:
            if (ldar.fileName) {
              delete_file(join(dir, values.id), ldar.fileName, true);
            }
            create_file(join(dir, values.id), file);
            break;
          case 3:
            delete_file(join(dir, values.id), ldar.fileName, true);
            break;
        }
      })
      .then(async () => (await this.get(values.id))[0])
      .catch((err) => {
        throw err;
      });
  }

  async delete({ body: { id } }) {
    await this.delete_func(id);
  }

  async delete_func(id, LDARId, nik, file) {
    let condition = " WHERE 1=1" + " AND I_ID_LDARAPRVTYPE = 0";
    let values = {};
    if (id) {
      condition += " AND I_ID_LDARAPRV = :id";
      values.id = id;
    } else {
      condition += " AND I_ID_LDAR = :LDARId AND I_LDAR_APRV = :nik";
      values.LDARId = LDARId;
      values.nik = nik;
    }

    await this.db
      .execute("dbapdm", sql.ldar.approval.delete + condition, values, {
        autoCommit: true,
      })
      .then(async () => {
        if (id && file) {
          delete_file(join(dir, id), file, true);
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  async download(id) {
    let data = (await this.get(id))[0];
    return download_file(join(dir, id), data.fileName);
  }
}

module.exports = ApprovalRepository;
