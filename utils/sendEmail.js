const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: "anilbabusakineni@gmail.com",
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: "anilbabusakineni@gmail.com",
    to: options.gmail,
    subject: options.subject,
    text: options.text,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
