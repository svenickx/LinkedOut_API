var nodemailer = require("nodemailer");
const SMTPTransporter = require("../smtp");

const HandlePropositionMail = async (
  to,
  freelanceFirstname,
  mission,
  isAccepted
) => {
  const mailProposition = await SMTPTransporter.sendMail({
    from: '"APIb3 👻" <noreply@APIb3.com>',
    to,
    subject: `${freelanceFirstname} a répondu à l'une de vos proposition!`,
    html: isAccepted
      ? `Ce freelance a décidé d'accepter votre mission: "${mission}", votre mission est désormais confirmé`
      : `Ce freelance a décidé de refuser votre mission: "${mission}", vous pouvez proposer à un autre freelance cette mission`,
  });

  console.log(
    "Mail envoyé à l'entreprise: %s",
    nodemailer.getTestMessageUrl(mailProposition)
  );
};

module.exports = HandlePropositionMail;
