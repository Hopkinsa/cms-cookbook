import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

import { DATA_PATH, DIR_PATH, log } from '../utility/helpers.ts';
import { createDatabase, populateDatabase } from '../api/db-init/db-init.ts';
import * as fs from 'fs';

const DEBUG = 'db.service | ';
const pathToDB = `${DATA_PATH}/cookbook.db`;
class DBService {
  static db: Database;

  // Check if DB exists
  static newDB = false;

  static openDatabase = async (): Promise<Database> => {
    return await open({
      filename: pathToDB,
      driver: sqlite3.Database,
    });
  };

  static connectToDatabase = async (): Promise<void> => {
    if (!fs.existsSync(pathToDB)) {
      this.newDB = true;
      if (!fs.existsSync(DATA_PATH)) {
        log.info_lv2(`${DEBUG}Database folder does not exist.`);
        fs.mkdirSync(DATA_PATH);
        log.info_lv2(`${DEBUG}Database folder created at '${DATA_PATH}'.`);
      }
    }
    this.db = await this.openDatabase();
    if (this.newDB) {
      log.info_lv2(`${DEBUG}The database does not exist.`);
      await createDatabase(this.db);
      await populateDatabase(this.db);
      log.info_lv2(`${DEBUG}The database at '${pathToDB}' was created.`);
    } else {
      log.info_lv2(`${DEBUG}The database at '${pathToDB}' was opened.`);
    }
  };
}
export default DBService;
