module.exports = {
  reference: {
    approval_type: require("./reference/approval_type"),
    menu: require("./reference/menu"),
    role: require("./reference/role"),
    role_menu: require("./reference/role_menu"),
    user_role: require("./reference/user_role"),
  },
  transaction: {
    ldar: require("./transaction/ldar"),
    approval: require("./transaction/ldar/approval"),
    file: require("./transaction/ldar/file"),
    drawing: require("./transaction/ldar/drawing"),
  },
};
