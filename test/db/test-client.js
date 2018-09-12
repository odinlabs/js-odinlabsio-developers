const db = require('../../components/db');

db.getAuthorizationCode('490bcbe8e1db280d88c4883b13c349755ad102d4').then((code) => {
  console.log('code', code);
}).catch((err) => {
  console.log('error', err);
});
// db.getClient('applicationA').then((client) => {
//   console.log(client);
//   db.addClientRedirectUris(client._id, ['http://localhost:9090/applicationE/callback/1']).then((update) => {
//     console.log(update);
//   }).catch((err) => {
//     console.log(err);
//   });
// }).catch((err) => {
//   console.log(err);
// });

// db.getClient('applicationA').then((client) => {
//   console.log(client);
//   db.removeClientRedirectUris(client._id, [null]).then((update) => {
//     console.log(update);
//   }).catch((err) => {
//     console.log(err);
//   });
//   db.getClient('applicationA').then((clientM) => {
//     console.log(clientM);
//   });
// }).catch((err) => {
//   console.log(err);
// });
// const newClient = {
//   client_id: 'applicationQ',
//   clientSecret: 'sshhhhhhhh',
//   redirectUris: [],
//   grants: [],
//   ccubePermissionDesc: [],
//   appDescription: 'description',
// };
// db.getClient('applicationQ').then((client) => {
//   return db.getClient('applicationQ');
// }).then((readClient) => {
//   console.log('l38', readClient);
//   return db.updateClientCCubePermissionDesc(readClient._id, [{ name: 'Vente', group: [['Vente', 'Autres']] }]);
// }).then((clientM) => {
//   console.log(clientM);
//   return db.getClient('applicationQ');
// }).then((last) => {
//   console.log('l43', last.ccubePermissionDesc[0].group);
// }).catch((err) => {
//   console.log(err);
// });
// db.saveClient(newClient).then((client) => {
//   console.log(client.client_id);
//   db.getClient('applicationY').then((z) => {
//     console.log(z);
//     z.ccubePermissionDesc.push({ name: 'Vente', group: [['Vente', 'Achat']] });
//     db.updateClientCCubePermissionDesc(z._id, { name: 'Vente', group: [['Vente', 'Achat']] });
//   }).then((result) => {
//     console.log(result);
//     db.getClient('applicationY').then((clientZ) => {
//       console.log(clientZ);
//     });
//   });
// });

