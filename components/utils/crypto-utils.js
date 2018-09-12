/** components/utils/crypto-utils.js */
const crypto = require('crypto');
const randomBytes = require('bluebird').promisify(require('crypto').randomBytes);

function sha1(size) {
  return randomBytes(size).then((buffer) => {
    return crypto
      .createHash('sha1')
      .update(buffer)
      .digest('hex');
  });
}
module.exports = {
  hash_sha1: sha1,
};
