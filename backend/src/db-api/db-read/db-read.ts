import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { log } from '../../utility/helpers.ts';
import { db } from '../../services/db.service.ts';
import { ICard, IRecipe, ITags, IUnit } from '../../model/data-model.ts';
import { FIND_RECIPE_BY_ID, GET_RECIPES, FIND_RECIPES, FIND_UNIT_BY_ID, GET_UNITS, GET_TAGS } from './sql-read.ts';
import { IResponse } from '../../model/data-model.ts';

const DEBUG = 'db-read | ';

class DBRead {
  // Recipes
  public static findRecipeByID = async (req: Request, res: Response) => {
    const recipeId: number = parseInt(req.params['id']);
    log.info_lv2(`${DEBUG}findRecipeByID: ${recipeId}`);
    let recipe: ICard | undefined;
    let res_code = 200;
    let res_message: string | IRecipe = '';
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
      res_code = 200;
      res_message = cardDecode;
    } else {
      res_code = 404;
      res_message = 'Recipe not found';
    }

    res.status(res_code).json(res_message);
  };

  public static getRecipes = async (req: Request, res: Response) => {
    log.info_lv2(`${DEBUG}getRecipes`);
    let recipes: IRecipe[] | undefined;
    let res_code = 200;
    let res_message: string | IRecipe[] = '';
    await db
      .all(GET_RECIPES)
      .then((data) => {
        recipes = data as unknown as IRecipe[];
      })
      .catch((err) => {
        log.error(`${DEBUG}getRecipes - Error: `, err.message);
      });

    if (recipes !== undefined) {
      res_code = 200;
      res_message = recipes;
    } else {
      res_code = 404;
      res_message = 'Recipe not found';
    }

    res.status(res_code).json(res_message);
  };

  public static findRecipes = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      log.info_lv2(`${DEBUG}findRecipes: ${req.query.terms}`);
      let recipes: IRecipe[] | undefined;
      const terms = '%' + req.query.terms + '%';
      let res_code = 200;
      let res_message: string | IRecipe[] = '';
      await db
        .all(FIND_RECIPES, terms)
        .then((data) => {
          recipes = data as unknown as IRecipe[];
        })
        .catch((err) => {
          log.error(`${DEBUG}findRecipes - Error: `, err.message);
        });

      if (recipes !== undefined) {
        res_code = 200;
        res_message = recipes;
      } else {
        res_code = 404;
        res_message = 'Recipes not found';
      }

      res.status(res_code).json(res_message);
    }
  };

  // Units
  public static findUnitByID = async (req: Request, res: Response) => {
    const unitId: number = parseInt(req.params['id']);
    log.info_lv2(`${DEBUG}findUnitByID: ${unitId}`);
    let unit: IUnit | undefined;
    let res_code = 200;
    let res_message: IResponse | IUnit;
    await db
      .get(FIND_UNIT_BY_ID, unitId)
      .then((data) => {
        unit = data as unknown as IUnit;
      })
      .catch((err) => {
        log.error(`${DEBUG}findUnitByID - Error: `, err.message);
      });

    if (unit !== undefined) {
      res_code = 200;
      res_message = unit;
    } else {
      res_code = 404;
      res_message = { message: 'No unit found' };
    }

    res.status(res_code).json(res_message);
  };

  public static getUnits = async (req: Request, res: Response) => {
    log.info_lv2(`${DEBUG}getUnits`);
    let units: IUnit[] | undefined;
    let res_code = 200;
    let res_message: IResponse | IUnit[];
    await db
      .all(GET_UNITS)
      .then((data) => {
        units = data as unknown as IUnit[];
      })
      .catch((err) => {
        log.error(`${DEBUG}getUnits - Error: `, err.message);
      });

    if (units !== undefined) {
      res_code = 200;
      res_message = units;
    } else {
      res_code = 404;
      res_message = { message: 'No units found' };
    }

    res.status(res_code).json(res_message);
  };

  // Tags
  public static findTagByID = async (req: Request, res: Response) => {
    const tagId: number = parseInt(req.params['id']);
    log.info_lv2(`${DEBUG}findTagByID: ${tagId}`);
    let tag: ITags | undefined;
    let res_code = 200;
    let res_message: IResponse | ITags;
    await db
      .get(FIND_UNIT_BY_ID, tagId)
      .then((data) => {
        tag = data as unknown as ITags;
      })
      .catch((err) => {
        log.error(`${DEBUG}findTagByID - Error: `, err.message);
      });

    if (tag !== undefined) {
      res_code = 200;
      res_message = tag;
    } else {
      res_code = 404;
      res_message = { message: 'No tag found' };
    }

    res.status(res_code).json(res_message);
  };

  public static getTags = async (req: Request, res: Response) => {
    log.info_lv2(`${DEBUG}getTags`);
    let tags: ITags[] | undefined;
    let res_code = 200;
    let res_message: IResponse | ITags[];
    await db
      .all(GET_TAGS)
      .then((data) => {
        tags = data as unknown as ITags[];
      })
      .catch((err) => {
        log.error(`${DEBUG}getTags - Error: `, err.message);
      });

    if (tags !== undefined) {
      res_code = 200;
      res_message = tags;
    } else {
      res_code = 404;
      res_message = { message: 'No tags found' };
    }

    res.status(res_code).json(res_message);
  };
}

export default DBRead;
