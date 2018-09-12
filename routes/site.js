/** routes/site.js */
const express = require('express');

const router = express.Router();

module.exports.configure = (done) => {
  // GET site homepage
  router.get('/', (req, res) => {
    res.render('index');
  });
  // GET site homepage
  router.get('/layout', (req, res) => {
    res.render('layout-particles');
  });

  done(null, router);
};

