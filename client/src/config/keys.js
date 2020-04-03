let githubClientId = "";
let githubClientSecret = "";
if (process.env.NODE_ENV === "production") {
  githubClientId = require("./keys_prod").GITHUB_CLIENT_ID;
  githubClientSecret = require("./keys_prod").GITHUB_CLIENT_SECRET;
} else {
  githubClientId = require("./keys_dev").GITHUB_CLIENT_ID;
  githubClientSecret = require("./keys_dev").GITHUB_CLIENT_SECRET;
}

export const GITHUB_CLIENT_ID = githubClientId;
export const GITHUB_CLIENT_SECRET = githubClientSecret;
