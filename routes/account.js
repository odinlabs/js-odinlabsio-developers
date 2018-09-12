/** routes/account.js */
const express = require('express');
const winston = require('winston');
const taxonomy = require('odin-taxonomy').model;
const db = require('../components/db');

const router = express.Router();

module.exports.configure = (done) => {

  function authenticateClientApp(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/');
    }
  };  
  /**
   * App profile
   */
  router.get('/app/profile', authenticateClientApp, (req, res) => {
    res.render('account-app', { client: req.user });
  });
  // app description
  router.get('/app/profile/description', authenticateClientApp, (req, res) => {
    winston.log('debug', 'description', req.user);
    res.render('account-app-description', { client: req.user });
  });
  router.post('/app/profile/description', authenticateClientApp, (req, res, next) => {
    db.updateClientDescription(req.user._id, req.body.description).then((result)=> {
      winston.log('debug', 'update description', result);
      res.sendStatus(200);
    }).catch((err) => {
      winston.log('error', 'update description', err);
      next(err);
    });
  });
  // app oauth settings
  router.get('/app/settings/oauth', authenticateClientApp, (req, res) => {
    res.render('account-app-settings-oauth', { redirectUris: req.user.redirectUris });
  });
  router.post('/app/settings/oauth/adduri', authenticateClientApp, (req, res, next) => {
    db.addClientRedirectUris(req.user._id, req.body.add).then((result) => {
      winston.log('debug', 'update redirect uris', result);
      res.sendStatus(200);
    }).catch((err) => {
      winston.log('error', 'update redirect uris', err);
      next(500);
    });
  });
  router.post('/app/settings/oauth/removeuri', authenticateClientApp, (req, res, next) => {
    db.removeClientRedirectUris(req.user._id, req.body.remove).then((result) => {
      winston.log('debug', 'remove redirect uris', result);
      res.sendStatus(200);
    }).catch((err) => {
      winston.log('error', 'remove redirect uris', err);
      next(err);
    });
  });
  // app grants settings
  router.get('/app/settings/grants', authenticateClientApp, (req, res) => {
    taxonomy.tree(taxonomy.schema, (errDST, schemaTree) => {
      const data = [];
      const permissionDescArray = req.user.ccubePermissionDesc;
      permissionDescArray.forEach((desc) => {
        schemaTree.parse(desc, (errParse, permission) => {
          if (permission) {
            data.push(permission);
          }
        });
      });
      res.render('account-app-settings-grants', { grantsSchema: { permission: data, permissionsSchema: schemaTree.root } });
    });
  });
  router.post('/app/settings/grants', authenticateClientApp, (req, res, next) => {
    db.updateClientCCubePermissionDesc(req.user._id, req.body.permissions).then((result) => {
      winston.log('debug', 'update ccube permission', result);
      res.sendStatus(200);
    }).catch((err) => {
      winston.log('error', 'update ccube permission', err);
      next(err);
    });
  });

  // GET login
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  done(null, router);
};
