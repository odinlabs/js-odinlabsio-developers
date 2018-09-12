/** routes/index.js */
const site = require('./site').configure;
const login = require('./login').configure;
const signup = require('./signup').configure;
const account = require('./account').configure;

module.exports.configure = (app) => {
  site((err, router) => { app.use('/', router); });
  login((err, router) => { app.use('/login', router); });
  signup((err, router) => { app.use('/signup', router); });
  account((err, router) => { app.use('/account', router); });
};
