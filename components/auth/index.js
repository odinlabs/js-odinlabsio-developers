/** components/auth/index.js */
const passport = require('passport');
const strategy = require('./passport-strategy');

module.exports.configure = (app) => {
  // add local strategy to passport
  strategy.local(passport);
  // add passport as middleware
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
};