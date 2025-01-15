const { reference: sql } = require("../../sql");
const { api } = require("../../../api");

class UserRoleRepository {
  constructor(db, roleMenuRepo) {
    this.db = db;
    this.roleMenuRepo = roleMenuRepo;
  }

  async get(nik, roleId, role, new_user, limit, offset) {
    let condition = " WHERE 1=1";
    let orderby = " ORDER BY 1";
    let values = {};
    let rows = "";
    let response = [];

    if (!new_user) {
      if (nik) {
        condition += " AND I_EMP = :nik";
        values.nik = nik;
      }
      if (roleId) {
        condition += " AND B.I_ID_LDARROLE = :roleId";
        values.roleId = roleId;
      }
      if (role) {
        // condition += " AND B.N_ROLE = :role";
        // values.role = role;

        condition +=
          " AND B.I_ID_LDARROLE IN (" +
          role
            .split(",")
            .map((d) => {
              return "'" + d + "'";
            })
            .join(",") +
          ")";
      }
      if (limit) {
        rows = " OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY";
        values.offset = offset ? offset : 0;
        values.limit = limit;
      }
    }

    let result = (
      await this.db.execute(
        "dbapdm",
        sql.user_role.select_nik + condition + orderby + rows,
        values
      )
    ).rows;

    let users = await api.info.employee.get();

    if (new_user) {
      if (result) {
        response = users.filter((u) => {
          return !result.find((r) => {
            return u.nik == r.nik;
          });
        });
      } else {
        response = users;
      }
    } else if (result && result.length > 0) {
      if (nik && (roleId || role)) {
        response = await api.info.employee.get(nik);
        if (response && response.length > 0) {
          response[0].role = await this.roleMenuRepo.get(roleId, role);
        }
      } else if (nik) {
        response = await api.info.employee.get(nik);
        if (response && response.length > 0) {
          response[0].role = await Promise.all(
            (
              await this.getRole(nik)
            ).map(async (r) => (await this.roleMenuRepo.get(r.id))[0])
          );
        }
      } else if (roleId || role) {
        response = await this.getRole("", roleId, role);

        if (response && response.length > 0) {
          response[0].user = await Promise.all(
            result.map(
              async (r) =>
                (await users?.filter((x) => x.nik == r.nik)[0]) ?? "Not Found"
            )
          );
        }
      } else {
        response = await Promise.all(
          result.map(async (r) => {
            let user = await users?.filter((x) => x.nik == r.nik)[0];
            if (user) {
              user.role = await Promise.all(
                (
                  await this.getRole(r.nik)
                ).map(async (rr) => (await this.roleMenuRepo.get(rr.id))[0])
              );
            }
            return user ?? "Not Found";
          })
        );
      }
    }
    return response;
  }

  async getRole(nik, roleId, role) {
    let condition = " WHERE 1=1";
    let orderby = " ORDER BY 1";
    let values = {};

    if (nik) {
      condition += " AND I_EMP = :nik";
      values.nik = nik;
    }
    if (roleId) {
      condition += " AND B.I_ID_LDARROLE = :roleId";
      values.roleId = roleId;
    }
    if (role) {
      condition += " AND N_ROLE = :role";
      values.role = role;
    }

    return (
      await this.db.execute(
        "dbapdm",
        sql.user_role.select_role + condition + orderby,
        values
      )
    ).rows;
  }

  async exists(nik, roleId, role) {
    let condition = " WHERE 1=1";
    let values = {};
    if (nik) {
      condition += " AND I_EMP = :nik";
      values.nik = nik;
    }
    if (roleId) {
      condition += " AND B.I_ID_LDARROLE = :roleId";
      values.roleId = roleId;
    }
    if (role) {
      condition += " AND N_ROLE = :role";
      values.role = role;
    }
    return (
      await this.db.execute("dbapdm", sql.user_role.exists + condition, values)
    ).rows[0].ct;
  }

  async add({ body: { role, ...values } }) {
    await this.delete(values.nik).then(async () => {
      if (Array.isArray(role)) {
        role.forEach(async (r) => {
          await this.add_function({ roleId: r, ...values });
        });
      } else {
        await this.add_function({ roleId: role, ...values });
      }
    });
  }

  async add_function(values) {
    return await this.db
      .execute("dbapdm", sql.user_role.insert, values, { autoCommit: true })
      .catch((err) => {
        throw err;
      });
  }

  async delete(nik, roleId) {
    let condition = "";
    let values = { nik: nik };
    if (roleId) {
      condition = " AND I_ID_LDARROLE = :roleId";
      values.roleId = roleId;
    }
    await this.db
      .execute("dbapdm", sql.user_role.delete + condition, values, {
        autoCommit: true,
      })
      .catch((err) => {
        throw err;
      });
  }
}
module.exports = UserRoleRepository;
