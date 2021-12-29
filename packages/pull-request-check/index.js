#!/usr/bin/env node
const chalk = require('chalk');

const { checkForConventionalTitle } = require('./lib');

const { SYSTEM_PULLREQUEST_PULLREQUESTID, SYSTEM_ACCESSTOKEN, ENDPOINT_URL_SYSTEMVSSCONNECTION } =
  process.env;

checkForConventionalTitle({
  pat: SYSTEM_ACCESSTOKEN,
  pullRequestId: SYSTEM_PULLREQUEST_PULLREQUESTID,
  serverUrl: ENDPOINT_URL_SYSTEMVSSCONNECTION,
})
  .then(() => {
    console.log(chalk.green('Pull request check is completed!'));
  })
  .catch((error) => {
    console.log(chalk.red('Pull request check failed!'));
    console.log(chalk.red(error));
    throw new Error('Pull request title is not correct');
  });
