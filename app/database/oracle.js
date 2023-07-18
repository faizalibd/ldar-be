const oracledb = require("oracledb");

const type = process.env.DB_TYPE.split(",");
const host = process.env.DB_HOST.split(",");
const port = process.env.DB_PORT.split(",");
const db_name = process.env.DB_NAME.split(",");
const pool = process.env.DB_POOL_NAME.split(",");
const user = process.env.DB_USER.split(",");
const password = process.env.DB_PASSWORD.split(",");
const config = {
  poolMin: parseInt(process.env.POOL_MIN),
  poolMax: parseInt(process.env.POOL_MAX),
  poolIncrement: parseInt(process.env.POOL_INCREMENT),
};
let connections = {};

async function initialize() {
  pool.forEach(async (p, i) => {
    if (type[i] === "oracle") {
      connections[p] = host[i] + ":" + port[i] + "/" + db_name[i];
      try {
        await oracledb.createPool({
          connectString: connections[p],
          user: user[i],
          password: password[i],
          ...config,
          poolAlias: p,
        });
      } catch (err) {
        console.log(p, err);
        throw err;
      }
    }
  });
}

async function close() {
  pool.forEach(async (p) => {
    await oracledb.getPool(p).close(0);
  });
}

async function execute(poolName, statement, binds, opts = {}) {
  let result = [];
  let conn;
  opts.outFormat = oracledb.OBJECT;
  try {
    conn = await oracledb.getConnection(poolName);
    result = await conn.execute(statement, binds, opts);
    return result;
  } catch (err) {
    console.error(`Error: ${err.message || err}`);
    throw err;
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error(`Error: ${err.message || err}`);
        throw err;
      }
    }
  }
}

const { reference, transaction } = require("./repositories");

const role_menu = new reference.role_menu({ execute });
const user_role = new reference.user_role({ execute }, role_menu);
const ldar_approval = new transaction.approval({ execute });
const ldar_file = new transaction.file({ execute });
const ldar_drawing = new transaction.drawing({ execute });

const db = {
  reference: {
    approval_type: new reference.approval_type({ execute }),
    menu: new reference.menu({ execute }),
    role: new reference.role({ execute }),
    role_menu: role_menu,
    user_role: user_role,
  },
  transaction: {
    ldar: new transaction.ldar(
      { execute },
      user_role,
      ldar_approval,
      ldar_file,
      ldar_drawing
    ),
  },
};

module.exports = { db, config, initialize, close, execute, connections };
