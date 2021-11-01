const nodemailer = require("nodemailer");

const sendE = async ({ to, subject, text }) => {
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b68a5858de5736",
      pass: "6eed8f2acba975",
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
