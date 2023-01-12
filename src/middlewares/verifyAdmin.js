const verifyAdmin = (req, res, next) => {
  if (!req.userToken.isAdmin) {
    return res.status(403).send({
      message: "Admin permission required",
    });
  }
  next();
};

module.exports = verifyAdmin;
