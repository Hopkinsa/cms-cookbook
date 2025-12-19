import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import { log } from '../utility/helpers.ts';
import { createDatabase, populateDatabase } from '../db-api/db-init/db-init.ts';
import * as fs from 'fs';

const DEBUG = 'db.service | ';
const pathToDB = './data/cookbook.db';

// Check if DB exists
let newDB = false;
if (!fs.existsSync(pathToDB)) {
  newDB = true;
}

export const db = await open({
  filename: pathToDB,
  driver: sqlite3.Database,
});

export async function connectToDatabase(): Promise<void> {
  if (newDB) {
    log.info_lv2(`${DEBUG}The database does not exist.`);
    await createDatabase(db);
    await populateDatabase(db);
    log.info_lv2(`${DEBUG}The database at '${pathToDB}' was created.`);
  } else {
    log.info_lv2(`${DEBUG}The database at '${pathToDB}' was opened.`);
  }
}
