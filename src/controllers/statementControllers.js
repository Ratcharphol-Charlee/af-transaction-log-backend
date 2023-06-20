const { sqlConfig } = require("../config/database-connect");
const sql = require("mssql");

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
    await data.forEach((element) => {
     
        const transdate = new Date(element["transdate"]).toLocaleString('en-GB')
        const effdate = new Date(element["effdate"]).toLocaleString('en-GB')
        console.log(transdate , effdate);
        sqlQuery += `INSERT [dbo].[bbldetail] ([AccNo], [transdate], [effdate], [particular], [Withdrawal], [deposit], [Balance], [terminalno], [period]) VALUES ('2150481808', '${transdate}', '${effdate}', 'No-Book Clearing Cheque Deposit', CAST(${element["Withdrawal"]} AS Numeric(19, 2)), CAST(${element["deposit"]} AS Numeric(19, 2)), CAST(${element["Balance"]} AS Numeric(19, 2)), '${element["terminalno"]}', '${element["period"]}') \nGO\n`;
    
    });
    console.log(sqlQuery);
    // await sql.connect(sqlConfig);
    // const result = await sql.query`SELECT TOP (10) * FROM [ACCLife].[dbo].[BBLDetail] ORDER BY [seq] DESC`;

    res.status(200).send({
      message: "0K",
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
