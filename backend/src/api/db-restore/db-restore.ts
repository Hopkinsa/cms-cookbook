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
    try {
      DBService.db.prepare(TAG_TABLE).run();
      log.info_lv3(`${DEBUG}Tag table created successfully`);
    } catch (err) {
      log.error(`${DEBUG}Error creating Tag table: `, (err as Error).message);
    }

    try {
      DBService.db.prepare(UNIT_TABLE).run();
      log.info_lv3(`${DEBUG}Unit table created successfully`);
    } catch (err) {
      log.error(`${DEBUG}Error creating Unit table: `, (err as Error).message);
    }

    try {
      DBService.db.prepare(RECIPE_TABLE).run();
      log.info_lv3(`${DEBUG}Recipe table created successfully`);
    } catch (err) {
      log.error(`${DEBUG}Error creating Recipe table: `, (err as Error).message);
    }
  };

  private static truncateDatabase = async (): Promise<void> => {
    try {
      DBService.db.prepare(TAG_CLEAR_DATA).run();
      log.info_lv3(`${DEBUG}Tag data truncated`);
    } catch (err) {
      log.error(`${DEBUG}Error truncating Tag data: `, (err as Error).message);
    }

    try {
      DBService.db.prepare(UNIT_CLEAR_DATA).run();
      log.info_lv3(`${DEBUG}Unit data truncated successfully`);
    } catch (err) {
      log.error(`${DEBUG}Error truncating Unit data: `, (err as Error).message);
    }

    try {
      DBService.db.prepare(RECIPE_CLEAR_DATA).run();
      log.info_lv3(`${DEBUG}Recipe data truncated successfully`);
    } catch (err) {
      log.error(`${DEBUG}Error adding Recipe data: `, (err as Error).message);
    }
  };

  private static populateTagDatabase = async (tagData: ITags[]): Promise<void> => {
    let jsonTags = '';
    tagData.forEach((tag: ITags) => {
      jsonTags += `(${tag.id}, '${tag.type}', '${tag.tag}'),`;
    });
    try {
      DBService.db.prepare(`${TAG_DATA} ${jsonTags.replace(/,$/, '')}`).run();
      log.info_lv3(`${DEBUG}Tag data restored successfully`);
    } catch (err) {
      log.error(`${DEBUG}Error adding Tag data: `, (err as Error).message);
    }
  };

  private static populateUnitDatabase = async (unitData: IUnit[]): Promise<void> => {
    let jsonUnits = '';
    unitData.forEach((unit: IUnit) => {
      jsonUnits += `(${unit.id}, '${unit.title}', '${unit.unit}', '${unit.abbreviation}'),`;
    });
    try {
      DBService.db.prepare(`${UNIT_DATA} ${jsonUnits.replace(/,$/, '')}`).run();
      log.info_lv3(`${DEBUG}Unit data restored successfully`);
    } catch (err) {
      log.error(`${DEBUG}Error adding Unit data: `, (err as Error).message);
    }
  };
  private static populateRecipeDatabase = async (recipeData: ICard[]): Promise<void> => {
    let jsonCards = '';
    recipeData.forEach((recipe: ICard) => {
      // Escape single quotes in JSON string so the INSERT statement remains valid
      jsonCards += `(${recipe.id}, '${recipe.card.replace(/'/g, "''")}'),`;
    });

    try {
      DBService.db.prepare(`${RECIPE_DATA} ${jsonCards.replace(/,$/, '')}`).run();
      log.info_lv3(`${DEBUG}Recipe data restored successfully`);
    } catch (err) {
      log.error(`${DEBUG}Error adding Recipe data: `, (err as Error).message);
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
