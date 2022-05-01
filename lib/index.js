'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { promisify } = require('node:util');
const { parseUniversities } = require('./parser');

const asyncWriteFile = promisify(fs.writeFile);

const SPECIALITY_ID = 121;
const DATA_PATH = path.join(__dirname, '../public/universities.json');

(async () => {
  try {
    console.log('Parsing started...');
    const universities = await parseUniversities(SPECIALITY_ID);
    console.log(`Got ${universities.length} universities. Saving...`);
    const strUniversities = JSON.stringify(universities, null, 2);
    await asyncWriteFile(DATA_PATH, strUniversities);
    console.log('Success!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
