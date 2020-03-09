const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const token = req.header("x-auth");
  if(!token) return res.status(401).send("Acess denied. No token provided.");

  try {
    const decode = jwt.verify(token, process.env.BORING_APP_JWT);
    req.user = decode;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};