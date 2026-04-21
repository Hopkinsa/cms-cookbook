import Database from 'better-sqlite3';

import { log } from '../../utility/helpers.ts';
import { RECIPE_DATA, RECIPE_TABLE, TAG_DATA, TAG_TABLE, UNIT_DATA, UNIT_TABLE } from './init.sql.ts';

const DEBUG = 'init | ';

export async function createDatabase(db: Database.Database): Promise<void> {
  try {
    db.prepare(TAG_TABLE).run();
    log.info_lv3(`${DEBUG}Tag table created successfully`);
  } catch (err) {
    log.error(`${DEBUG}Error creating Tag table: `, (err as Error).message);
  }

  try {
    db.prepare(UNIT_TABLE).run();
    log.info_lv3(`${DEBUG}Unit table created successfully`);
  } catch (err) {
    log.error(`${DEBUG}Error creating Unit table: `, (err as Error).message);
  }

  try {
    db.prepare(RECIPE_TABLE).run();
    log.info_lv3(`${DEBUG}Recipe table created successfully`);
  } catch (err) {
    log.error(`${DEBUG}Error creating Recipe table: `, (err as Error).message);
  }
}

export async function populateDatabase(db: Database.Database): Promise<void> {
  try {
    db.prepare(TAG_DATA).run();
    log.info_lv3(`${DEBUG}Tag data added successfully`);
  } catch (err) {
    log.error(`${DEBUG}Error adding Tag data: `, (err as Error).message);
  }

  try {
    db.prepare(UNIT_DATA).run();
    log.info_lv3(`${DEBUG}Unit data added successfully`);
  } catch (err) {
    log.error(`${DEBUG}Error adding Unit data: `, (err as Error).message);
  }

  try {
    db.prepare(RECIPE_DATA).run();
    log.info_lv3(`${DEBUG}Recipe data added successfully`);
  } catch (err) {
    log.error(`${DEBUG}Error adding Recipe data: `, (err as Error).message);
  }
}
