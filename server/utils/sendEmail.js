const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST_MAILER,
      service: process.env.SERVICE_MAILER,
      port: Number(process.env.PORT_MAILER),
      secure: Boolean(process.env.SECURE_MAILER),
      auth: {
        user: process.env.USER_MAILER,
        pass: process.env.PASS_MAILER,
      },
    });

    await transporter.sendMail({
      from: `TWITTLE <${process.env.USER_MAILER}>`,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("Email send successfully");
  } catch (err) {
    console.log("Email can't to send");
    console.log(err);
  }
};

module.exports = sendEmail;
