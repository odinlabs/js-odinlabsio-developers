/** serialize */
function encodeJSON(obj, encoding) {
  if (encoding) {
    return Promise.resolve(Buffer.from(JSON.stringify(obj), encoding));
  }
  return Promise.resolve(Buffer.from(JSON.stringify(obj), 'utf8'));
}
function decodeJSON(buffer, encoding) {
  if (encoding) {
    return JSON.parse(buffer.toString(encoding));
  }
  return JSON.parse(buffer.toString('utf8'));
}

function BinaryEncoder() {
  BinaryEncoder.prototype.json = encodeJSON;
}
function BinaryDecoder() {
  BinaryDecoder.prototype.json = decodeJSON;
}

function JSONSerializer() {
  this.encoder = new BinaryEncoder();
  this.decoder = new BinaryDecoder();
  JSONSerializer.prototype.toBinary = this.encoder.json;
  JSONSerializer.prototype.fromBinary = this.decoder.json;
}

module.exports.json = new JSONSerializer();
