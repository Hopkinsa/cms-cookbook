import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { IRecipe, ITags } from "../../model/data-model";
import { log } from '../../utility/helpers.ts';
import { db } from '../../services/db.service.ts';
import { UPDATE_RECIPE_DATA, UPDATE_TAG_DATA } from './sql-update.ts';
import { IResponse } from '../../model/data-model.ts';

const DEBUG = 'db-update | ';

class DBUpdate {
  // Recipes
  public static updateRecipe = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    }
    else {
      const recipeId: number = parseInt(req.params['id']);
      const recipeData: IRecipe = req.body;
      let res_code = 200;
      let res_message: IResponse = { completed: true };

      log.info_lv2(`${DEBUG}updateRecipe: ${recipeId}`);
      if (isNaN(recipeId)) {
        res_code = 500;
        res_message = { message: 'IDs missing or invalid' };
      } else {
        await db
          .run(UPDATE_RECIPE_DATA, JSON.stringify(recipeData), recipeId)
          .catch((err) => {
            log.error(`${DEBUG}updateRecipe - Error: `, err.message);
            res_code = 500;
            res_message = { message: 'update failed' };
          });
      }

      res.status(res_code).json(res_message);
    }
  };

  // Tags
  public static updateTag = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    }
    else {
      const tagId: number = parseInt(req.params['id']);
      const tagData: ITags = req.body;
      let res_code = 200;
      let res_message: IResponse = { completed: true };
      log.info_lv2(`${DEBUG}updateTag: ${tagId}`);

      if (isNaN(tagId) || tagId !== tagData.id) {
        res_code = 500;
        res_message = { message: 'IDs missing or invalid' };
      } else {
        await db
          .run(UPDATE_TAG_DATA, tagData.type, tagData.tag, tagId)
          .catch((err) => {
            log.error(`${DEBUG}updateTag - Error: `, err.message);
            res_code = 500;
            res_message = { message: 'update failed' };
          });
      }

      res.status(res_code).json(res_message);
    }
  };
}

export default DBUpdate;