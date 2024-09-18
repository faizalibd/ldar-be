const { api } = require("../../../../api");
const { transaction: sql } = require("../../../sql");
const { email } = require("../../../../functions");

class LDARRepository {
  constructor(db, userRole, approval, file) {
    this.db = db;
    this.userRole = userRole;
    this.approval = approval;
    this.file = file;
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
    typeCode,
    nikApproval,
    limit,
    offset
  ) {
    let additionalSelect = "";
    let from = ` FROM DBAPDM.TMLDAR A LEFT JOIN DBAPDM.TMLDARAPRV B ON A.I_ID_LDAR = B.I_ID_LDAR 
      LEFT JOIN DBAPDM.TMLDARFILE C ON
      A.I_ID_LDAR = C.I_ID_LDAR
      AND C.C_LDAR_FILEGRP = '1'
      LEFT JOIN DBAPDM.TMLDARFILE D ON
      A.I_ID_LDAR = D.I_ID_LDAR
      AND D.C_LDAR_FILEGRP = '2' `;
    let condition = " WHERE 1=1";
    let orderby = " ORDER BY 1";
    let values = {};
    let rows = "";

    if (id) {
      condition += " AND A.I_ID_LDAR = :id";
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
        " AND (A.I_ENTRY = :nik OR I_LDAR_TOSPV = :nik OR I_LDAR_ATTENTION = :nik OR I_LDAR_APRV = :nik)";
      values.nik = nik;
    }
    if (submittedNik) {
      condition += " AND A.I_ENTRY = :submittedNik";
      values.submittedNik = submittedNik;
    }
    if (submittedDate) {
      condition += " AND TO_CHAR(A.D_ENTRY, 'YYYY-MM-DD') = :submittedDate";
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
      // condition += " AND C_LDAR_REFBY = :refCode";
      // values.refCode = refCode;
      condition +=
        " AND C_LDAR_REFBY IN (" +
        refCode
          .split(",")
          .map((d) => {
            return "'" + d + "'";
          })
          .join(",") +
        ")";
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
    if (typeCode) {
      // condition += " AND I_ID_LDARAPRVTYPE = :typeCode";
      // values.typeCode = typeCode;

      condition +=
        " AND I_ID_LDARAPRVTYPE IN (" +
        typeCode
          .split(",")
          .map((d) => {
            return "'" + d + "'";
          })
          .join(",") +
        ")";
    }
    if (nikApproval) {
      condition += " AND I_LDAR_APRV = :nikApproval";
      values.nikApproval = nikApproval;
      additionalSelect = ", NVL(B.I_ID_LDARAPRV, '') as \"approvalId\"";
    }
    if (limit) {
      rows = " OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY";
      values.offset = offset ? offset : 0;
      values.limit = limit;
    }
    let result = (
      await this.db.execute(
        "dbapdm",
        sql.ldar.select + additionalSelect + from + condition + orderby + rows,
        values
      )
    ).rows;

    return await Promise.all(
      result.map(async (d) => {
        d.unit = (await api.info.employee.get(d.EDMNik))[0].organisasi;
        return d;
      })
    );
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
      // condition += " AND C_LDAR_REFBY = :refCode";
      // values.refCode = refCode;
      condition +=
        " AND C_LDAR_REFBY IN (" +
        refCode
          .split(",")
          .map((d) => {
            return "'" + d + "'";
          })
          .join(",") +
        ")";
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
      .then(
        async () =>
          (
            await this.get(
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              values.refCode,
              values.refNumber
            )
          )[0]
      )
      .catch((err) => {
        throw err;
      });
  }

  async update({ url, body: { nik, remark, AWOPNik, ...values }, file }) {
    let data;
    let query;
    let employee;
    switch (url) {
      case "/":
        // employee = await api.info.employee.get(values.updateUser);
        // values.submittedBy = employee[0].nama;
        // values.LSNUnit = employee[0].organisasi;
        query = sql.ldar.update_eli;
        values.remark = remark;

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
      case "/pe/manhour":
        query = sql.ldar.update_pe_manhour;
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
                  await this.userRole.get("", "", "EDM")
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
            code = 3;
            to = (
              await Promise.all(
                nik.map(async (n) => {
                  await this.approval.add_func({
                    LDARId: values.id,
                    nik: n,
                    insertUser: values.updateUser,
                  });
                  return (await api.info.employee.get(n))[0].email;
                })
              )
            ).join(",");
            await this.approval.add_func({
              LDARId: values.id,
              nik: result.PENik,
              insertUser: values.updateUser,
            });
            break;
          case "5":
            data = (
              await this.approval.get("", values.id, "", result.PENik)
            )[0];
            await this.approval.update_func(
              {
                id: data.id,
                typeCode: "3",
                remark: remark,
                updateUser: values.updateUser,
              },
              file
            );
            // if (result.refCode == 3) {
            //   await this.approval.add_func({
            //     LDARId: values.id,
            //     nik: AWOPNik,
            //     insertUser: values.updateUser,
            //   });
            //   code = 4;
            //   to = (await this.userRole.get(AWOPNik))[0].email;
            // }
            break;
          case "6":
            data = (
              await this.approval.get("", values.id, "", result.PENik)
            )[0];
            await this.approval.update_func(
              {
                id: data.id,
                typeCode: "4",
                remark: remark,
                updateUser: values.updateUser,
              },
              file
            );
            code = 5;
            to = (await api.info.employee.get(result.EDMNik))[0].email;
            break;
          case "7":
            data = (
              await this.approval.get("", values.id, "", values.updateUser)
            )[0];
            await this.approval.update_func(
              {
                id: data.id,
                typeCode: "5",
                remark: remark,
                updateUser: values.updateUser,
              },
              file
            );
            code = 6;
            to =
              (await api.info.employee.get(result.PENik))[0].email +
              "," +
              (await api.info.employee.get(result.EDMNik))[0].email;
            break;
          case "8":
            data = (
              await this.approval.get("", values.id, "", values.updateUser)
            )[0];
            await this.approval.update_func(
              {
                id: data.id,
                typeCode: "6",
                remark: remark,
                updateUser: values.updateUser,
              },
              file
            );
            code = 7;
            to =
              (await api.info.employee.get(result.PENik))[0].email +
              "," +
              (await api.info.employee.get(result.EDMNik))[0].email;
            break;
          case "9":
            code = 8;
            to = (await api.info.employee.get(result.submittedNik))[0].email;
            break;
        }

        if (code) {
          await this.email(code, to, result.number);
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

  async email(code, toParam, number) {
    let from = process.env.EMAIL_FROM;
    let to = toParam;
    let cc;
    let subject;
    let text;

    switch (code) {
      case 1:
        subject = "New LDAR";
        text = `Engineering Liaison has been registered LDAR number ${number}, please clarify & advise as soon as possible.`;
        break;
      case 2:
        subject = "Email to PE (Assigned PE)";
        text = `LDAR No. ${number} has been created by Liaison Engineer, Please review & check LDAR No. ${number}.`;
        break;
      case 3:
        subject = "Email to DE (Assigned DE)";
        text = `PLEASE REVIEW THE ATTACHED REQUEST problem and record your disposition.`;
        break;
      case 4:
        subject = "Email to AWO Panel (Approve PE)";
        text = `Problem on LDAR No. ${number} has been evaluated, please completed LDAR No. ${number} with justification.`;
        break;
      case 5:
        subject = "Email to EDM (Reject PE)";
        text = `Problem on LDAR No. ${number} has been completly checked, please release & distribution LDAR No. ${number}.`;
        break;
      case 6:
        subject = "Email to PE & EDM (Approve AWO Panel)";
        text = `LDAR No. ${number} has been completly checked, please see correction from design.`;
        break;
      case 7:
        subject = "Email to PE & EDM (Reject AWO Panel)";
        text = `LDAR No. ${number} need review disposition, Please check and justify.`;
        break;
      case 8:
        subject = "Email to ELI (Closing)";
        text = `LDAR No. ${number} has been completly checked, please use as a reference.`;
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
