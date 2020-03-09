const express = require('express'),
      option = require('../routes/option'),
      profile = require('../routes/profile'),
      login = require('../routes/login'),
      register = require('../routes/register')
      cors = require('cors'),
      corsOptions = {
        exposedHeaders: 'X-Auth',
      },
      errorHandler = require('../middleware/error');

module.exports = app => {
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use("/profile/option", option);
  app.use("/profile", profile);
  app.use("/login", login);
  app.use("/register", register);
  app.use(function(req, res, next) {
    res.status(404).send("Page Not Found");
  });
  app.use(errorHandler);
};