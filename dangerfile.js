import {
  checkForInvalidLocks,
  checkForConventionalPrefix,
  checkForConventionalSquashCommit,
} from '@oriflame/config-danger';

checkForInvalidLocks();
checkForConventionalPrefix();
checkForConventionalSquashCommit();
