const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const { sqlConfig } = require("../config/database-connect");
const sql = require("mssql");
const { next } = require("cors");
const jose = require("jose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

client.connect();
const getAll = (req, res) => {
  client.query('SELECT * FROM public."user"', (err, res) => {
    console.log(res.rows);
  });
  console.log("getAll worked.");
  res.send("getAll workedd.");
};

const login = async (req, res) => {
  const { userName, password } = req.body;
  // let hash = bcrypt.hash(password, saltRounds, function (err, hash) {
  //   console.log(hash);
  // });
  let query = `SELECT * FROM public."user" WHERE "userName" = '${userName}'`;
  const pg_response = await client.query(query);

  if (pg_response) {

    if (pg_response.rows.length > 0) {
      
      const match = await bcrypt.compare(
        password,
        pg_response.rows[0].password
      );
      if (match) {
        res.status(200).send({
          message: "OK",
          query: pg_response.rows[0],
          total: pg_response.rows.length,
        });
      } else {
        res.status(401).send({message:"Unauthorized"});
      }
    } else {
      res.status(404).send({
        status: "Not Found",
        query: pg_response.rows[0],
        total: pg_response.rows.length,
      });
    }
  }
  return true;
};

const register = async (req, res) => {
  try {
    const { userName, password, email, phone } = req.body;
    if (!(userName && password && email && phone)) {
      //Check correctly field

      res.status(400).send(`some field isn't correct`);
    } else if (
      (
        await client.query(
          `SELECT * FROM public."user" WHERE "userName"='${userName}'`
        )
      ).rowCount > 0
    ) {
      //Check userName Dupilcated user
      res.status(409).send(`'${userName}' have already`);
      return;
    } else {
      const hash = await bcrypt.hash(password, saltRounds);
      const query = `INSERT INTO public."user" ("userName", "password", "email", "phone") VALUES ('${userName}', '${hash}', '${email}', '${phone}')`;

      const pg_response = await client.query(query);
      // console.log(pg_response.rowCount);
      if (pg_response.rowCount > 0) {
        res.status(201).send(`effected 1 row`);
      } else {
        res.status(500).send({
          status: "500 Internal Server Error",
          message: `Not Success INSERT data`,
        });
      }
    }
  } catch (err) {
    console.log(err.message);
  }
  return true;
};
module.exports = {
  getAll,
  login,
  register,
};
