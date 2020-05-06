function globals(user, context, callback) {
  global.debug = function(msg) {
    console.log(msg);
  };

  return callback(null, user, context);
}

//@@@module.exports.wrapper@@@
module.exports = globals;
