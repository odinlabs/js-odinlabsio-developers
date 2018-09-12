const dbConfig = require('../../components/db/mongoose-config');
const mongoose = require('mongoose');
const winston = require('winston');

mongoose.connect(dbConfig.url, (err) => {
  if (err) {
    return winston.log('error', err);
  }
  return winston.log('info', 'Connected to mongoose', dbConfig.user);
});
mongoose.collection('UserStore').remove({});
mongoose.collection('UserDSSOClient').remove({});
mongoose.collection('UserOutdoorSports').remove({});
mongoose.collection('UserSkiersParadise').remove({});
