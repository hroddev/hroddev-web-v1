const express = require("express");
const multiparty = require("multiparty");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.route("/").get((req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

const PORT = process.env.PORT || 5000;
const user = process.env.EMAIL;
const pass = process.env.PASS;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user,
    pass,
  },
});

app.post("/", (req, res) => {
  let form = new multiparty.Form();
  let data = {};

  form.parse(req, (err, fields) => {
    console.log(fields);
    Object.keys(fields).forEach((property) => {
      data[property] = fields[property].toString();
    });

    const mail = {
      from: data.name,
      to: process.env.EMAIL,
      subject: data.subject,
      text: `${data.name} <${data.email}> \n${data.msg}`,
    };

    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({ status: "success" });
      }
    });
  });
});
