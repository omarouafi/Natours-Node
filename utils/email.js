const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const sendE = async ({ to, subject, text }) => {
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const mailOptions = {
    from: "Omar Ouafi <natours@hello.com>",
    to,
    subject,
    text,
  };

  await transport.sendMail(mailOptions);
};

module.exports = sendE;
