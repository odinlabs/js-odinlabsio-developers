/** components/db/index.js */
const store = require('./mongo');
const dbConfig = require('./mongoose-config');
const mongoose = require('mongoose');
const winston = require('winston');

mongoose.connect(dbConfig.url, (err) => {
  if (err) {
    return winston.log('error', err);
  }
  return winston.log('debug', 'Connected to mongoose', dbConfig.user);
});

const Clients = store.ClientStore;

/**
 * Client Table
 */
const clientTable = new Clients();
/**
 * @param {String} clientAccountName
 */
module.exports.getClient = (clientId) => {
  return clientTable.find(clientId);
};
/**
 * @param {*} clientId
 */
module.exports.getClientById = (id) => {
  return clientTable.findById(id);
};
/**
 * @param {Object} client
 */
module.exports.saveClient = (client) => {
  return clientTable.save(client);
};
/**
 * @param {Object} id
 * @param {String} appDescription
 * @param {String} appLogo
 */
module.exports.updateClientDescription = (id, appDescription, appLogo) => {
  const client = { appDescription };
  return clientTable.update(id, client);
};
/**
 * @param {Object} id
 * @param {Array} uris
 */
module.exports.updateClientRedirectUris = (id, uris) => {
  const client = { redirectUris: uris };
  return clientTable.update(id, client);
};
/**
 * @param {Object} id
 * @param {Array} uris
 */
module.exports.removeClientRedirectUris = (id, uris) => {
  const removedUris = { $pullAll: { redirectUris: uris } };
  return clientTable.update(id, removedUris);
};
/**
 * @param {Object} id
 * @param  {Array} uris
 */
module.exports.addClientRedirectUris = (id, uris) => {
  const addedUris = { $addToSet: { redirectUris: { $each: uris } } };
  return clientTable.update(id, addedUris);
};
/**
 * @param {Object} id
 * @param {String} client
 */
module.exports.updateClientCCubePermissionDesc = (id, grants) => {
  return clientTable.findById(id).then((client) => {
    if (client) {
      grants.forEach((grant) => {
        client.ccubePermissionDesc.push(grant);
      });
      const reduceDuplicate = client.ccubePermissionDesc.reduce((init, element) => {
        const pre = init.get(element.name);
        if (pre) {
          element.group.forEach((path) => { pre.group.push(path); });
        } else {
          init.set(element.name, element);
        }
        return init;
      }, new Map());
      return clientTable.update(id, { $set: { ccubePermissionDesc: Array.from(reduceDuplicate.values()) } });
    }
    return Promise.reject(new Error(`Client ${id} does not exist`));
  });
};