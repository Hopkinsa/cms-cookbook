import { Request, Response } from 'express';
import { log } from '../../utility/helpers.ts';
import { db } from '../../services/db.service.ts';
import { DELETE_RECIPE_DATA, DELETE_TAG_DATA } from './sql-delete.ts';
import { IResponse } from '../../model/data-model.ts';

const DEBUG = 'db-delete | ';

class DBDelete {
  // Recipes
  static deleteRecipe = async (req: Request, res: Response): Promise<void> => {
    const recipeId: number = parseInt(req.params['id']);
    let resCode = 200;
    let resMessage: IResponse = { completed: true };
    log.info_lv2(`${DEBUG}deleteRecipe: ${recipeId}`);

    if (isNaN(recipeId)) {
      resCode = 500;
      resMessage = { message: 'IDs missing or invalid' };
    } else {
      await db.run(DELETE_RECIPE_DATA, recipeId).catch((err) => {
        log.error(`${DEBUG}deleteRecipe - Error: `, err.message);
        resCode = 500;
        resMessage = { message: 'remove failed' };
      });
    }

    res.status(resCode).json(resMessage);
  };

  // Tags
  static deleteTag = async (req: Request, res: Response): Promise<void> => {
    const tagId: number = parseInt(req.params['id']);
    let resCode = 200;
    let resMessage: IResponse = { completed: true };
    log.info_lv2(`${DEBUG}deleteTag: ${tagId}`);

    if (isNaN(tagId)) {
      resCode = 500;
      resMessage = { message: 'IDs missing or invalid' };
    } else {
      await db.run(DELETE_TAG_DATA, tagId).catch((err) => {
        log.error(`${DEBUG}deleteTag - Error: `, err.message);
        resCode = 500;
        resMessage = { message: 'remove failed' };
      });
    }

    res.status(resCode).json(resMessage);
  };
}

export default DBDelete;
