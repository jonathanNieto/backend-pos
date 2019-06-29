
const express = require('express');
const bodyParser = require('body-parser');

const routes = require('../routes/index');

/* Initializations */
const app = express();
require('./config');
require('./database');

/* settings */
app.set('port', process.env.PORT || 3000);

/* midlewares */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

/* routes */
app.use('/', routes);


module.exports = app;