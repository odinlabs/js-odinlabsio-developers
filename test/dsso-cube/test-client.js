/** components/dsso-cube/client.js */
const CubeClient = require('../../components/dsso-ccube/client');
const utilJSON = require('../../components/utils/serializer').json;

const client = new CubeClient({ host: 'http://localhost:8080/' });

// client.createAccount('abel').then((accountStatus) => {
//   console.log('Account Created : ', accountStatus);
//   const rawData = Buffer.from('<tag>navigation</tag><url>https://localhost:8080/test</url><memo>log from machine etc bla bla</memo>', 'utf8');
//   return client.addIndex('abel', ['ecommerce', 'transaction'], rawData);
// }).then((indexStatus) => {
//   console.log('Index Added ', indexStatus);
//   return client.addPermission('clientd', 'abel', 'Vente', [['ecommerce', 'transaction']]);
// }).then((permissionStatus) => {
//   console.log('Permission Status', permissionStatus);
//   return client.getPermission('clientd', 'abel', 'Vente');
// }).then((permission) => {
//   console.log('Permission Added', permission.desc);
//   return client.selectIndex('abel', permission.sk);
// }).then((result) => {
//   let next = result.next();
//   while (!next.done) {
//     console.log('Result ', next.value.toString('utf8'));
//     next = result.next();
//   }
// }).catch((error) => {
//   console.log('Error ', error);
// });
// client.getPermissionList('bob').then((result) => {
//   let next = result.next();
//   console.log('perm', result);
//   while (!next.done) {
//     console.log('Result ', next.value);
//     next = result.next();
//   }
// }).catch((err) => {
//   console.log('err', err);
// });
// client.addPermission('abel', 'abel', 'Sante', [['Health', 'TransactionHistory'], ['Health', 'Chat']]).then((permissionStatus) => {
//   console.log('Permission Status', permissionStatus);
//   return ;

client.getPermission('abel', 'abel', 'Sante').then((permission) => {
  console.log('Permission Added', permission.sk.length);
  console.log('Permission Added', permission.desc);
  return client.selectIndex('abel', permission.sk);
}).then((result) => {
  let next = result.next();
  while (!next.done) {
    console.log('Result ', next.value.toString('utf-8'), next.value.length);
    next = result.next();
  }
}).catch((ex) => {
  console.log(ex);
});
// const id = { fullname: 'Bob Eponge' };
// const address = {
//   street: '101 rue des Sous-Marins',
//   code: '1000',
//   city: 'SousMarinCity',
//   departement: 'SousMarinSurMer',
//   country: 'SousMarinier',
// };

// const eaddress = { email: 'bob.eponge@sousmarin.com', tel: '003300000001' };

// client.createAccount('bob').then((accountBob) => {
//   console.log('created account', accountBob);
//   return utilJSON.toBinary(id).then((jsonId) => {
//     return client.addIndex('bob', ['Profile', 'Contact', 'Id'], jsonId);
//   });
// }).then((savedID) => {
//   console.log('savedID', savedID);
//   return utilJSON.toBinary(address).then((jsonAddress) => {
//     return client.addIndex('bob', ['Profile', 'Contact', 'Address'], jsonAddress);
//   });
// }).then((savedAddress) => {
//   console.log('savedAddress', savedAddress);
//   return utilJSON.toBinary(eaddress).then((jsonEAddress) => { 
//     return client.addIndex('bob', ['Profile', 'Contact', 'EAddress'], jsonEAddress);
//   });
// }).then((savedEAddress) => {
//   console.log('saveEAddress', savedEAddress);
//   return client.addPermission('bob', 'bob', 'ProfileId', [['Profile', 'Contact', 'Id']]);
// }).then((addedPermissionId) => {
//   console.log('addedPermissionId', addedPermissionId);
//   return client.addPermission('bob', 'bob', 'ProfileAddress', [['Profile', 'Contact', 'Address']]);
// }).then((addedPermissionAddress) => {
//   console.log('addedPermissionAddress', addedPermissionAddress);
//   return client.addPermission('bob', 'bob', 'ProfileEAddress', [['Profile', 'Contact', 'EAddress']]);
// }).then((addedPermissionEAdress) => {
//   console.log('addedPermissionEAdress', addedPermissionEAdress);
//   const getId = client.getPermission('bob', 'bob', 'ProfileId').then((permissionId) => {
//     if (permissionId) {
//       return client.selectIndex('bob', permissionId.sk);
//     }
//     return Promise.resolve(false);
//   });
//   const getAddress = client.getPermission('bob', 'bob', 'ProfileAddress').then((permissionAddress) => {
//     if (permissionAddress) {
//       return client.selectIndex('bob', permissionAddress.sk);
//     }
//     return Promise.resolve(false);
//   });
//   const getEAddress = client.getPermission('bob', 'bob', 'ProfileEAddress').then((permissionEAddress) => {
//     if (permissionEAddress) {
//       return client.selectIndex('bob', permissionEAddress.sk);
//     }
//     return Promise.resolve(false);
//   });
//   return Promise.all([getId, getAddress, getEAddress]).then((result) => {
//     const profile = {};
//     profile.id = result[0] ? utilJSON.fromBinary(result[0].next().value) : {
//       fullname: '',
//     };
//     profile.address = result[1] ? utilJSON.fromBinary(result[1].next().value) : {
//       street: '',
//       city: '',
//       departement: '',
//       country: '',
//     };
//     profile.eaddress = result[2] ? utilJSON.fromBinary(result[2].next().value) : {
//       email: '',
//       tel: '',
//     };
//     console.log(profile);
//   });
// }).catch((err) => {
//   console.log('error', err);
// });

