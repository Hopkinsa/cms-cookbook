import { Request, Response } from 'express';

import { log } from '../../utility/helpers.ts';
import { IResponse } from '../../model/data-model.ts';
import { createBackupArchive } from './backup.archive.ts';
import {
  getBackupPasswordResetTokens,
  getBackupPermissions,
  getBackupRecipes,
  getBackupTags,
  getBackupUnits,
  getBackupUserPermissions,
  getBackupUsers,
} from './backup.repository.ts';

const DEBUG = 'backup | ';

export async function backup(req: Request, res: Response): Promise<void> {
  log.info_lv2(`${DEBUG}backup`);

  const tags = await getBackupTags();
  const units = await getBackupUnits();
  const recipes = await getBackupRecipes();
  const users = await getBackupUsers();
  const permissions = await getBackupPermissions();
  const userPermissions = await getBackupUserPermissions();
  const passwordResetTokens = await getBackupPasswordResetTokens();

  if (
    tags === null
    || units === null
    || recipes === null
    || users === null
    || permissions === null
    || userPermissions === null
    || passwordResetTokens === null
  ) {
    const response: IResponse = { completed: false };
    res.status(500).json(response);
    return;
  }

  const archive = createBackupArchive(tags, units, recipes, users, permissions, userPermissions, passwordResetTokens);
  res.set('Content-Type', 'application/octet-stream');
  res.set('Content-Disposition', `attachment; filename=${archive.downloadName}`);
  res.set('Content-Length', `${archive.data.length}`);
  res.status(200).send(archive.data);
}
