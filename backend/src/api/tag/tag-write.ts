import { Request, Response } from 'express';

import { ITags } from '../../model/data-model.ts';
import { log } from '../../utility/helpers.ts';
import {
  executeWriteStatement,
  getRouteId,
  handleValidationFailure,
  hasInvalidId,
  sendCompletedResponse,
  sendFailureResponse,
} from '../shared/write-handler.ts';
import { CREATE_TAG_DATA, DELETE_TAG_DATA, UPDATE_TAG_DATA } from './tag-sql.ts';

const DEBUG = 'tag-write | ';

export async function createTag(req: Request, res: Response): Promise<void> {
  if (handleValidationFailure(req, res)) {
    return;
  }

  const tagData = req.body as ITags;
  log.info_lv2(`${DEBUG}createTag`);

  const ok = executeWriteStatement(CREATE_TAG_DATA, [tagData.type, tagData.tag], `${DEBUG}createTag`);
  if (!ok) {
    sendFailureResponse(res, 'create failed');
    return;
  }

  sendCompletedResponse(res);
}

export async function updateTag(req: Request, res: Response): Promise<void> {
  if (handleValidationFailure(req, res)) {
    return;
  }

  const tagId = getRouteId(req);
  const tagData = req.body as ITags;
  log.info_lv2(`${DEBUG}updateTag: ${tagId}`);

  if (hasInvalidId(tagId) || tagId !== tagData.id) {
    sendFailureResponse(res, 'IDs missing or invalid');
    return;
  }

  const ok = executeWriteStatement(UPDATE_TAG_DATA, [tagData.type, tagData.tag, tagId], `${DEBUG}updateTag`);
  if (!ok) {
    sendFailureResponse(res, 'update failed');
    return;
  }

  sendCompletedResponse(res);
}

export async function deleteTag(req: Request, res: Response): Promise<void> {
  const tagId = getRouteId(req);
  log.info_lv2(`${DEBUG}deleteTag: ${tagId}`);

  if (hasInvalidId(tagId)) {
    sendFailureResponse(res, 'IDs missing or invalid');
    return;
  }

  const ok = executeWriteStatement(DELETE_TAG_DATA, [tagId], `${DEBUG}deleteTag`);
  if (!ok) {
    sendFailureResponse(res, 'remove failed');
    return;
  }

  sendCompletedResponse(res);
}
