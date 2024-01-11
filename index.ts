require("dotenv").config();
// console.log(process.env);
const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
app.use(express.json());
import { Request, Response } from "express";
const host = process.env.host;
const port = Number(process.env.port);
const user = process.env.user;
const from = process.env.from;
const pass = process.env.pass;
const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  secure: false,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: user,
    pass: pass,
  },
});

app.get("/", async function (req: Request, res: Response) {
  const { email, otp } = req.body;
  console.log(email, otp);
  if (!email || !otp) {
    res
      .status(500)
      .send("email and otp require email as a string and otp as a numbert");
  }
  const messageId = await send_otp(email, otp);
  res.send(messageId);
});

app.listen(3000);
async function send_otp(email: string, otp: number) {
  const info = await transporter.sendMail({
    from: from, // sender address
    to: email, // list of receivers
    subject: "OTP To verify your account", // Subject line
    text: `Here is your otp ${otp}`, // plain text body
  });
  return info.messageId;
}
