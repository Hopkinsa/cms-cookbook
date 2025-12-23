import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { IRecipe, IResponse, ITags } from '../../model/data-model.ts';
import { log } from '../../utility/helpers.ts';
import  DBService from '../../services/db.service.ts';
import { CREATE_RECIPE_DATA, CREATE_TAG_DATA } from './sql-create.ts';

const DEBUG = 'db-create | ';

class DBCreate {
  // Recipes
  static createRecipe = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const recipeData: IRecipe = req.body;
      recipeData.date_created = Date.now();
      recipeData.date_updated = Date.now();

      let resCode = 200;
      let resMessage: IResponse = { completed: true };
      log.info_lv2(`${DEBUG}createRecipe`);

      const data = JSON.stringify(recipeData);
      await DBService.db.run(CREATE_RECIPE_DATA, `${data}`).catch((err) => {
        log.error(`${DEBUG}createRecipe - Error: `, err.message);
        resCode = 500;
        resMessage = { message: 'create failed' };
      });

      res.status(resCode).json(resMessage);
    }
  };

  // Tags
  static createTag = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const tagData: ITags = req.body;
      let resCode = 200;
      let resMessage: IResponse = { completed: true };
      log.info_lv2(`${DEBUG}createTag`);

      await DBService.db.run(CREATE_TAG_DATA, tagData.type, tagData.tag).catch((err) => {
        log.error(`${DEBUG}createTag - Error: `, err.message);
        resCode = 500;
        resMessage = { message: 'create failed' };
      });

      res.status(resCode).json(resMessage);
    }
  };
}

export default DBCreate;
