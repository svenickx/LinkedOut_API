const verifyAdmin = (req, res, next) => {
  if (!req.userToken.isAdmin) {
    return res.status(403).send();
  }
  next();
};

module.exports = verifyAdmin;
