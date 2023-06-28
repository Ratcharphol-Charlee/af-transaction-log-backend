const {
  transdateToStr,
  effdateToStr,
  getYearMonth,
  setString,
} = require("../services/statementServices");
const { sqlConfig } = require("../config/database-connect");
const sql = require("mssql");

const insert = async (req, res) => {
  try {
    const { file, data } = req.body;
    if (typeof data != "object" || data.length == 0) {
      return res.status(400).json({
        message: "Bad Request",
        result: "data is Object or Array and length more than Zero Only!",
      });
    }
    console.log(data);
    let sqlQuery = "";
    for (let element of data) {
      delete Object.assign(element, { ["withdrawal"]: element["debit"] })[
        "debit"
      ];
      delete Object.assign(element, { ["deposit"]: element["credit"] })[
        "credit"
      ];
      delete Object.assign(element, { ["particular"]: element["description"] })[
        "description"
      ];
      delete Object.assign(element, { ["terminalno"]: element["channel"] })[
        "channel"
      ];
      let {
        accno,
        transdate,
        effectdate,
        particular,
        withdrawal,
        deposit,
        balance,
        terminalno,
        period,
      } = element;

      accno = accno.trim();
      accno = accno.replaceAll(/-/g, "");

      withdrawal =
        withdrawal == ""
          ? (0).toFixed(2)
          : parseFloat(withdrawal.replaceAll(/,/g, "")).toFixed(2);
      deposit =
        deposit == ""
          ? (0).toFixed(2)
          : parseFloat(deposit.replaceAll(/,/g, "")).toFixed(2);
      balance =
        balance == ""
          ? (0).toFixed(2)
          : parseFloat(balance.replaceAll(/,/g, "")).toFixed(2);

      period = await getYearMonth(transdate);
      transdate = await transdateToStr(transdate);
      effectdate = await effdateToStr(effectdate);
      sqlQuery = await setString(
        sqlQuery,
        `INSERT [dbo].[bbldetail] ([AccNo], [transdate], [effdate], [particular], [Withdrawal], [deposit], [Balance], [terminalno], [period]) VALUES ('${accno}', '${transdate}', '${effectdate}', '${particular}', CAST(${withdrawal} AS Numeric(19, 2)), CAST(${deposit} AS Numeric(19, 2)), CAST(${balance} AS Numeric(19, 2)), '${terminalno}', '${period}')\n \n`
      );
    }
    console.log(sqlQuery);
    //เพิ่มข้อมูล ลงในฐานข้อมูล
    await sql.connect(sqlConfig);
    const result = await sql.query(sqlQuery);
    return res.status(200).json({
      message: "OK",
      result: data,
      sql: sqlQuery,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Internel Server Error",
      result: err.message,
    });
  }
};

const selectStatement = async (req, res) => {
  try {
    const { year, month, ascending,accno } = req.body;
    if (typeof ascending != "boolean") {
      return res.status(400).json({
        message: "Bad Request",
        result: "ascending is not boolean",
      });
    }
    await sql.connect(sqlConfig);
    const sqlQuery = `SELECT [seq] as 'key'
    ,[AccNo]
    ,  CONVERT(VARCHAR(20),[transdate] ,121) as transdate
    , CONVERT(VARCHAR(20),[effdate] ,121) as effdate
    ,[particular]
    ,[Withdrawal]
    ,[deposit]
    ,[Balance]
    ,[terminalno]
    ,[period]
FROM [ACCLife].[dbo].[BBLDetail] WHERE period = '${String(year) + String(month)}' and AccNo = '${accno}' ORDER BY [seq] ${ascending ? "asc" : "desc"}`;
    const result = await sql.query(sqlQuery);

    res.status(200).send({
      message: "ok",
      req: String(year) + String(month) + "accno" +accno,
      result: result["recordset"],
    });
  } catch (err) {
    res.status(500).send({
      message: "Internel Server Error",
      result: err.message,
    });
  }
};

const deleteStatement = async (req, res) => {
  try {
    const { year, month,accno } = req.body;
    console.log(year, month);
    await sql.connect(sqlConfig);
    const sqlQuery = `DELETE FROM [ACCLife].[dbo].[BBLDetail] WHERE period = '${String(year) + String(month)}' and AccNo  = '${accno}'`;
    const result = await sql.query(sqlQuery);

    res.status(200).send({
      message: "ok",
      req: String(year) + String(month) + "accno" +accno,
      rowsAffected: result.rowsAffected[0],
    });
  } catch (err) {
    res.status(500).send({

      message: "Internal Server Error",
      result: err.message,
    });
  }
};

const getPeriodStatement = async (req, res) => {
  try {
    await sql.connect(sqlConfig);
    const sqlQuery = `SELECT
    CAST(LEFT([period], 4) AS decimal)  as stateYear,
     RIGHT([period], 2) as stateMonth
FROM [ACCLife].[dbo].[BBLDetail] GROUP BY  [period] ORDER BY stateYear DESC , stateMonth`;
    const sql_result = await sql.query(sqlQuery);
    console.log(">>>", sql_result["recordset"]);
    let yearMonth = {};

    for (let element of sql_result["recordset"]) {
      if (yearMonth[element["stateYear"]]) {
        yearMonth[element["stateYear"]] = [].concat(
          yearMonth[element["stateYear"]],
          element["stateMonth"]
        );
      } else {
        yearMonth[element["stateYear"]] = [element["stateMonth"]];
      }
    }

    //console.log(sql_result["recordsets"][0]);
    res.status(200).send({
      message: "ok",
      result: yearMonth,
    });
  } catch (err) {
    res.status(500).send({
      message: "Internal Server Error",
      result: err.message,
    });
  }
};

const getAccNostatement = async (req, res) => {
  try {
    await sql.connect(sqlConfig);
    const sqlQuery = `SELECT
    CAST(([AccNo], 10) AS decimal)  as stateAccNo,
FROM [ACCLife].[dbo].[BBLDetail] GROUP BY  [AccNo] ORDER BY Accno`;
    const sql_result = await sql.query(sqlQuery);
    console.log(">>>", sql_result["recordset"]);
    let AccNO = {};

    for (let element of sql_result["recordset"]) {
      if (yearMonth[element["stateYear"]]) {
        yearMonth[element["stateYear"]] = [].concat(
          yearMonth[element["stateYear"]],
          element["stateMonth"]
        );
      } else {
        yearMonth[element["stateYear"]] = [element["stateMonth"]];
      }
    }

    //console.log(sql_result["recordsets"][0]);
    res.status(200).send({
      message: "ok",
      result: yearMonth,
    });
  } catch (err) {
    res.status(500).send({
      message: "Internal Server Error",
      result: err.message,
    });
  }
};

module.exports = {
  insert,
  deleteStatement,
  selectStatement,
  getPeriodStatement,
};
