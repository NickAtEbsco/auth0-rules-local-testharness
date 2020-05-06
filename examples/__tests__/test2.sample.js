"use strict";

var expect = require("chai").expect;
var runInLocalSandbox = require("../../");
var nock = require("nock");

const fs = require("fs");
const loadFile = filename =>
  fs
    .readFileSync(require.resolve(filename), "utf8")
    // This is a custom naming convention to drop the module.exports
    // so it loads in Auth0 correctly.  Presently Auth0 doesn't use
    // modules.exports - instead it uses a simple function to run
    // and execute it.  We want this to work both with Tests/SonarQube
    // and properly execute in Auth0.  This hack enables that.
    // Also it's worth noting that not all files have this,
    // so we need to verify it before using it.
    .split("//@@@module.exports.wrapper@@@")[0];

var initialUser = {
  email: "first.last@auth0.com",
  email_verified: true,
  name: "Test user",
  given_name: "Test",
  family_name: "User",
  created_at: "2019-03-09T09:00.000Z",
  last_login: "2019-03-09T10:00:27.000Z",
  logins_count: 4
};
var initialContext = {
  // "clientID": "test-client-id",
  // "clientName": "Test client",
  connection: "ip",
  scope: "oidc read:basic"
  // "connectionStrategy": "auth0",
  // "protocol": "oidc-basic-profile",
  // "stats": {
  // "loginsCount": 1
  // }
};
var configuration = {
  requestBinUrl: "http://requestbin.fullcontact.com/auth0-rule-test",
  m2mCID: process.env.clientID,
  m2mCSecret: process.env.clientSecret,
  domain: process.env.Auth0Domain
};

describe("nick tests", function() {
  // this.timeout(3 * 1000);
  var body = {
    user: {
      email: initialUser.email,
      email_verified: initialUser.email_verified
    },
    context: {
      clientID: initialContext.clientID,
      connection: initialContext.connection,
      stats: initialContext.stats
    }
  };

  var acpScript = loadFile("../scopes-acp.js");
  var ipScript = loadFile("../scopes-ip.js");
  var globalScript = loadFile("../globals.js");

  // .split("//@@@module.exports.wrapper@@@")[0];

  it("IP", async function() {
    // .split("//@@@module.exports.wrapper@@@")[0];
    // console.log("what is :" + acpScript.split("//@@@module.exports.wrapper@@@")[0]);

    // var scope = nock(configuration.requestBinUrl).post('', body).reply(200),
    //   slowScope = nock('http://slowly.com').post('/delay/1second').delay(1000).reply(204);

    // const result = await runInLocalSandbox([acpScript, ipScript], user, context, configuration);
    // console.log(JSON.stringify(result));

    const { user, context, global } = await runInLocalSandbox(
      [globalScript, acpScript, ipScript],
      initialUser,
      initialContext,
      configuration
    );

    expect(context).eql({
      connection: "ip",
      scope: "oidc read:basic ip"
    });

    // expect(slowScope.isDone()).to.be.true;
    // expect(scope.isDone()).to.be.true;
  });

  it("acp", async function() {
    const { user, context } = await runInLocalSandbox(
      [globalScript, acpScript, ipScript],
      initialUser,
      {
        connection: "acp",
        scope: "oidc read:basic"
      },
      configuration
    );

    expect(context).eql({
      connection: "acp",
      scope: "oidc read:basic acp"
    });
  });
  // it('should fail to move to next rule if first fails', async function() {
  //   var scope = nock(configuration.requestBinUrl).post('', body).reply(200),
  //     slowScope = nock('http://slowly.com').post('/delay/1second').delay(1000).reply(500)
  //   try {
  //     await runInLocalSandbox([script1, script2], user, context, configuration);
  //   } catch (e) {
  //     expect(e.message).to.be.equal("Failed posting");
  //   } finally {
  //     expect(slowScope.isDone()).to.be.true;
  //     expect(scope.isDone()).to.be.false;
  //   }
  // });
});
