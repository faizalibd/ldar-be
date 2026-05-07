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
  transaction: {
    ldar: {
      select: sql("/transaction/ldar/select.sql"),
      exists: sql("/transaction/ldar/exists.sql"),
      insert: sql("/transaction/ldar/insert.sql"),
      update_eli: sql("/transaction/ldar/update_eli.sql"),
      update_edm: sql("/transaction/ldar/update_edm.sql"),
      update_pe_accepted: sql("/transaction/ldar/update_pe_accepted.sql"),
      update_pe_manhour: sql("/transaction/ldar/update_pe_manhour.sql"),
      update_pe: sql("/transaction/ldar/update_pe.sql"),
      update_status: sql("/transaction/ldar/update_status.sql"),
      update_status_admin: sql("/transaction/ldar/update_status_admin.sql"),
      delete: sql("/transaction/ldar/delete.sql"),
      approval: {
        select: sql("/transaction/ldar/approval/select.sql"),
        exists: sql("/transaction/ldar/approval/exists.sql"),
        insert: sql("/transaction/ldar/approval/insert.sql"),
        update: sql("/transaction/ldar/approval/update.sql"),
        delete: sql("/transaction/ldar/approval/delete.sql"),
        delete_admin: sql("/transaction/ldar/approval/delete_admin.sql"),
      },
      file: {
        select: sql("/transaction/ldar/file/select.sql"),
        exists: sql("/transaction/ldar/file/exists.sql"),
        insert: sql("/transaction/ldar/file/insert.sql"),
        update: sql("/transaction/ldar/file/update.sql"),
        delete: sql("/transaction/ldar/file/delete.sql"),
        update_admin: sql("/transaction/ldar/file/update_admin.sql"),
      },
      drawing: {
        select: sql("/transaction/ldar/drawing/select.sql"),
        exists: sql("/transaction/ldar/drawing/exists.sql"),
        insert: sql("/transaction/ldar/drawing/insert.sql"),
        update: sql("/transaction/ldar/drawing/update.sql"),
        delete: sql("/transaction/ldar/drawing/delete.sql"),
      },
    },
  },
};

function sql(file) {
  const fullPath = join(__dirname, file);

  return fs.readFileSync(fullPath).toString();
}
