const { jwtGenerate } = require("../services/authenServices");
const { sqlConfig } = require("../config/database-connect");
const jose = require('jose')
const sql = require("mssql");

const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
};

const getAuthorize = async (req, res) => {
  try {
    const { createSecretKey } = require('crypto');

    const { Token } = req.query;
    const ip = req.socket.remoteAddress;
    const now = new Date();
    const dateTimeFormatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDateTime = dateTimeFormatter.format(now);
    if (Token == "" || Token == null) {
      return res.status(400).send({
        message: "Token Field Required.",
      });
    }

    const sqlQuery = `UPDATE [common].[dbo].[AppRedirect] SET UseDate = '${formattedDateTime}' , UseIP = '${ip}' WHERE RedirectID = '${Token}'`;
    const secretKey = createSecretKey(JWT_SECRET ,'utf-8')
    const tokenf = await new jose.SignJWT({ id: '12345' }) // details to  encode in the token
    .setProtectedHeader({ alg: 'HS256' }) // algorithm
    .setIssuedAt()
    .setIssuer(JWT_ISSUER) // issuer
    .setAudience(JWT_AUDIENCE) // audience
    .setExpirationTime(JWT_EXPIRATION_TIME) // token expiration time, e.g., "1 day"
    .sign(secretKey);
    console.log(tokenf);
    return res.status(200).send({
        message: "OK",
        Token: "Bearer " + Token,
        Token2 : tokenf,
        sql : sqlQuery
      });
    let conn = await sql.connect(sqlConfig);
    //const result = await sql.query(sqlQuery);
    await conn.close();
    
  } catch (error) {}
};

module.exports = {
  getAuthorize,
};
