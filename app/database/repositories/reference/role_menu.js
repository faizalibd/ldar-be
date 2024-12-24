const { reference: sql } = require("../../sql");

class RoleMenuRepository {
  constructor(db) {
    this.db = db;
  }

  async get(roleId, role, menuId, limit, offset) {
    let condition = " WHERE 1=1";
    let orderby = " ORDER BY 1";
    let values = {};
    let rows = "";
    let response = [];
    if (roleId) {
      condition += " AND B.I_ID_LDARROLE = :roleId";
      values.roleId = roleId;
    }
    if (role) {
      condition += " AND N_ROLE = :role";
      values.role = role;
    }
    if (menuId) {
      condition += " AND I_ID_LDARMENU = :menuId";
      values.menuId = menuId;
    }

    if (limit) {
      rows = " OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY";
      values.offset = offset ? offset : 0;
      values.limit = limit;
    }

    let result = (
      await this.db.execute(
        "dbapdm",
        sql.role_menu.select_role + condition + orderby + rows,
        values
      )
    ).rows;
    if (result && result.length > 0) {
      if (roleId && menuId) {
        response = result;
        response[0].menu = await this.getMenu(roleId, menuId);
      } else if (roleId) {
        response = result;
        response[0].menu = await this.checkChild(await this.getMenu(roleId));
      } else if (menuId) {
        response = await this.getMenu("", menuId);
        if (response) {
          response[0].role = result;
        }
      } else {
        response = await Promise.all(
          result.map(async (r) => {
            r.menu = await this.checkChild(await this.getMenu(r.id));
            return r;
          })
        );
      }
    }
    return response;
  }
  async getMenu(roleId, menuId) {
    let condition = " WHERE 1=1";
    let orderby = " ORDER BY 1";
    let values = {};
    if (roleId) {
      condition += " AND I_ID_LDARROLE = :roleId";
      values.roleId = roleId;
    }
    if (menuId) {
      condition += " AND B.I_ID_LDARMENU = :menuId";
      values.menuId = menuId;
    }

    return (
      await this.db.execute(
        "dbapdm",
        sql.role_menu.select_menu + condition + orderby,
        values
      )
    ).rows;
  }

  async checkChild(data) {
    let result = {};
    data.forEach((d) => {
      if (d.parentId !== undefined && d.parentId in result) {
        result[d.parentId].sub.push(d);
      } else {
        d["sub"] = [];
        result[d.id] = d;
      }
    });
    return Object.keys(result).map((r) => result[r]);
  }

  async exists(roleId, menuId) {
    let condition = " WHERE 1=1";
    let values = {};

    if (roleId) {
      condition += " AND I_ID_LDARROLE = :roleId";
      values.roleId = roleId;
    }
    if (menuId) {
      condition += " AND I_ID_LDARMENU = :menuId";
      values.menuId = menuId;
    }
    return (
      await this.db.execute("dbapdm", sql.role_menu.exists + condition, values)
    ).rows[0].ct;
  }

  async add({ body: { menu, ...values } }) {
    await this.delete(values.roleId).then(async () => {
      if (Array.isArray(menu)) {
        menu.forEach(async (m) => {
          await this.add_function({ menuId: m, ...values });
        });
      } else {
        await this.add_function({ menuId: menu, ...values });
      }
    });
  }

  async add_function(values) {
    await this.db
      .execute("dbapdm", sql.role_menu.insert, values, { autoCommit: true })
      .catch((err) => {
        throw err;
      });
  }

  async delete(roleId, menuId) {
    let condition = "";
    let values = { roleId: roleId };
    if (menuId) {
      condition = " AND I_ID_LDARMENU = :menuId";
      values.menuId = menuId;
    }
    await this.db
      .execute("dbapdm", sql.role_menu.delete + condition, values, {
        autoCommit: true,
      })
      .catch((err) => {
        throw err;
      });
  }
}

module.exports = RoleMenuRepository;
