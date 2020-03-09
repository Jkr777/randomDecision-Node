const mongoose = require('mongoose'),
      logger = require('../startup/loggin')(__filename);

module.exports = () => {
  mongoose.connect(process.env.BORING_APP, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => logger.info("mongoDB"))
    .catch(err => logger.error(err));
};