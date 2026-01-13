import { Request, Response } from 'express';
import AdmZip from 'adm-zip';

import { log } from '../../utility/helpers.ts';
import DBService from '../../services/db.service.ts';
import { IRecipe, IResponse, ITags, IUnit } from '../../model/data-model.ts';
import { GET_RECIPES, GET_TAGS, GET_UNITS } from './sql-backup.ts';

const DEBUG = 'db-backup | ';

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

    const tags = await DBBackup.getTags();
    let tagsFile = '';
    if (tags) {
      let last = tags.length;
      tagsFile += '[\n';
      tags.forEach((tag) => {
        last--;
        const stringify = JSON.stringify(tag);
        const terminator = last > 0 ? ',\n' : '\n';
        tagsFile += stringify + terminator;
      });
      tagsFile += ']\n';
      log.info_lv2(`${DEBUG} Tags and Categories backed up`);
    }

    const units = await DBBackup.getUnits();
    let unitsFile = '';
    if (units) {
      let last = units.length;
      unitsFile += '[\n';
      units.forEach((unit) => {
        last--;
        const stringify = JSON.stringify(unit);
        const terminator = last > 0 ? ',\n' : '\n';
        unitsFile += stringify + terminator;
      });
      unitsFile += ']\n';
      log.info_lv2(`${DEBUG} Units backed up`);
    }

    const recipes = await DBBackup.getRecipes();
    let recipeFile = '';
    if (recipes) {
      let last = recipes.length;
      recipeFile += '[\n';
      recipes.forEach((recipe) => {
        last--;
        const stringify = JSON.stringify(recipe);
        const terminator = last > 0 ? ',\n' : '\n';
        recipeFile += stringify + terminator;
      });
      recipeFile += ']\n';
      log.info_lv2(`${DEBUG} Recipes backed up`);
    }
    let resCode = 200;
    let resMessage: IResponse = { completed: true };

    if (tagsFile !== '' && unitsFile !== '' && recipeFile !== '') {
      const zip = new AdmZip();

      zip.addFile('tags.json', Buffer.from(tagsFile));
      zip.addFile('units.json', Buffer.from(unitsFile));
      zip.addFile('recipes.json', Buffer.from(recipeFile));
      const oDate = new Date();
      const ymdTime = `${oDate.getFullYear().toString().padStart(2, '0')}${(oDate.getMonth() + 1).toString().padStart(2, '0')}${oDate.getDate().toString().padStart(2, '0')}`;
      const hmsTime = `${oDate.getHours().toString().padStart(2, '0')}${oDate.getMinutes().toString().padStart(2, '0')}${oDate.getSeconds().toString().padStart(2, '0')}`;
      const downloadName = `backup-${ymdTime}${hmsTime}.zip`;

      const data = zip.toBuffer();
      res.set('Content-Type', 'application/octet-stream');
      res.set('Content-Disposition', `attachment; filename=${downloadName}`);
      res.set('Content-Length', `${data.length}`);
      res.status(resCode).send(data);
    } else {
      resCode = 500;
      resMessage = { completed: false };
      res.status(resCode).json(resMessage);
    }
  };
}

export default DBBackup;
