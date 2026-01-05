import { Request, Response } from 'express';
import * as fs from 'fs';

import DBService from '../../services/db.service.ts';
import { log } from '../../utility/helpers.ts';
import { ICard, IResponse, ITags, IUnit } from '../../model/data-model.ts';
import {
  RECIPE_CLEAR_DATA,
  RECIPE_DATA,
  RECIPE_TABLE,
  TAG_CLEAR_DATA,
  TAG_DATA,
  TAG_TABLE,
  UNIT_CLEAR_DATA,
  UNIT_DATA,
  UNIT_TABLE,
} from './sql-restore.ts';

const DEBUG = 'db-restore | ';

const BACKUP_DIR = './backup';

class DBRestore {
  private static readFile = (what: string): any => {
    let jsonData = null;
    const data = fs.readFileSync(what, 'utf-8');
    console.log(JSON.parse(data));
    jsonData = JSON.parse(data);

    return jsonData;
  };

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

  private static truncateDatabase = async (): Promise<void> => {
    await DBService.db
      .run(TAG_CLEAR_DATA)
      .then(() => log.info_lv3(`${DEBUG}Tag data truncated`))
      .catch((err: Error) => log.error(`${DEBUG}Error truncating Tag data: `, err.message));

    await DBService.db
      .run(UNIT_CLEAR_DATA)
      .then(() => log.info_lv3(`${DEBUG}Unit data truncated successfully`))
      .catch((err: Error) => log.error(`${DEBUG}Error truncating Unit data: `, err.message));

    try {
      await DBService.db
        .run(RECIPE_CLEAR_DATA)
        .then(() => log.info_lv3(`${DEBUG}Recipe data truncated successfully`))
        .catch((err: Error) => log.error(`${DEBUG}Error truncating Recipe data: `, err.message));
    } catch (e) {
      log.error(`${DEBUG}Error adding Recipe data: `, e as unknown as string);
    }
  };

  private static populateDatabase = async (): Promise<void> => {
    const unitData = DBRestore.readFile(`${BACKUP_DIR}/units.json`);
    let jsonUnits = '';
    unitData.forEach((unit: IUnit) => {
      jsonUnits += `(${unit.id}, '${unit.title}', '${unit.unit}', '${unit.abbreviation}'),`;
    });

    const tagData = DBRestore.readFile(`${BACKUP_DIR}/tags.json`);
    let jsonTags = '';
    tagData.forEach((tag: ITags) => {
      jsonTags += `(${tag.id}, '${tag.type}', '${tag.tag}'),`;
    });

    const recipeData = DBRestore.readFile(`${BACKUP_DIR}/recipes.json`);
    let jsonCards = '';
    recipeData.forEach((recipe: ICard) => {
      jsonCards += `(${recipe.id}, '${recipe.card}'),`;
    });

    await DBService.db
      .run(`${TAG_DATA} ${jsonTags.replace(/,$/, '')}`)
      .then(() => log.info_lv3(`${DEBUG}Tag data restored successfully`))
      .catch((err: Error) => log.error(`${DEBUG}Error adding Tag data: `, err.message));

    await DBService.db
      .run(`${UNIT_DATA} ${jsonUnits.replace(/,$/, '')}`)
      .then(() => log.info_lv3(`${DEBUG}Unit data restored successfully`))
      .catch((err: Error) => log.error(`${DEBUG}Error adding Unit data: `, err.message));

    try {
      await DBService.db
        .run(`${RECIPE_DATA} ${jsonCards.replace(/,$/, '')}`)
        .then(() => log.info_lv3(`${DEBUG}Recipe data restored successfully`))
        .catch((err: Error) => log.error(`${DEBUG}Error adding Recipe data: `, err.message));
    } catch (e) {
      log.error(`${DEBUG}Error adding Recipe data: `, e as unknown as string);
    }
  };

  static dbRestore = async (req: Request, res: Response): Promise<void> => {
    let resCode = 200;
    let resMessage: IResponse = { completed: true };
    log.info_lv2(`${DEBUG}dbRestore`);
    if (!fs.existsSync(BACKUP_DIR)) {
      log.info_lv2(`${DEBUG}Database backup folder does not exist.`);
      resCode = 404;
      resMessage = { completed: false };
    } else {
      await DBRestore.createDatabase();
      await DBRestore.truncateDatabase();
      await DBRestore.populateDatabase();
    }
    res.status(resCode).json(resMessage);
  };
}
export default DBRestore;
