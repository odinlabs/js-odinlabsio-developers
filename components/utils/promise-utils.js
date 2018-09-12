
async function consumeWithCallback(promise, callback) {
  const safeCallBack = (error, result) => {
    if (callback == null) {
      return;
    }
    try {
      callback(error, result);
    } catch (e) { } // silent
  };
  try {
    const result = await promise;
    safeCallBack(null, result);
    return Promise.resolve(result);
  } catch (err) {
    safeCallBack(err);
    return Promise.reject(err);
  }
}

module.exports.consumeWithCallback = consumeWithCallback;
