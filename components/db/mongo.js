const _ = require('underscore');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = require('mongodb').ObjectID;

const UserStoreSchema = new Schema({
  accountName: { type: String },
  accountPassword: { type: String },
});
mongoose.model('UserStore', UserStoreSchema);

/**
 * Client {id, client_id, clientSecret, redirectUris, grants}
 * Client: {
 *  id: Integer,
 *  client_id: String,
 *  clientSecret: String,
 *  grants: [ String ],
 *  redirectUris: [ String ],
 *  ccubePermissionDesc: { type: [new Schema({ name: { type: String }, group: { type: [[String]] } })] },
 * }
 */
function ClientStore() {
}
const ClientStoreSchema = new Schema({
  client_id: { type: String },
  clientSecret: { type: String },
  grants: { type: [String] },
  redirectUris: { type: [String] },
  ccubePermissionDesc: { type: [new Schema({ name: { type: String }, group: { type: [[String]] } })] },
  appDescription: { type: String },
});
mongoose.model('ClientStore', ClientStoreSchema);

const ClientModel = mongoose.model('ClientStore');

function findClient(clientId) {
  return ClientModel.findOne({ client_id: clientId }).lean();
}
ClientStore.prototype.find = findClient;

function findClientById(id) {
  return ClientModel.findOne({ _id: new ObjectId(id) }).lean();
}
ClientStore.prototype.findById = findClientById;

function saveClient(client) {
  return ClientModel.create({
    client_id: client.client_id,
    clientSecret: client.clientSecret,
    grants: client.grants,
    redirectUris: client.redirectUris,
    ccubePermissionDesc: client.ccubePermissionDesc,
    appDescription: client.appDescription,
  });
}
function validateSaveClient(next) {
  const self = this;
  ClientModel.findOne({ client_id: this.client_id }, (err, result) => {
    if (err) {
      next(err);
    } else if (result) {
      self.invalidate(`Client ${self.client_id} already exist!`);
      next(new Error(`Client ${self.client_id} already exist!`));
    } else {
      next();
    }
  });
}
ClientStoreSchema.pre('save', validateSaveClient);
ClientStore.prototype.save = saveClient;

function updateClient(id, client) {
  return ClientModel.update({ _id: id }, client).lean();
}
ClientStore.prototype.update = updateClient;

exports.ClientStore = ClientStore;