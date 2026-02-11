import { Request, Response } from 'express';
import AdmZip from 'adm-zip';

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

  private static populateTagDatabase = async (tagData: ITags[]): Promise<void> => {
    let jsonTags = '';
    tagData.forEach((tag: ITags) => {
      jsonTags += `(${tag.id}, '${tag.type}', '${tag.tag}'),`;
    });
    await DBService.db
      .run(`${TAG_DATA} ${jsonTags.replace(/,$/, '')}`)
      .then(() => log.info_lv3(`${DEBUG}Tag data restored successfully`))
      .catch((err: Error) => log.error(`${DEBUG}Error adding Tag data: `, err.message));
  };

  private static populateUnitDatabase = async (unitData: IUnit[]): Promise<void> => {
    let jsonUnits = '';
    unitData.forEach((unit: IUnit) => {
      jsonUnits += `(${unit.id}, '${unit.title}', '${unit.unit}', '${unit.abbreviation}'),`;
    });
    await DBService.db
      .run(`${UNIT_DATA} ${jsonUnits.replace(/,$/, '')}`)
      .then(() => log.info_lv3(`${DEBUG}Unit data restored successfully`))
      .catch((err: Error) => log.error(`${DEBUG}Error adding Unit data: `, err.message));
  };
  private static populateRecipeDatabase = async (recipeData: ICard[]): Promise<void> => {
    let jsonCards = '';
    recipeData.forEach((recipe: ICard) => {
       // Escape single quotes in JSON string as will cause error in SQLite
      jsonCards += `(${recipe.id}, '${recipe.card.replace(/'/g, "''")}'),`;
    });

    try {
      await DBService.db
        .run(`${RECIPE_DATA} ${jsonCards.replace(/,$/, '')}`)
        .then(() => log.info_lv3(`${DEBUG}Recipe data restored successfully`))
        .catch((err: Error) => log.error(`${DEBUG}Error adding Recipe data: `, err.message));
    } catch (e) {
      log.error(`${DEBUG}Error adding Recipe data: `, e as unknown as string);
    }
  };

  static dbProcessUpload = async (req: Request): Promise<boolean> => {
    log.info_lv2(`${DEBUG}dbRestore - dbProcessUpload`);

    const zip = new AdmZip(req.file?.buffer);
    const zipEntries = zip.getEntries();
    if (zipEntries.length === 3) {
      await DBRestore.createDatabase();
      await DBRestore.truncateDatabase();

      zipEntries.forEach(async (zipEntry) => {
        if (zipEntry.name === 'tags.json') {
          const tagData = JSON.parse(zipEntry.getData().toString('utf8'));
          await DBRestore.populateTagDatabase(tagData);
        }
        if (zipEntry.name === 'units.json') {
          const unitData = JSON.parse(zipEntry.getData().toString('utf8'));
          await DBRestore.populateUnitDatabase(unitData);
        }
        if (zipEntry.name === 'recipes.json') {
          const recipeData = JSON.parse(zipEntry.getData().toString('utf8'));
          await DBRestore.populateRecipeDatabase(recipeData);
        }
      });
      return true;
    }

    return false;
  };

  static dbRestore = async (req: Request, res: Response): Promise<void> => {
    const file: string = !req.file ? 'No File' : req.file?.originalname;
    log.info_lv2(`${DEBUG}dbRestore: ${file}`);
    let ok = true;
    let resCode = 200;
    let resMessage: IResponse = { completed: true };

    if (!req.file) {
      ok = false;
    } else {
      ok = await DBRestore.dbProcessUpload(req);
    }
    if (ok) {
      resCode = 200;
      resMessage = { completed: true };
    } else {
      resCode = 400;
      resMessage = { completed: false };
    }
    res.status(resCode).json(resMessage);
  };
}
export default DBRestore;
