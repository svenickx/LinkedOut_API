const nodemailer = require("nodemailer");

const SMTPTransporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "mathias89@ethereal.email",
    pass: "fPK9qB38yJRy6PEWJ2",
  },
});

module.exports = SMTPTransporter;
