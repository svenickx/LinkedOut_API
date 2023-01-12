const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(403).send("Who are you??");
  }
  token = token.replace("Bearer ", "");

  jwt.verify(token, process.env.PRIVATEKEY, (err, jwtDecoded) => {
    if (err) {
      return res.status(401).send({
        auth: false,
        token: null,
        message: "not authorized",
      });
    }

    req.userToken = jwtDecoded;
    next();
  });
};
module.exports = verifyToken;
