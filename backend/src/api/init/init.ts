import Database from 'better-sqlite3';

import { log } from '../../utility/helpers.ts';
import {
  PASSWORD_RESET_TOKENS_TABLE,
  PERMISSION_DATA,
  PERMISSIONS_TABLE,
  RECIPE_DATA,
  RECIPE_TABLE,
  TAG_DATA,
  TAG_TABLE,
  UNIT_DATA,
  UNIT_TABLE,
  USER_PERMISSIONS_TABLE,
  USERS_TABLE,
} from './init.sql.ts';

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

  try {
    db.prepare(USERS_TABLE).run();
    log.info_lv3(`${DEBUG}User table created successfully`);
  } catch (err) {
    log.error(`${DEBUG}Error creating User table: `, (err as Error).message);
  }

  try {
    db.prepare(PERMISSIONS_TABLE).run();
    log.info_lv3(`${DEBUG}Permissions table created successfully`);
  } catch (err) {
    log.error(`${DEBUG}Error creating Permissions table: `, (err as Error).message);
  }

  try {
    db.prepare(USER_PERMISSIONS_TABLE).run();
    log.info_lv3(`${DEBUG}User permissions table created successfully`);
  } catch (err) {
    log.error(`${DEBUG}Error creating User permissions table: `, (err as Error).message);
  }

  try {
    db.prepare(PASSWORD_RESET_TOKENS_TABLE).run();
    log.info_lv3(`${DEBUG}Password reset token table created successfully`);
  } catch (err) {
    log.error(`${DEBUG}Error creating Password reset token table: `, (err as Error).message);
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

export async function seedAuthDatabase(db: Database.Database): Promise<void> {
  try {
    db.prepare(PERMISSION_DATA).run();
    log.info_lv3(`${DEBUG}Permission data added successfully`);
  } catch (err) {
    log.error(`${DEBUG}Error adding Permission data: `, (err as Error).message);
  }
}
