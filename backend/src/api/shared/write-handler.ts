import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { IResponse } from '../../model/data-model.ts';
import DBService from '../../services/db.service.ts';
import { log, routeParamInt } from '../../utility/helpers.ts';

export function handleValidationFailure(req: Request, res: Response): boolean {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return false;
  }

  res.status(422).json({ errors: errors.array() });
  return true;
}

export function getRouteId(req: Request): number {
  return routeParamInt(req.params['id']);
}

export function hasInvalidId(id: number): boolean {
  return Number.isNaN(id);
}

export function sendCompletedResponse(res: Response): void {
  const response: IResponse = { completed: true };
  res.status(200).json(response);
}

export function sendFailureResponse(res: Response, message: string, statusCode = 500): void {
  const response: IResponse = { message };
  res.status(statusCode).json(response);
}

export function executeWriteStatement(statement: string, params: unknown[], errorContext: string): boolean {
  try {
    DBService.db.prepare(statement).run(...params);
    return true;
  } catch (err) {
    log.error(`${errorContext} - Error: `, (err as Error).message);
  }

  return false;
}

export function executeLoggedWriteStatement(
  statement: string,
  params: unknown[],
  successMessage: string,
  errorContext: string,
): boolean {
  const ok = executeWriteStatement(statement, params, errorContext);
  if (ok) {
    log.info_lv3(successMessage);
  }

  return ok;
}
