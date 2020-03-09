const logger = require('../startup/loggin')(__filename);

module.exports = function errorHandler(err, req, res, next) {
  logger.error(err.message);
  res.status(500).send("Something failed");
};