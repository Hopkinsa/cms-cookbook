import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';

import { log } from '../../utility/helpers.ts'
import { TAG_TABLE, RECIPE_TABLE, UNIT_TABLE, RECIPE_DATA, UNIT_DATA, TAG_DATA } from './sql-init.ts';

const DEBUG = 'db-init | ';

export async function createDatabase(db: Database<sqlite3.Database, sqlite3.Statement>) {
    await db.run(TAG_TABLE)
        .then(() => log.info_lv3(`${DEBUG}Tag table created successfully`))
        .catch((err) => log.error(`${DEBUG}Error creating Tag table: `, err.message));

    await db.run(UNIT_TABLE)
        .then(() => log.info_lv3(`${DEBUG}Unit table created successfully`))
        .catch((err) => log.error(`${DEBUG}Error creating Unit table: `, err.message));

    await db.run(RECIPE_TABLE)
        .then(() => log.info_lv3(`${DEBUG}Recipe table created successfully`))
        .catch((err) => log.error(`${DEBUG}Error creating Recipe table: `, err.message));
}

export async function populateDatabase(db: Database<sqlite3.Database, sqlite3.Statement>) {
    await db.run(TAG_DATA).then(() => log.info_lv3(`${DEBUG}Tag data added successfully`))
        .catch((err) => log.error(`${DEBUG}Error adding Tag data: `, err.message));

    await db.run(UNIT_DATA).then(() => log.info_lv3(`${DEBUG}Unit data added successfully`))
        .catch((err) => log.error(`${DEBUG}Error adding Unit data: `, err.message));

    try {
    await db.run(RECIPE_DATA)
        .then(() => log.info_lv3(`${DEBUG}Recipe data added successfully`))
        .catch((err) => log.error(`${DEBUG}Error adding Recipe data: `, err.message));
    } catch(e) {
        log.error(`${DEBUG}Error adding Recipe data: `, e as any);
    }
}
