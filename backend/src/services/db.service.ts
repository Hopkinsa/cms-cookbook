import Database from 'better-sqlite3';

import { DATA_PATH, log } from '../utility/helpers.ts';
import { createDatabase, populateDatabase, seedAuthDatabase } from '../api/init/init.ts';
import { ensureBootstrapAdmin } from '../auth/auth.repository.ts';
import * as fs from 'fs';

const DEBUG = 'db.service | ';
const pathToDB = `${DATA_PATH}/cookbook.db`;
class DBService {
  static db: Database.Database;

  // Check if DB exists
  static newDB = false;

  static openDatabase = async (): Promise<Database.Database> => {
    return new Database(pathToDB);
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
    await createDatabase(this.db);
    await seedAuthDatabase(this.db);
    if (this.newDB) {
      log.info_lv2(`${DEBUG}The database does not exist.`);
      await populateDatabase(this.db);
      log.info_lv2(`${DEBUG}The database at '${pathToDB}' was created.`);
    } else {
      log.info_lv2(`${DEBUG}The database at '${pathToDB}' was opened.`);
    }

    await ensureBootstrapAdmin();
  };
}
export default DBService;
