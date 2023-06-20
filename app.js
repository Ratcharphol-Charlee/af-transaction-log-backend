const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
const app = express();
const port = 3000;

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//-- กำหนด Route ของ Controller--//
const statementRoute = require("./src/routes/statementRoute");

app.get("/", function (req, res) {
  res.send("Server is Runing....");
});

// สร้าง Route ของ statement
app.use("/statement", statementRoute);
console.log("Link => http://127.0.0.1:" + port);
app.listen(port);
