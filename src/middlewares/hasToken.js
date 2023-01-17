const jwt = require("jsonwebtoken");

const hasToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res
      .status(403)
      .send("Aucun jeton de connexion trouvé, veuillez vous connecter");
  }
  token = token.replace("Bearer ", "");

  jwt.verify(token, process.env.PRIVATEKEY, (err, jwtDecoded) => {
    if (err) {
      return res.status(401).send({
        auth: false,
        token: null,
        message: "Jeton invalide",
      });
    }

    req.userToken = jwtDecoded;
    next();
  });
};
module.exports = hasToken;
