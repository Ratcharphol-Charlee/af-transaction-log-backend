const { describe } = require("node:test");
const { sqlConfig } = require("../config/database-connect");
const sql = require("mssql");

async function effdateToStr(date) {
  return new Promise((resolve, reject) => {
    resolve(new Date(date).toLocaleString("en-GB"));
  });
}
async function transdateToStr(date) {
  return new Promise((resolve, reject) => {
    resolve(new Date(date).toLocaleString("en-GB"));
  });
}
async function getYearandMonth(date) {
  return new Promise((resolve, reject) => {
    const year = new Date(date).getFullYear
    const month = new Date(date).getMonth  
    resolve(year+month);
  });
}
async function setString(text){
  return new Promise((resolve, reject) => {
    resolve(text);
  });
}

// async function sqlQueryString(date) {
//   return new Promise((resolve, reject) => {
//     resolve(new Date(date).toLocaleString("en-GB"));
//   });
// }

const uploadFile = async (req, res) => {
  try {
    const { file, data } = req.body;
    if (typeof data != "object" || data.length == 0) {
      return res.status(400).send({
        message: "Bad Request",
        result: "data is Object or Array and length more than Zero Only!",
      });
    }

    let sqlQuery = "";
    for(let element of data){
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
    
      transdate = await transdateToStr(transdate);
      effdate = await effdateToStr(effdate);
      console.log(transdate, effdate);
      period = await getYearandMonth();
      console.log(period);
      sqlQuery += await setString(`INSERT [dbo].[bbldetail] ([AccNo], [transdate], [effdate], [particular], [Withdrawal], [deposit], [Balance], [terminalno], [period]) VALUES ('${AccNo}', '${transdate}', '${effdate}', '${particular}', CAST(${Withdrawal} AS Numeric(19, 2)), CAST(${deposit} AS Numeric(19, 2)), CAST(${Balance} AS Numeric(19, 2)), '${terminalno}', '${period}') \nGO\n`)

    }
    //console.log(sqlQuery);
    //เพิ่มข้อมูล ลงในฐานข้อมูล
    // await sql.connect(sqlConfig);
    // const result = await sql.query`SELECT TOP (10) * FROM [ACCLife].[dbo].[BBLDetail] ORDER BY [seq] DESC`;

    res.status(200).send({
      message: "OK",
      // result : result["recordsets"][0]
    });
  } catch (err) {
    return res.status(500).send({
      message: "Internel Server Error",
      result: err.message,
    });
  }
};

const getAllStatement = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).send({
      message: "Internel Server Error",
      result: err.message,
    });
  }
};

module.exports = {
  uploadFile,
};
