const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  let userId = req.query.userId;
  if (userId == "0000") {
    res.status(200).send({
      message: "Welcome , Administrator!",
      token: "dawd4w5a2rgr5t2r2t5t78r44gr5sdf556k4iu5k6",
    });
  } else if (userId == "0010") {
    res.status(200).send({
      message: "Welcome , Ratcharphol!",
      token: "frokgporgkrto64yj4r4ty856j4f5gj65h4ty4hjy8",
    });
  } else {
    res.status(401).send({
      message: "Oops , Unauthorized",
      token: null,
    });
  }
  res.status(400).send("Bad request");
});

app.listen(port, () => {
  console.log("Ready => http://localhost:" + port + "/");
  async function taskOne() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("taskOne 1");
      }, 500);
    });
  }
  async function taskTwo() {
    return "taskTwo 2";
  }
  async function taskThree() {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("taskThree 3");
      }, 500);
    });
    promise
      .then((value) => {
        return value;
      })
      .catch((err) => {
        return reject;
      });
    return promise;
  }

  async function main() {
    const one = await taskOne();
    const two = await taskTwo();
    const three = await taskThree();
    console.log(one);
    console.log(two);
    console.log(three);
  }
  main();
});
