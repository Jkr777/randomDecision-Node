const express = require('express'),
      logger = require('./startup/loggin')(__filename),
      app = express();

require('express-async-errors');   
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/production')(app);

const PORT = process.env.PORT;
app.listen(PORT, () => logger.info("Express server")); 