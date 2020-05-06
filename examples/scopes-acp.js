function scopes_acp(user, context, callback) {
  const axios = require("axios@0.15.2");

  global.debug("Something");
  // if (global.debug) {
  //   user.foo = "bar";
  // }

  console.log("Starting scopes_acp");
  if (context.protocol === "redirect-callback") {
    return callback(null, user, context);
  }
  //acp needs read:basic scope
  if (context.connection === "acp") {
    context.scope = context.scope + " acp";
  }
  return callback(null, user, context);
}

//@@@module.exports.wrapper@@@
module.exports = scopes_acp;
