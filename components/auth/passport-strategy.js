/** components/auth/passport-strategy.js */
const _ = require('underscore');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const winston = require('winston');

const db = require('../db');
const utils = require('../utils');

const awaitPromise = utils.promise.consumeWithCallback;

// generating a hash
function generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}
// checking if password is valid
function validPassword(password, hashPassword) {
  return bcrypt.compareSync(password, hashPassword);
}
/**
 * Configure local-login and local-signup strategies for passport.
 * @param {*} passport
 */
module.exports.local = (passport) => {
  // used to serialize user in session
  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });
  // used to deserialize user out of session
  passport.deserializeUser((id, done) => {
    const client = db.getClientById(id);// app provider login
    return awaitPromise(client, done);
  });

  /**
   * Local signup strategy : app provider
   */
  passport.use('local-signup-app', new LocalStrategy(
    {
      usernameField: 'applicationName',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, applicationName, password, done) => {
      winston.log('debug', 'Signup new Client:', applicationName);
      return db.getClient(applicationName).then((client) => {
        if (client) {
          return done(null, false, req.flash('signupMessage', 'A client with this application name already exist.'));
        }
        // create client
        const newClient = {
          client_id: applicationName,
          clientSecret: generateHash(password),
          redirectUris: [req.body.redirectURI],
          grants: [],
          ccubePermissionDesc: [],
          appDescription: req.body.description,
        };
        return db.saveClient(newClient).then((result) => {
          winston.log('debug', 'Created client', result);
          done(null, result);
        }).catch((err) => {
          winston.log('error', err);
          done(err);
        });
      }).catch((err) => {
        winston.log('error', 'Failed to Create Client:', applicationName);
        return done(err);
      });
    }
  ));
  /**
   * Local login strategy app provider
   */
  passport.use('local-login-app', new LocalStrategy(
    {
      usernameField: 'applicationName',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, applicationName, password, done) => {
      return db.getClient(applicationName).then((client) => {
        if (client) {
          if (validPassword(password, client.clientSecret)) {
            winston.log('debug', 'Logged in client', client.clientSecret);
            return done(null, client);
          }
          winston.log('debug', 'Wrong password for user', client.client_id);
          return done(null, false, req.flash('loginMessage', 'Wrong client/password'));
        }
        winston.log('debug', 'App does not exist', applicationName);
        return done(null, false, req.flash('loginMessage', 'App :', applicationName, 'could not be found.'));
      }).catch((err) => {
        winston.log('error', err);
        return done(err);
      });
    }
  ));
};