import { Request, Response } from 'express';
import { log } from '../../utility/helpers.ts';
import { db } from '../../services/db.service.ts';
import { DELETE_RECIPE_DATA, DELETE_TAG_DATA } from './sql-delete.ts';
import { IResponse } from '../../model/data-model.ts';

const DEBUG = 'db-delete | ';

class DBDelete {
  // Recipes
  public static deleteRecipe = async (req: Request, res: Response) => {
    const recipeId: number = parseInt(req.params['id']);
    let res_code = 200;
    let res_message: IResponse = { completed: true };
    log.info_lv2(`${DEBUG}deleteRecipe: ${recipeId}`);

    if (isNaN(recipeId)) {
      res_code = 500;
      res_message = { message: 'IDs missing or invalid' };
    } else {
      await db
        .run(DELETE_RECIPE_DATA, recipeId)
        .catch((err) => {
          log.error(`${DEBUG}deleteRecipe - Error: `, err.message);
          res_code = 500;
          res_message = { message: 'remove failed' };
        });
    }

    res.status(res_code).json(res_message);
  };

  // Tags
  public static deleteTag = async (req: Request, res: Response) => {
    const tagId: number = parseInt(req.params['id']);
    let res_code = 200;
    let res_message: IResponse = { completed: true };
    log.info_lv2(`${DEBUG}deleteTag: ${tagId}`);

    if (isNaN(tagId)) {
      res_code = 500;
      res_message = { message: 'IDs missing or invalid' };
    } else {
      await db
        .run(DELETE_TAG_DATA, tagId)
        .catch((err) => {
          log.error(`${DEBUG}deleteTag - Error: `, err.message);
          res_code = 500;
          res_message = { message: 'remove failed' };
        });
    }

    res.status(res_code).json(res_message);
  };
}

export default DBDelete;