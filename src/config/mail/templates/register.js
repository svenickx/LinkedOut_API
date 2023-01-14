var nodemailer = require("nodemailer");
const SMTPTransporter = require("../smtp");

const freelanceTemplate = (firstname) => {
  return `<h1>Félicitations ${firstname}! Vous venez de finaliser votre inscription!</h1><br/>
    <img src="https://media.tenor.com/c86D6_XlACMAAAAC/weekend-party.gif" alt="party" /><br/><br/>
    Attendez qu'une entreprise vous propose une mission!
    Vous pouvez modifier votre profil à tout moment afin d'être plus attractif!`;
};
const recruiterTemplate = (firstname) => {
  return `<h1>Félicitations ${firstname}! Vous venez de finaliser votre inscription!</h1><br/>
    <img src="https://media.tenor.com/c86D6_XlACMAAAAC/weekend-party.gif" alt="party" /><br/><br/>
    Créez des missions dès à présent et proposez les aux Freelances!`;
};

const SendRegisterMail = async (to, firstname, isFreelance) => {
  const UserRegisterMailTemplate = await SMTPTransporter.sendMail({
    from: '"APIb3 👻" <noreply@APIb3.com>',
    to,
    subject: "Inscription terminée!",
    html: isFreelance
      ? freelanceTemplate(firstname)
      : recruiterTemplate(firstname),
  });
  const AdminRegisterMailTemplate = await SMTPTransporter.sendMail({
    from: '"APIb3 👻" <noreply@APIb3.com>',
    to: "sven.dockx@gmail.com",
    subject: `Un utilisateur (${firstname}) vient de finaliser son inscription!`,
    html: isFreelance
      ? "Il s'est inscrit en tant que Freelance"
      : "Il s'est inscrit en tant que recruteur",
  });

  console.log(
    "Mail envoyé à l'utilisateur: %s",
    nodemailer.getTestMessageUrl(UserRegisterMailTemplate)
  );
  console.log(
    "Mail envoyé à l'administrateur: %s",
    nodemailer.getTestMessageUrl(AdminRegisterMailTemplate)
  );
};

module.exports = SendRegisterMail;
