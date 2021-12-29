const {
  checkForInvalidLocks,
  checkForConventionalPrefix,
  checkForConventionalSquashCommit,
} = require('@oriflame/config-danger');

checkForInvalidLocks();
checkForConventionalPrefix();
checkForConventionalSquashCommit();
