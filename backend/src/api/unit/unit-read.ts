import { Request, Response } from 'express';

import { IResponse, IUnit } from '../../model/data-model.ts';
import { log, routeParamInt } from '../../utility/helpers.ts';
import { executeReadAll, executeReadGet } from '../shared/read-handler.ts';
import { FIND_UNIT_BY_ID, GET_UNITS } from './unit-sql.ts';

const DEBUG = 'unit-read | ';

export async function findUnitByID(req: Request, res: Response): Promise<void> {
  const unitId = routeParamInt(req.params['id']);
  log.info_lv2(`${DEBUG}findUnitByID: ${unitId}`);

  const unit = executeReadGet<IUnit>(FIND_UNIT_BY_ID, [unitId], `${DEBUG}findUnitByID`);
  if (unit !== undefined) {
    res.status(200).json(unit);
    return;
  }

  const response: IResponse = { message: 'No unit found' };
  res.status(404).json(response);
}

export async function getUnits(req: Request, res: Response): Promise<void> {
  log.info_lv2(`${DEBUG}getUnits`);

  const units = executeReadAll<IUnit>(GET_UNITS, [], `${DEBUG}getUnits`);
  if (units !== undefined) {
    res.status(200).json(units);
    return;
  }

  const response: IResponse = { message: 'No units found' };
  res.status(404).json(response);
}
