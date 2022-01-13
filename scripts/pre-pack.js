/* eslint-disable import/no-extraneous-dependencies -- no need */
const fse = require('fs-extra');
const path = require('path');

const packagePath = process.cwd();

const createPackage = async () => {
  const packageData = await fse.readFile(path.resolve(packagePath, './package.json'));

  const package = JSON.parse(packageData);

  package.main = 'index.js';

  await fse.writeFile(
    path.resolve(packagePath, './package.json'),
    JSON.stringify(package, null, 2),
    'utf8',
  );
};

const run = async () => {
  try {
    await createPackage();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

run();
