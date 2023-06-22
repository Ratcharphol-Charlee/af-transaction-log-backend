const {
  transdateToStr,
  effdateToStr,
  getYearMonth,
  setString,
} = require("../services/statementServices");
const { sqlConfig } = require("../config/database-connect");
const sql = require("mssql");

// async function sqlQueryString(date) {
//   return new romise((resolve, reject) => {
//     resolve(new Date(date).toLocaleString("en-GB"));
//   });
// }

const insert = async (req, res) => {
  try {
    const { file, data } = req.body;
    if (typeof data != "object" || data.length == 0) {
      return res.status(400).send({
        message: "Bad Request",
        result: "data is Object or Array and length more than Zero Only!",
      });
    }

    let sqlQuery = "";
    for (let element of data) {
      let {
        AccNo,
        transdate,
        effdate,
        particular,
        Withdrawal,
        deposit,
        Balance,
        terminalno,
        period,
      } = element;
      AccNo = AccNo.trim()
      AccNo = AccNo.replaceAll(/-/g , "")
     

      Withdrawal = Withdrawal == "" ? (0).toFixed(2) : parseFloat(Withdrawal.replaceAll(/,/g,"")).toFixed(2);
      deposit = deposit == "" ? (0).toFixed(2) : parseFloat(deposit.replaceAll(/,/g,"")).toFixed(2);
      Balance = Balance == "" ? (0).toFixed(2) : parseFloat(Balance.replaceAll(/,/g,"")).toFixed(2);
      
      period = await getYearMonth(transdate);
      transdate = await transdateToStr(transdate);
      effdate = await effdateToStr(effdate);
      
      sqlQuery += await setString(
        `INSERT [dbo].[bbldetail] ([AccNo], [transdate], [effdate], [particular], [Withdrawal], [deposit], [Balance], [terminalno], [period]) VALUES ('${AccNo}', '${transdate}', '${effdate}', '${particular}', CAST(${Withdrawal} AS Numeric(19, 2)), CAST(${deposit} AS Numeric(19, 2)), CAST(${Balance} AS Numeric(19, 2)), '${terminalno}', '${period}')\n`
      );
      // console.log(sqlQuery);

    }
    //เพิ่มข้อมูล ลงในฐานข้อมูล
    // await sql.connect(sqlConfig);
    //const result = await sql.query(sqlQuery);
    

    res.status(200).send({
      message: "OK",
      result : data
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
    await sql.connect(sqlConfig);
    const sqlQuery = `SELECT * FROM [ACCLife].[dbo].[BBLDetail]`;
    const result = await sql.query(sqlQuery);

    res.status(200).send({
      message: 'ok',
      result: result.recordset,
    });
  } catch (err) {
    res.status(500).send({
      message: 'Internal Server Error',
      result: err.message,
    });
  }
};

const getAllStatement = async (req, res) => {
  try {
    const { year, month } = req.query
    await sql.connect(sqlConfig);
    const sqlQuery=`SELECT TOP (100) * FROM [ACCLife].[dbo].[BBLDetail] WHERE period = '${year + month}'`
    const result = await sql.query(sqlQuery);
  
    res.status(200).send({
      message: "ok",
      req: year + month,
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
    const { year, month, id } = req.query;
    await sql.connect(sqlConfig);
    const sqlQuery = `DELETE FROM [ACCLife].[dbo].[BBLDetail] WHERE period = '${year + month}' AND id = ${id}`;
    const result = await sql.query(sqlQuery);

    res.status(200).send({
      message: 'ok',
      req: year + month,
      deletedId: id,
      rowsAffected: result.rowsAffected[0],
    });
  } catch (err) {
    res.status(500).send({
      message: 'Internal Server Error',
      result: err.message,
    });
  }
};

module.exports = {
  uploadFile,
};
