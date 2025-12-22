import { Request, Response } from 'express';
import * as fs from 'fs';

import { log } from '../../utility/helpers.ts';
import DBService from '../../services/db.service.ts';
import { IRecipe, ITags, IUnit } from '../../model/data-model.ts';
import { GET_RECIPES, GET_TAGS, GET_UNITS } from './sql-backup.ts';

const DEBUG = 'db-backup | ';

const BACKUP_DIR = './backup';

class DBBackup {
  // Recipes
  private static getRecipes = async (): Promise<IRecipe[] | null> => {
    log.info_lv2(`${DEBUG}getRecipes`);
    let recipes: IRecipe[] | undefined;
    await DBService.db
      .all(GET_RECIPES)
      .then((data) => {
        recipes = data as unknown as IRecipe[];
      })
      .catch((err) => {
        log.error(`${DEBUG}getRecipes - Error: `, err.message);
      });

    if (recipes !== undefined) {
      return recipes;
    }
    return null;
  };

  private static getTags = async (): Promise<ITags[] | null> => {
    log.info_lv2(`${DEBUG}getTags`);
    let tags: ITags[] | undefined;
    await DBService.db
      .all(GET_TAGS)
      .then((data) => {
        tags = data as unknown as ITags[];
      })
      .catch((err) => {
        log.error(`${DEBUG}getTags - Error: `, err.message);
      });
    if (tags !== undefined) {
      return tags;
    }
    return null;
  };

  private static getUnits = async (): Promise<IUnit[] | null> => {
    log.info_lv2(`${DEBUG}getUnits`);
    let units: IUnit[] | undefined;
    await DBService.db
      .all(GET_UNITS)
      .then((data) => {
        units = data as unknown as IUnit[];
      })
      .catch((err) => {
        log.error(`${DEBUG}getUnits - Error: `, err.message);
      });
    if (units !== undefined) {
      return units;
    }
    return null;
  };

  static dbBackup = async (req: Request, res: Response): Promise<void> => {
    log.info_lv2(`${DEBUG}dbBackup`);
    if (!fs.existsSync(BACKUP_DIR)) {
      log.info_lv2(`${DEBUG}Database folder does not exist.`);
      fs.mkdirSync(BACKUP_DIR);
    }

    const tags = await DBBackup.getTags();
    if (tags) {
      fs.writeFileSync(`${BACKUP_DIR}/tags.ts`, 'export const tagData = [\n', 'utf-8');
      tags.forEach((tag) => {
        const stringify = JSON.stringify(tag);
        fs.appendFileSync(`${BACKUP_DIR}/tags.ts`, stringify + ',\n', 'utf-8');
      });
      fs.appendFileSync(`${BACKUP_DIR}/tags.ts`, '];\n', 'utf-8');
      log.info_lv2(`${DEBUG} Tags and Categories backed up`);
    }

    const units = await DBBackup.getUnits();
    if (units) {
      fs.writeFileSync(`${BACKUP_DIR}/units.ts`, 'export const unitData = [\n', 'utf-8');
      units.forEach((unit) => {
        const stringify = JSON.stringify(unit);
        fs.appendFileSync(`${BACKUP_DIR}/units.ts`, stringify + ',\n', 'utf-8');
      });
      fs.appendFileSync(`${BACKUP_DIR}/units.ts`, '];\n', 'utf-8');
      log.info_lv2(`${DEBUG} Units backed up`);
    }

    const recipes = await DBBackup.getRecipes();
    if (recipes) {
      fs.writeFileSync(`${BACKUP_DIR}/recipes.ts`, 'export const recipeData = [\n', 'utf-8');
      recipes.forEach((recipe) => {
        const stringify = JSON.stringify(recipe);
        fs.appendFileSync(`${BACKUP_DIR}/recipes.ts`, stringify + ',\n', 'utf-8');
      });
      fs.appendFileSync(`${BACKUP_DIR}/recipes.ts`, '];\n', 'utf-8');
      log.info_lv2(`${DEBUG} Recipes backed up`);
    }
    const resCode = 200;
    const resMessage = 'OK';

    res.status(resCode).json(resMessage);
  };
}

export default DBBackup;
