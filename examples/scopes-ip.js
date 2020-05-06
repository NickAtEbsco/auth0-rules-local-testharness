function scopes_ip(user, context, callback) {
  console.log("Starting scopes_ip");
  if (context.connection === "ip") {
    context.scope = context.scope + " ip";
    console.log("equals: ", context.scope);
  }
  return callback(null, user, context);
}

//@@@module.exports.wrapper@@@
module.exports = scopes_ip;
//   const _ = require("underscore");
