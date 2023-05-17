const fs = require("fs");
const { join } = require("path");

module.exports = {
  reference: {
    approval_type: {
      select: sql("/reference/approval_type/select.sql"),
      exists: sql("/reference/approval_type/exists.sql"),
      insert: sql("/reference/approval_type/insert.sql"),
      update: sql("/reference/approval_type/update.sql"),
      delete: sql("/reference/approval_type/delete.sql"),
    },
    menu: {
      select: sql("/reference/menu/select.sql"),
      exists: sql("/reference/menu/exists.sql"),
      insert: sql("/reference/menu/insert.sql"),
      update: sql("/reference/menu/update.sql"),
      update_status: sql("/reference/menu/update_status.sql"),
      delete: sql("/reference/menu/delete.sql"),
    },
    role: {
      select: sql("/reference/role/select.sql"),
      exists: sql("/reference/role/exists.sql"),
      insert: sql("/reference/role/insert.sql"),
      update: sql("/reference/role/update.sql"),
      delete: sql("/reference/role/delete.sql"),
    },
    role_menu: {
      select_role: sql("/reference/role_menu/select_role.sql"),
      select_menu: sql("/reference/role_menu/select_menu.sql"),
      exists: sql("/reference/role_menu/exists.sql"),
      insert: sql("/reference/role_menu/insert.sql"),
      delete: sql("/reference/role_menu/delete.sql"),
    },
    user_role: {
      select_nik: sql("/reference/user_role/select_nik.sql"),
      select_role: sql("/reference/user_role/select_role.sql"),
      exists: sql("/reference/user_role/exists.sql"),
      insert: sql("/reference/user_role/insert.sql"),
      delete: sql("/reference/user_role/delete.sql"),
    },
  },
};

function sql(file) {
  const fullPath = join(__dirname, file);

  return fs.readFileSync(fullPath).toString();
}
