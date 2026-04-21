import { Request, Response } from 'express';

import { ICard, IRecipe, ISearchResults } from '../../model/data-model.ts';
import { log, routeParamInt } from '../../utility/helpers.ts';
import { executeReadAll, executeReadGet, handleReadValidationFailure } from '../shared/read-handler.ts';
import { prepareReadParameters } from './recipe-read-parameters.ts';
import { FIND_RECIPE_BY_ID, FIND_RECIPES, FIND_RECIPES_TOTAL, GET_RECIPES, GET_RECIPES_TOTAL } from './recipe-sql.ts';

const DEBUG = 'recipe-read | ';

export async function findRecipeByID(req: Request, res: Response): Promise<void> {
  const recipeId = routeParamInt(req.params['id']);
  log.info_lv2(`${DEBUG}findRecipeByID: ${recipeId}`);

  const recipe = executeReadGet<ICard>(FIND_RECIPE_BY_ID, [recipeId], `${DEBUG}findRecipeByID`);
  if (recipe !== undefined) {
    res.status(200).json(JSON.parse(recipe.card as unknown as string) as IRecipe);
    return;
  }

  res.status(404).json('Recipe not found');
}

export async function getRecipes(req: Request, res: Response): Promise<void> {
  if (handleReadValidationFailure(req, res)) {
    return;
  }

  const param = prepareReadParameters(req.query);
  log.info_lv2(`${DEBUG}getRecipes - ${param.sort.target} ${param.sort.direction.toUpperCase()}`);

  const totalData = executeReadAll<{ total: number }>(GET_RECIPES_TOTAL, [], `${DEBUG}getRecipes`);
  if (totalData?.[0] !== undefined) {
    param.total = totalData[0].total;
  }

  const recipes = executeReadAll<IRecipe>(
    `${GET_RECIPES} ${param.sort.target} ${param.sort.direction.toUpperCase()}`,
    [],
    `${DEBUG}getRecipes`,
  );

  if (recipes !== undefined) {
    const result: ISearchResults = {
      total: param.total,
      page: param.page,
      sort: param.sort,
      results: recipes,
    };

    res.status(200).json(result);
    return;
  }

  res.status(404).json('Recipe not found');
}

export async function findRecipes(req: Request, res: Response): Promise<void> {
  if (handleReadValidationFailure(req, res)) {
    return;
  }

  const param = prepareReadParameters(req.query);
  log.info_lv2(`${DEBUG}findRecipes - ${param.sort.target} ${param.sort.direction.toUpperCase()}`);
  log.info_lv3(`${req.query.terms}`);

  const totalData = executeReadAll<{ total: number }>(FIND_RECIPES_TOTAL, [`%${param.terms}%`], `${DEBUG}findRecipes`);
  if (totalData?.[0] !== undefined) {
    param.total = totalData[0].total;
  }

  let sortResults = `${param.sort.target} ${param.sort.direction.toUpperCase()}`;
  if (param.sort.target !== 'title') {
    sortResults += ', title ASC';
  }

  const recipes = executeReadAll<IRecipe>(
    `${FIND_RECIPES} ${sortResults}`,
    [`%${param.terms}%`],
    `${DEBUG}findRecipes`,
  );

  if (recipes !== undefined) {
    const result: ISearchResults = {
      total: param.total,
      page: param.page,
      sort: param.sort,
      terms: param.terms,
      results: recipes,
    };

    res.status(200).json(result);
    return;
  }

  res.status(404).json('Recipes not found');
}
