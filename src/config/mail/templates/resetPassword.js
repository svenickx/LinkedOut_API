var nodemailer = require("nodemailer");
const SMTPTransporter = require("../smtp");

const ResetPasswordMail = async (to, password) => {
  const mailProposition = await SMTPTransporter.sendMail({
    from: '"APIb3 👻" <noreply@APIb3.com>',
    to,
    subject: "Votre nouveau mot de passe!",
    html: `<p>Vous avez reinitialisé votre mot de passe, voici le nouveau: ${password}.</p>
            <p>Nous vous recommendons de le changer dans vos paramètre.</p>`,
  });

  console.log(
    "Mail envoyé à l'utilisateur: %s",
    nodemailer.getTestMessageUrl(mailProposition)
  );
};

module.exports = ResetPasswordMail;
