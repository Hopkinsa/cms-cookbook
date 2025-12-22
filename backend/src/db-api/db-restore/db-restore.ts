import { Request, Response } from 'express';

import DBService from '../../services/db.service.ts';
import { log } from '../../utility/helpers.ts';
import { RECIPE_DATA, RECIPE_TABLE, TAG_DATA, TAG_TABLE, UNIT_DATA, UNIT_TABLE } from './sql-restore.ts';

const DEBUG = 'db-restore | ';

const BACKUP_DIR = './backup';

class DBRestore {
  private static createDatabase = async (): Promise<void> => {
    await DBService.db
      .run(TAG_TABLE)
      .then(() => log.info_lv3(`${DEBUG}Tag table created successfully`))
      .catch((err: Error) => log.error(`${DEBUG}Error creating Tag table: `, err.message));

    await DBService.db
      .run(UNIT_TABLE)
      .then(() => log.info_lv3(`${DEBUG}Unit table created successfully`))
      .catch((err: Error) => log.error(`${DEBUG}Error creating Unit table: `, err.message));

    await DBService.db
      .run(RECIPE_TABLE)
      .then(() => log.info_lv3(`${DEBUG}Recipe table created successfully`))
      .catch((err: Error) => log.error(`${DEBUG}Error creating Recipe table: `, err.message));
  };

  private static populateDatabase = async (): Promise<void> => {
    log.info_lv2(`${DEBUG}dbRestore`);

    await DBService.db
      .run(TAG_DATA)
      .then(() => log.info_lv3(`${DEBUG}Tag data restored successfully`))
      .catch((err: Error) => log.error(`${DEBUG}Error adding Tag data: `, err.message));

    await DBService.db
      .run(UNIT_DATA)
      .then(() => log.info_lv3(`${DEBUG}Unit data restored successfully`))
      .catch((err: Error) => log.error(`${DEBUG}Error adding Unit data: `, err.message));

    try {
      await DBService.db
        .run(RECIPE_DATA)
        .then(() => log.info_lv3(`${DEBUG}Recipe data restored successfully`))
        .catch((err: Error) => log.error(`${DEBUG}Error adding Recipe data: `, err.message));
    } catch (e) {
      log.error(`${DEBUG}Error adding Recipe data: `, e as unknown as string);
    }
  };

  static dbRestore = async (req: Request, res: Response): Promise<void> => {
    await DBRestore.populateDatabase();

    const resCode = 200;
    const resMessage = 'OK';

    res.status(resCode).json(resMessage);
  };
}
export default DBRestore;
