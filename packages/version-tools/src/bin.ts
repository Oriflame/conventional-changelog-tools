/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports -- package json*/
import { Program } from '@boost/cli';

import GreaterVersionCommand from './commands/GreaterVersionCommand';

const pkg = require('../package.json');

const program = new Program({
  bin: 'version-tools',
  name: 'Oriflame version tools',
  version: pkg.version,
});

program.register(new GreaterVersionCommand()).runAndExit(process.argv);
