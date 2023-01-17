const isNotLogged = (req, res, next) => {
  if (req.headers.authorization) {
    return res
      .status(403)
      .send("Vous ne pouvez pas effectuer cette action en étant connecté");
  }
  next();
};
module.exports = isNotLogged;
