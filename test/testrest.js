/* eslint-disable */
const rlp = require('rlp');
const RestClient = require('node-rest-client').Client;


const client = new RestClient();

const json_content = { 'Content-Type': 'application/json' };
const args = {
  data: { userName: 'abel' },
  headers: json_content
};

// create account
client.post('http://localhost:8080/account', {data: { userName: 'abel' }, headers: json_content }, function (bufferPK, response) {
  console.log('POST Add Account Status:', response.statusCode, response.statusMessage);
  const requestCreateIndex = {
    provider: {
      providerName: 'client',
      tags : ['finance', 'sante', 'ecom', 'esocial', 'ecommerce', 'transaction', 'history']
    }, 
    user: {
      userName: 'abel'
    }
  }
  // create index at provider
  client.post('http://localhost:8080/provider/account', { data: requestCreateIndex, headers: json_content }, function (bufferSKAttributes, response) {
    console.log('POST Add Account at provider Status:', response.statusCode, response.statusMessage);
    const rawData = new Buffer('data', 'utf8').toString('base64');
    console.log('RawData to index: '+rawData);
    const requestIndex = {
        provider: {
          providerName: 'client',
          tags: []
        },
        user: {
          userName: 'abel'
        },
        data: {
          policy: ['ecommerce', 'transaction'],
          raw: rawData
        }
    }
    // add index
    client.post('http://localhost:8080/provider/index', { data: requestIndex, headers: json_content }, function(result, response) {
      console.log('POST Add Index Status:', response.statusCode, response.statusMessage);
      const requestPermission = {
        user: {
          userName: 'abel'
        },
        permission: {
            permissionName: 'Achat',
            permission: ['ecommerce', 'transaction']
        }
      }  
      // create permission
      client.post('http://localhost:8080/account/permission', { data: requestPermission, headers: json_content }, function(rawResult, response) {
        console.log('POST Add Permission Status:', response.statusCode, response.statusMessage);
        const requestSelect = {
          provider: { providerName: 'client', tags: []},
          user: { userName: 'abel' },
          permission: rawResult.raw[0]
        }
        // select
        client.post('http://localhost:8080/provider/select', { data: requestSelect, headers: json_content }, function(result, response) {
          console.log('POST Select Index Status:', response.statusCode, response.statusMessage);
          console.log('RawData received: '+result.raw[0]);
          console.log(new Buffer(result.raw[0], 'base64').toString('utf8'));
        });
      });
    });
  });
});