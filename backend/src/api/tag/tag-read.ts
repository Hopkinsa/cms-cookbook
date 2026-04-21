import { Request, Response } from 'express';

import { IResponse, ITags } from '../../model/data-model.ts';
import { log, routeParamInt } from '../../utility/helpers.ts';
import { executeReadAll, executeReadGet } from '../shared/read-handler.ts';
import { FIND_TAG_BY_ID, GET_TAGS } from './tag-sql.ts';

const DEBUG = 'tag-read | ';

export async function findTagByID(req: Request, res: Response): Promise<void> {
  const tagId = routeParamInt(req.params['id']);
  log.info_lv2(`${DEBUG}findTagByID: ${tagId}`);

  const tag = executeReadGet<ITags>(FIND_TAG_BY_ID, [tagId], `${DEBUG}findTagByID`);
  if (tag !== undefined) {
    res.status(200).json(tag);
    return;
  }

  const response: IResponse = { message: 'No tag found' };
  res.status(404).json(response);
}

export async function getTags(req: Request, res: Response): Promise<void> {
  log.info_lv2(`${DEBUG}getTags`);

  const tags = executeReadAll<ITags>(GET_TAGS, [], `${DEBUG}getTags`);
  if (tags !== undefined) {
    res.status(200).json(tags);
    return;
  }

  const response: IResponse = { message: 'No tags found' };
  res.status(404).json(response);
}
