import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import QueryString from 'qs';

import { log, routeParamInt } from '../../utility/helpers.ts';
import DBService from '../../services/db.service.ts';
import { ICard, IRecipe, IResponse, ISearchResults, ITags, IUnit } from '../../model/data-model.ts';
import {
  FIND_RECIPE_BY_ID,
  FIND_RECIPES,
  FIND_RECIPES_TOTAL,
  FIND_UNIT_BY_ID,
  GET_RECIPES,
  GET_RECIPES_TOTAL,
  GET_TAGS,
  GET_UNITS,
} from './sql-read.ts';

const DEBUG = 'db-read | ';

type paramPrep = {
  sort: { target: string; direction: string };
  page: { offset: number; quantity: number };
  terms: string;
  total: number;
};

class DBRead {
  static prepParemeters(queryString: QueryString.ParsedQs): paramPrep {
    // default values if nothing passed in query string
    const response: paramPrep = {
      sort: { target: 'title', direction: 'asc' },
      page: { offset: 0, quantity: 0 },
      terms: '',
      total: 0,
    };

    // Sorting parameters
    if (queryString.t) {
      // title
      let tmpTarget = queryString.t as string;
      if (tmpTarget === 'created' || tmpTarget === 'updated') {
        tmpTarget = `date_${tmpTarget}`;
      }
      response.sort.target = tmpTarget;
    }
    if (queryString.d) {
      // direction
      const tmpDirection = (queryString.d as string).toLowerCase() === 'asc' ? 'asc' : 'desc';
      response.sort.direction = tmpDirection;
    }

    // Pagination parameters
    if (queryString.o) {
      // offset
      const tmpOffset = 0;
      response.page.offset = tmpOffset;
    }
    if (queryString.q) {
      // quantity per page
      const tmpQuantity = 0;
      response.page.quantity = tmpQuantity;
    }

    if (queryString.terms) {
      //search terms
      const tmpTerms = queryString.terms as string;
      response.terms = tmpTerms;
    }
    return response;
  }

  // Recipes
  static findRecipeByID = async (req: Request, res: Response): Promise<void> => {
    const recipeId: number = routeParamInt(req.params['id']);
    log.info_lv2(`${DEBUG}findRecipeByID: ${recipeId}`);
    let recipe: ICard | undefined;
    let resCode = 200;
    let resMessage: string | IRecipe = '';
    try {
      recipe = DBService.db.prepare(FIND_RECIPE_BY_ID).get(recipeId) as ICard | undefined;
    } catch (err) {
      log.error(`${DEBUG}findRecipeByID - Error: `, (err as Error).message);
    }

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const param = DBRead.prepParemeters(req.query);
      log.info_lv2(`${DEBUG}getRecipes - ${param.sort.target} ${param.sort.direction.toUpperCase()}`);

      let recipes: IRecipe[] | undefined;
      let resCode = 200;
      let resMessage: string | ISearchResults = '';
      try {
        const totalData = DBService.db.prepare(GET_RECIPES_TOTAL).all() as Array<{ total: number }>;
        if (totalData[0] !== null && totalData[0] !== undefined) {
          param.total = totalData[0].total;
        }
      } catch (err) {
        log.error(`${DEBUG}getRecipes - Error: `, (err as Error).message);
      }

      try {
        recipes = DBService.db
          .prepare(`${GET_RECIPES} ${param.sort.target} ${param.sort.direction.toUpperCase()}`)
          .all() as IRecipe[];
      } catch (err) {
        log.error(`${DEBUG}getRecipes - Error: `, (err as Error).message);
      }
      if (recipes !== undefined) {
        resCode = 200;
        resMessage = {
          total: param.total,
          page: param.page,
          sort: param.sort,
          results: recipes,
        };
      } else {
        resCode = 404;
        resMessage = 'Recipe not found';
      }

      res.status(resCode).json(resMessage);
    }
  };

  static findRecipes = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const param = DBRead.prepParemeters(req.query);
      log.info_lv2(`${DEBUG}findRecipes - ${param.sort.target} ${param.sort.direction.toUpperCase()}`);
      log.info_lv3(`${req.query.terms}`);
      let recipes: IRecipe[] | undefined;
      let resCode = 200;
      let resMessage: string | ISearchResults = '';
      try {
        const totalData = DBService.db.prepare(FIND_RECIPES_TOTAL).all(`%${param.terms}%`) as Array<{ total: number }>;
        if (totalData[0] !== null && totalData[0] !== undefined) {
          param.total = totalData[0].total;
        }
      } catch (err) {
        log.error(`${DEBUG}getRecipes - Error: `, (err as Error).message);
      }

      let sortResults = `${param.sort.target} ${param.sort.direction.toUpperCase()}`;
      if (param.sort.target !== 'title') {
        sortResults += ', title ASC';
      }

      try {
        recipes = DBService.db.prepare(`${FIND_RECIPES} ${sortResults}`).all(`%${param.terms}%`) as IRecipe[];
      } catch (err) {
        log.error(`${DEBUG}findRecipes - Error: `, (err as Error).message);
      }

      if (recipes !== undefined) {
        resCode = 200;
        resMessage = {
          total: param.total,
          page: param.page,
          sort: param.sort,
          terms: param.terms,
          results: recipes,
        };
      } else {
        resCode = 404;
        resMessage = 'Recipes not found';
      }

      res.status(resCode).json(resMessage);
    }
  };

  // Units
  static findUnitByID = async (req: Request, res: Response): Promise<void> => {
    const unitId: number = routeParamInt(req.params['id']);
    log.info_lv2(`${DEBUG}findUnitByID: ${unitId}`);
    let unit: IUnit | undefined;
    let resCode = 200;
    let resMessage: IResponse | IUnit;
    try {
      unit = DBService.db.prepare(FIND_UNIT_BY_ID).get(unitId) as IUnit | undefined;
    } catch (err) {
      log.error(`${DEBUG}findUnitByID - Error: `, (err as Error).message);
    }

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
    try {
      units = DBService.db.prepare(GET_UNITS).all() as IUnit[];
    } catch (err) {
      log.error(`${DEBUG}getUnits - Error: `, (err as Error).message);
    }

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
    const tagId: number = routeParamInt(req.params['id']);
    log.info_lv2(`${DEBUG}findTagByID: ${tagId}`);
    let tag: ITags | undefined;
    let resCode = 200;
    let resMessage: IResponse | ITags;
    try {
      tag = DBService.db.prepare(FIND_UNIT_BY_ID).get(tagId) as ITags | undefined;
    } catch (err) {
      log.error(`${DEBUG}findTagByID - Error: `, (err as Error).message);
    }

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
    try {
      tags = DBService.db.prepare(GET_TAGS).all() as ITags[];
    } catch (err) {
      log.error(`${DEBUG}getTags - Error: `, (err as Error).message);
    }

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
