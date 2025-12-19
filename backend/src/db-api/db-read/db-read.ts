import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { log } from '../../utility/helpers.ts';
import { db } from '../../services/db.service.ts';
import { ICard, IRecipe, ITags, IUnit } from '../../model/data-model.ts';
import { FIND_RECIPE_BY_ID, FIND_RECIPES, FIND_UNIT_BY_ID, GET_RECIPES, GET_TAGS, GET_UNITS } from './sql-read.ts';
import { IResponse } from '../../model/data-model.ts';

const DEBUG = 'db-read | ';

class DBRead {
  // Recipes
  static findRecipeByID = async (req: Request, res: Response): Promise<void> => {
    const recipeId: number = parseInt(req.params['id']);
    log.info_lv2(`${DEBUG}findRecipeByID: ${recipeId}`);
    let recipe: ICard | undefined;
    let resCode = 200;
    let resMessage: string | IRecipe = '';
    await db
      .get(FIND_RECIPE_BY_ID, recipeId)
      .then((data) => {
        recipe = data as unknown as ICard;
      })
      .catch((err) => {
        log.error(`${DEBUG}findRecipeByID - Error: `, err.message);
      });

    if (recipe !== undefined) {
      const cardDecode: IRecipe = JSON.parse(recipe.card as unknown as string);
      resCode = 200;
      resMessage = cardDecode;
    } else {
      resCode = 404;
      resMessage = 'Recipe not found';
    }

    res.status(resCode).json(resMessage);
  };

  static getRecipes = async (req: Request, res: Response): Promise<void> => {
    log.info_lv2(`${DEBUG}getRecipes`);
    let recipes: IRecipe[] | undefined;
    let resCode = 200;
    let resMessage: string | IRecipe[] = '';
    await db
      .all(GET_RECIPES)
      .then((data) => {
        recipes = data as unknown as IRecipe[];
      })
      .catch((err) => {
        log.error(`${DEBUG}getRecipes - Error: `, err.message);
      });

    if (recipes !== undefined) {
      resCode = 200;
      resMessage = recipes;
    } else {
      resCode = 404;
      resMessage = 'Recipe not found';
    }

    res.status(resCode).json(resMessage);
  };

  static findRecipes = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      log.info_lv2(`${DEBUG}findRecipes: ${req.query.terms}`);
      let recipes: IRecipe[] | undefined;
      const terms = '%' + req.query.terms + '%';
      let resCode = 200;
      let resMessage: string | IRecipe[] = '';
      await db
        .all(FIND_RECIPES, terms)
        .then((data) => {
          recipes = data as unknown as IRecipe[];
        })
        .catch((err) => {
          log.error(`${DEBUG}findRecipes - Error: `, err.message);
        });

      if (recipes !== undefined) {
        resCode = 200;
        resMessage = recipes;
      } else {
        resCode = 404;
        resMessage = 'Recipes not found';
      }

      res.status(resCode).json(resMessage);
    }
  };

  // Units
  static findUnitByID = async (req: Request, res: Response): Promise<void> => {
    const unitId: number = parseInt(req.params['id']);
    log.info_lv2(`${DEBUG}findUnitByID: ${unitId}`);
    let unit: IUnit | undefined;
    let resCode = 200;
    let resMessage: IResponse | IUnit;
    await db
      .get(FIND_UNIT_BY_ID, unitId)
      .then((data) => {
        unit = data as unknown as IUnit;
      })
      .catch((err) => {
        log.error(`${DEBUG}findUnitByID - Error: `, err.message);
      });

    if (unit !== undefined) {
      resCode = 200;
      resMessage = unit;
    } else {
      resCode = 404;
      resMessage = { message: 'No unit found' };
    }

    res.status(resCode).json(resMessage);
  };

  static getUnits = async (req: Request, res: Response): Promise<void> => {
    log.info_lv2(`${DEBUG}getUnits`);
    let units: IUnit[] | undefined;
    let resCode = 200;
    let resMessage: IResponse | IUnit[];
    await db
      .all(GET_UNITS)
      .then((data) => {
        units = data as unknown as IUnit[];
      })
      .catch((err) => {
        log.error(`${DEBUG}getUnits - Error: `, err.message);
      });

    if (units !== undefined) {
      resCode = 200;
      resMessage = units;
    } else {
      resCode = 404;
      resMessage = { message: 'No units found' };
    }

    res.status(resCode).json(resMessage);
  };

  // Tags
  static findTagByID = async (req: Request, res: Response): Promise<void> => {
    const tagId: number = parseInt(req.params['id']);
    log.info_lv2(`${DEBUG}findTagByID: ${tagId}`);
    let tag: ITags | undefined;
    let resCode = 200;
    let resMessage: IResponse | ITags;
    await db
      .get(FIND_UNIT_BY_ID, tagId)
      .then((data) => {
        tag = data as unknown as ITags;
      })
      .catch((err) => {
        log.error(`${DEBUG}findTagByID - Error: `, err.message);
      });

    if (tag !== undefined) {
      resCode = 200;
      resMessage = tag;
    } else {
      resCode = 404;
      resMessage = { message: 'No tag found' };
    }

    res.status(resCode).json(resMessage);
  };

  static getTags = async (req: Request, res: Response): Promise<void> => {
    log.info_lv2(`${DEBUG}getTags`);
    let tags: ITags[] | undefined;
    let resCode = 200;
    let resMessage: IResponse | ITags[];
    await db
      .all(GET_TAGS)
      .then((data) => {
        tags = data as unknown as ITags[];
      })
      .catch((err) => {
        log.error(`${DEBUG}getTags - Error: `, err.message);
      });

    if (tags !== undefined) {
      resCode = 200;
      resMessage = tags;
    } else {
      resCode = 404;
      resMessage = { message: 'No tags found' };
    }

    res.status(resCode).json(resMessage);
  };
}

export default DBRead;
