import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import DBService from '../../services/db.service.ts';
import { log } from '../../utility/helpers.ts';

export function handleReadValidationFailure(req: Request, res: Response): boolean {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return false;
  }

  res.status(422).json({ errors: errors.array() });
  return true;
}

export function executeReadGet<T>(statement: string, params: unknown[], errorContext: string): T | undefined {
  try {
    return DBService.db.prepare(statement).get(...params) as T | undefined;
  } catch (err) {
    log.error(`${errorContext} - Error: `, (err as Error).message);
  }

  return undefined;
}

export function executeReadAll<T>(statement: string, params: unknown[], errorContext: string): T[] | undefined {
  try {
    return DBService.db.prepare(statement).all(...params) as T[] | undefined;
  } catch (err) {
    log.error(`${errorContext} - Error: `, (err as Error).message);
  }

  return undefined;
}

export function executeReadAllOrNull<T>(
  statement: string,
  params: unknown[],
  infoContext: string,
  errorContext = infoContext,
): T[] | null {
  log.info_lv2(infoContext);
  return executeReadAll<T>(statement, params, errorContext) ?? null;
}
