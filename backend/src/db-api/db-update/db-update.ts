import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { IRecipe, IResponse, ITags } from '../../model/data-model.ts';
import { log } from '../../utility/helpers.ts';
import  DBService from '../../services/db.service.ts';
import { UPDATE_RECIPE_DATA, UPDATE_TAG_DATA } from './sql-update.ts';

const DEBUG = 'db-update | ';

class DBUpdate {
  // Recipes
  static updateRecipe = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const recipeId: number = parseInt(req.params['id']);
      const recipeData: IRecipe = req.body;
      let resCode = 200;
      let resMessage: IResponse = { completed: true };

      log.info_lv2(`${DEBUG}updateRecipe: ${recipeId}`);
      if (isNaN(recipeId)) {
        resCode = 500;
        resMessage = { message: 'IDs missing or invalid' };
      } else {
        await DBService.db.run(UPDATE_RECIPE_DATA, JSON.stringify(recipeData), recipeId).catch((err) => {
          log.error(`${DEBUG}updateRecipe - Error: `, err.message);
          resCode = 500;
          resMessage = { message: 'update failed' };
        });
      }

      res.status(resCode).json(resMessage);
    }
  };

  // Tags
  static updateTag = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const tagId: number = parseInt(req.params['id']);
      const tagData: ITags = req.body;
      let resCode = 200;
      let resMessage: IResponse = { completed: true };
      log.info_lv2(`${DEBUG}updateTag: ${tagId}`);

      if (isNaN(tagId) || tagId !== tagData.id) {
        resCode = 500;
        resMessage = { message: 'IDs missing or invalid' };
      } else {
        await DBService.db.run(UPDATE_TAG_DATA, tagData.type, tagData.tag, tagId).catch((err) => {
          log.error(`${DEBUG}updateTag - Error: `, err.message);
          resCode = 500;
          resMessage = { message: 'update failed' };
        });
      }

      res.status(resCode).json(resMessage);
    }
  };
}

export default DBUpdate;
