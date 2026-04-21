import { Request, Response } from 'express';

import { IRecipe } from '../../model/data-model.ts';
import { log } from '../../utility/helpers.ts';
import {
  executeWriteStatement,
  getRouteId,
  handleValidationFailure,
  hasInvalidId,
  sendCompletedResponse,
  sendFailureResponse,
} from '../shared/write-handler.ts';
import { CREATE_RECIPE_DATA, DELETE_RECIPE_DATA, UPDATE_RECIPE_DATA } from './recipe-sql.ts';

const DEBUG = 'recipe-write | ';

function serializeRecipeCard(recipeData: IRecipe): string {
  return JSON.stringify(recipeData).replace(/&#x27;/g, "'");
}

export async function createRecipe(req: Request, res: Response): Promise<void> {
  if (handleValidationFailure(req, res)) {
    return;
  }

  const now = Date.now();
  const recipeData: IRecipe = {
    ...(req.body as IRecipe),
    date_created: now,
    date_updated: now,
  };

  log.info_lv2(`${DEBUG}createRecipe`);
  const ok = executeWriteStatement(CREATE_RECIPE_DATA, [serializeRecipeCard(recipeData)], `${DEBUG}createRecipe`);
  if (!ok) {
    sendFailureResponse(res, 'create failed');
    return;
  }

  sendCompletedResponse(res);
}

export async function updateRecipe(req: Request, res: Response): Promise<void> {
  if (handleValidationFailure(req, res)) {
    return;
  }

  const recipeId = getRouteId(req);
  const recipeData: IRecipe = {
    ...(req.body as IRecipe),
    date_updated: Date.now(),
  };

  log.info_lv2(`${DEBUG}updateRecipe: ${recipeId}`);
  if (hasInvalidId(recipeId)) {
    sendFailureResponse(res, 'IDs missing or invalid');
    return;
  }

  const ok = executeWriteStatement(
    UPDATE_RECIPE_DATA,
    [serializeRecipeCard(recipeData), recipeId],
    `${DEBUG}updateRecipe`,
  );
  if (!ok) {
    sendFailureResponse(res, 'update failed');
    return;
  }

  sendCompletedResponse(res);
}

export async function deleteRecipe(req: Request, res: Response): Promise<void> {
  const recipeId = getRouteId(req);
  log.info_lv2(`${DEBUG}deleteRecipe: ${recipeId}`);

  if (hasInvalidId(recipeId)) {
    sendFailureResponse(res, 'IDs missing or invalid');
    return;
  }

  const ok = executeWriteStatement(DELETE_RECIPE_DATA, [recipeId], `${DEBUG}deleteRecipe`);
  if (!ok) {
    sendFailureResponse(res, 'remove failed');
    return;
  }

  sendCompletedResponse(res);
}
