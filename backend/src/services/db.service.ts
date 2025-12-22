import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

import { log } from '../utility/helpers.ts';
import { createDatabase, populateDatabase } from '../db-api/db-init/db-init.ts';
import * as fs from 'fs';

const DEBUG = 'db.service | ';
const dbFolder = './data';
const pathToDB = `${dbFolder}/cookbook.db`;
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
    if (!fs.existsSync(dbFolder)) {
      log.info_lv2(`${DEBUG}Database folder does not exist.`);
      fs.mkdirSync(dbFolder);
      log.info_lv2(`${DEBUG}Database folder created at '${dbFolder}'.`);
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
