var nodemailer = require("nodemailer");
const SMTPTransporter = require("../smtp");

const CreatePropositionMail = async (to, mission) => {
  const mailProposition = await SMTPTransporter.sendMail({
    from: '"APIb3 👻" <noreply@APIb3.com>',
    to,
    subject: "Vous avez reçu une proposition pour une mission!",
    html: `L'entreprise ${
      mission.company._doc.name
    } est intéressé par votre profil et vous propose une mission!<br/><br/>
            <h1>${mission.title}</h1><br/>
            <p>${mission.description}</p>
            <p>Montant total: ${mission.totalAmount}€</p>
            <p>Début: ${mission.startDate.toLocaleDateString("fr-fr")}</p>
            <p>Fin: ${mission.endDate.toLocaleDateString("fr-fr")}</p>`,
  });

  console.log(
    "Mail envoyé à l'utilisateur: %s",
    nodemailer.getTestMessageUrl(mailProposition)
  );
};

module.exports = CreatePropositionMail;
