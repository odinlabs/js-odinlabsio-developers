/** test/utils/test-json.js */
const utilJSON = require('../../components/utils/serializer').json;

const obj = { value: 'value', composite: { value: 'compositionValue' } };

utilJSON.toBinary(obj).then((bin) => {
  console.log('bin', bin);
  return utilJSON.fromBinary(bin);
}).then((parsed) => {
  console.log(parsed);
}).catch((err) => {
  console.log('err', err);
});

