const express = require('express');
const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');
const https = require('https')
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const winston = require('winston');
const flash = require('connect-flash');


const routes = require('./routes').configure;
const errorhandler = require('./error').configure;
const session = require('./session').configure;
const auth = require('./components/auth').configure;
const db = require('./components/db');

// create application
const app = express();

// runtime param
const port = process.env.PORT || 3001;
// logging
winston.level = process.env.LOG_LEVEL || 'debug';
app.winston = winston;
app.db = db;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', [
  express.static(path.join(__dirname, 'node_modules/jquery/dist')), // jquery.min.js
  express.static(path.join(__dirname, 'node_modules/bootstrap-treeview/dist')), // bootstrap-treeview.min.css bootstrap-treeview.min.js
]);
// add session middleware
session(app);
// add passport auth middleware
auth(app);
app.use(flash());

// add oauth middleware
// add routes middleware
routes(app);
// add error middleware
errorhandler(app);

// start server
// start server
https.createServer({
  key: fs.readFileSync('local.server.key'),
  cert: fs.readFileSync('local.server.cert')
}, app)
  .listen(port, function () {
    app.winston.log('info', 'DSSO Service listening on port', port);
  });

module.exports = app;
