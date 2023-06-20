const sql = require("mssql");
require("../.env")
const sqlConfig = {
  user: APP_DATABASE_CONNECT_USER,
  password: APP_DATABASE_CONNECT_PASSWORD,
  database:APP_DATABASE_DATABASE_NAME,
  server: APP_DATABASE_CONNECT_IP,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: false // change to true for local dev / self-signed certs
  }
}

module.exports = {
  sqlConfig,
};
