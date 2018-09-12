/** routes/login.js */
const express = require('express');
const passport = require('passport');

const router = express.Router();

module.exports.configure = (done) => {
  // GET login form
  router.get('/', (req, res) => {
    res.render('login-app', { message: req.flash('loginMessage') });
  });
  // POST login
  router.post('/', passport.authenticate('local-login-app', { successReturnToOrRedirect: '/account/app/profile', failureRedirect: '/login' }));
  done(null, router);
};
