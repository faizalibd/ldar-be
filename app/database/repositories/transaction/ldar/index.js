const { api } = require("../../../../api");
const { transaction: sql } = require("../../../sql");
const { email } = require("../../../../functions");
const ApprovalRepository = require("./approval");

class LDARRepository {
  constructor(db, userRoleRepo) {
    this.db = db;
    this.userRoleRepo = userRoleRepo;
    this.approval = new ApprovalRepository(db);
  }

  async get(
    id,
    number,
    modelCode,
    nik,
    submittedNik,
    submittedDate,
    LSNUnit,
    EDMNik,
    refCode,
    refNumber,
    PENik,
    PEDate,
    group,
    version,
    drawingNumber,
    drawingIndex,
    status,
    statusDate,
    limit,
    offset
  ) {
    let condition = " WHERE 1=1";
    let orderby = " ORDER BY 1";
    let values = {};
    let rows = "";

    if (id) {
      condition += " AND I_ID_LDAR = :id";
      values.id = id;
    }
    if (number) {
      condition += " AND I_LDAR LIKE '%' || :number || '%'";
      values.number = number;
    }
    if (modelCode) {
      condition += " AND C_PGM_MODEL = :modelCode";
      values.modelCode = modelCode;
    }
    if (nik) {
      condition +=
        " AND (I_ENTRY = :nik OR I_LDAR_TOSPV = :nik OR I_LDAR_ATTENTION = :nik)";
      values.nik = nik;
    }
    if (submittedNik) {
      condition += " AND I_ENTRY = :submittedNik";
      values.submittedNik = submittedNik;
    }
    if (submittedDate) {
      condition += " AND TO_CHAR(D_ENTRY, 'YYYY-MM-DD') = :submittedDate";
      values.submittedDate = submittedDate;
    }
    if (LSNUnit) {
      condition += " AND C_LDAR_LSNUNIT = :LSNUnit";
      values.LSNUnit = LSNUnit;
    }
    if (EDMNik) {
      condition += " AND I_LDAR_TOSPV = :EDMNik";
      values.EDMNik = EDMNik;
    }
    if (refCode) {
      condition += " AND C_LDAR_REFBY = :refCode";
      values.refCode = refCode;
    }
    if (refNumber) {
      condition += " AND I_LDAR_REFBY LIKE '%' || :refNumber || '%'";
      values.refNumber = refNumber;
    }
    if (PENik) {
      condition += " AND I_LDAR_ATTENTION = :PENik";
      values.PENik = PENik;
    }
    if (PEDate) {
      condition += " AND TO_CHAR(D_LDAR_ATTENTION, 'YYYY-MM-DD') = :PEDate";
      values.PEDate = PEDate;
    }
    if (group) {
      condition += " AND N_LDAR_GRP LIKE '%' || :group || '%'";
      values.group = group;
    }
    if (version) {
      condition += " AND C_LDAR_VER = :version";
      values.version = version;
    }
    if (drawingNumber) {
      condition += " AND I_DRAW LIKE '%' || :drawingNumber || '%'";
      values.drawingNumber = drawingNumber;
    }
    if (drawingIndex) {
      condition += " AND C_LDAR_IDX = :drawingIndex";
      values.drawingIndex = drawingIndex;
    }
    if (status) {
      condition +=
        " AND C_LDAR_STAT IN (" +
        status
          .split(",")
          .map((d) => {
            return "'" + d + "'";
          })
          .join(",") +
        ")";
    }
    if (statusDate) {
      condition += " AND TO_CHAR(D_LDAR_STAT, 'YYYY-MM-DD') = :statusDate";
      values.statusDate = statusDate;
    }
    if (limit) {
      rows = " OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY";
      values.offset = offset ? offset : 0;
      values.limit = limit;
    }

    return (
      await this.db.execute(
        "dbapdm",
        sql.ldar.select + condition + orderby + rows,
        values
      )
    ).rows;
  }

  async exists(
    id,
    number,
    modelCode,
    nik,
    submittedNik,
    submittedDate,
    LSNUnit,
    EDMNik,
    refCode,
    refNumber,
    PENik,
    PEDate,
    group,
    version,
    drawingNumber,
    drawingIndex,
    status,
    statusDate,
    idNot
  ) {
    let condition = " WHERE 1=1";
    let values = {};
    if (id) {
      condition += " AND I_ID_LDAR = :id";
      values.id = id;
    }
    if (number) {
      condition += " AND I_LDAR = :number";
      values.number = number;
    }
    if (modelCode) {
      condition += " AND C_PGM_MODEL = :modelCode";
      values.modelCode = modelCode;
    }
    if (nik) {
      condition +=
        " AND (I_ENTRY = :nik OR I_LDAR_TOSPV = :nik OR I_LDAR_ATTENTION = :nik)";
      values.nik = nik;
    }
    if (submittedNik) {
      condition += " AND I_ENTRY = :submittedNik";
      values.submittedNik = submittedNik;
    }
    if (submittedDate) {
      condition += " AND TO_CHAR(D_ENTRY, 'YYYY-MM-DD') = :submittedDate";
      values.submittedDate = submittedDate;
    }
    if (LSNUnit) {
      condition += " AND C_LDAR_LSNUNIT = :LSNUnit";
      values.LSNUnit = LSNUnit;
    }
    if (EDMNik) {
      condition += " AND I_LDAR_TOSPV = :EDMNik";
      values.EDMNik = EDMNik;
    }
    if (refCode) {
      condition += " AND C_LDAR_REFBY = :refCode";
      values.refCode = refCode;
    }
    if (refNumber) {
      condition += " AND I_LDAR_REFBY = :refNumber";
      values.refNumber = refNumber;
    }
    if (PENik) {
      condition += " AND I_LDAR_ATTENTION = :PENik";
      values.PENik = PENik;
    }
    if (PEDate) {
      condition += " AND TO_CHAR(D_LDAR_ATTENTION, 'YYYY-MM-DD') = :PEDate";
      values.PEDate = PEDate;
    }
    if (group) {
      condition += " AND N_LDAR_GRP = :group";
      values.group = group;
    }
    if (version) {
      condition += " AND C_LDAR_VER = :version";
      values.version = version;
    }
    if (drawingNumber) {
      condition += " AND I_DRAW = :drawingNumber";
      values.drawingNumber = drawingNumber;
    }
    if (drawingIndex) {
      condition += " AND C_LDAR_IDX = :drawingIndex";
      values.drawingIndex = drawingIndex;
    }
    if (status) {
      condition +=
        " AND C_LDAR_STAT IN (" +
        status
          .split(",")
          .map((d) => {
            return "'" + d + "'";
          })
          .join(",") +
        ")";
    }
    if (statusDate) {
      condition += " AND TO_CHAR(D_LDAR_STAT, 'YYYY-MM-DD') = :statusDate";
      values.statusDate = statusDate;
    }
    if (idNot == 0 || idNot) {
      condition += " AND I_ID_LDAR != :idNot";
      values.idNot = idNot;
    }
    return (
      await this.db.execute("dbapdm", sql.ldar.exists + condition, values)
    ).rows[0].ct;
  }

  async add({ body: values }) {
    let submittedBy = await api.info.employee.get(values.insertUser);
    values.submittedBy = submittedBy[0].nama;
    values.LSNUnit = submittedBy[0].organisasi;
    return await this.db
      .execute("dbapdm", sql.ldar.insert, values, { autoCommit: true })
      .then(async () => (await this.get("", values.number))[0])
      .catch((err) => {
        throw err;
      });
  }

  async update({ url, body: values }) {
    let query;
    let employee;
    switch (url) {
      case "/":
        employee = await api.info.employee.get(values.updateUser);
        values.submittedBy = employee[0].nama;
        values.LSNUnit = employee[0].organisasi;
        query = sql.ldar.update_eli;
        break;
      case "/edm":
        employee = await api.info.employee.get(values.PENik);
        values.PEName = employee[0].nama;
        employee = await api.info.employee.get(values.updateUser);
        values.EDMName = employee[0].nama;
        query = sql.ldar.update_edm;
        break;
      case "/pe":
        query = sql.ldar.update_pe;
        break;
      case "/pe/accepted":
        query = sql.ldar.update_pe_accepted;
        break;
      case "/status":
        let result = await this.updateStatus(values);
        let code;
        let to;

        switch (values.status) {
          case "1":
            code = 1;
            to = (
              await Promise.all(
                (
                  await this.userRoleRepo.get("", "", "EDM")
                )[0].user.map(async (u) => {
                  return u.email;
                })
              )
            ).join(",");
            break;
          case "2":
            code = 2;
            to = (await api.info.employee.get(result.PENik))[0].email;
            break;
          case "4":
            const { de, ...values } = values;
            code = 3;
            to = await Promise.all(
              de.map(async (e) => {
                return await this.approval
                  .add_func({
                    LDARId: values.id,
                    nik: e.nik,
                    insertUser: values.updateUser,
                  })
                  .then(async () => {
                    return (await api.info.employee.get(e.nik))[0].email;
                  });
              })
            ).join(",");
            break;
          case "7":
            code = 4;
            to = (
              await Promise.all(
                (
                  await this.userRoleRepo.get("", "", "AWOP")
                )[0].user.map(async (u) => {
                  return u.email;
                })
              )
            ).join(",");
            break;
          case "8":
            code = 5;
            to = (await api.info.employee.get(result.EDMNik))[0].email;
            break;
          case "9":
            code = 6;
            to =
              (await api.info.employee.get(result.PENik))[0].email +
              "," +
              (await api.info.employee.get(result.EDMNik))[0].email;
            break;
          case "10":
            code = 7;
            to =
              (await api.info.employee.get(result.PENik))[0].email +
              "," +
              (await api.info.employee.get(result.EDMNik))[0].email;
            break;
          case "11":
            code = 8;
            to = (await api.info.employee.get(result.submittedNik))[0].email;
            break;
        }

        if (code) {
          await this.email(code, to);
        }

        return result;
      default:
        return false;
    }

    return await this.db
      .execute("dbapdm", query, values, { autoCommit: true })
      .then(async () => (await this.get(values.id))[0])
      .catch((err) => {
        throw err;
      });
  }

  async updateStatus(values) {
    return await this.db
      .execute("dbapdm", sql.ldar.update_status, values, { autoCommit: true })
      .then(async () => (await this.get(values.id))[0])
      .catch((err) => {
        throw err;
      });
  }

  async delete({ body: { id } }) {
    await this.db
      .execute("dbapdm", sql.ldar.delete, { id: id }, { autoCommit: true })
      .catch((err) => {
        throw err;
      });
  }

  async email(code, toParam) {
    let from = process.env.EMAIL_FROM;
    let to = toParam;
    let cc;
    let subject;
    let text;

    switch (code) {
      case 1:
        subject = "Email to EDM (All EDM)";
        text = "Email to EDM (All EDM)";
        break;
      case 2:
        subject = "Email to PE (Assigned PE)";
        text = "Email to PE (Assigned PE)";
        break;
      case 3:
        subject = "Email to DE (Assigned DE)";
        text = "Email to DE (Assigned DE)";
        break;
      case 4:
        subject = "Email to AWO Panel (Approve PE)";
        text = "Email to AWO Panel (Approve PE)";
        break;
      case 5:
        subject = "Email to EDM (Reject PE)";
        text = "Email to EDM (Reject PE)";
        break;
      case 6:
        subject = "Email to PE & EDM (Approve AWO Panel)";
        text = "Email to PE (Approve AWO Panel)";
        break;
      case 7:
        subject = "Email to PE & EDM (Reject AWO Panel)";
        text = "Email to PE (Reject AWO Panel)";
        break;
      case 8:
        subject = "Email to ELI (Closing)";
        text = "Email to ELI (Closing)";
        break;
    }

    if (process.env.EMAIL == "FALSE") {
      text += `<br/><br/> REAL TO EMAIL: ${to}`;
      to = process.env.EMAIL_DUMMY;
    }
    email.sendMail(from, to, cc, subject, "", text);
  }
}

module.exports = LDARRepository;
