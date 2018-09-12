/** routes/signup.js */
const express = require('express');
const passport = require('passport');

const router = express.Router();

module.exports.configure = (done) => {
  // GET signup form
  router.get('/', (req, res) => {
    res.render('signup-app', { message: req.flash('signupMessage') });
  }); 
  // POST signin
  router.post('/', passport.authenticate('local-signup-app', { successReturnToOrRedirect: '/account/app/profile', failureRedirect: '/signup' }));

  done(null, router);
};
