import { Request, Response } from 'express';

import { log } from '../../utility/helpers.ts';
import { IResponse } from '../../model/data-model.ts';
import { createBackupArchive } from './backup.archive.ts';
import { getBackupRecipes, getBackupTags, getBackupUnits } from './backup.repository.ts';

const DEBUG = 'backup | ';

export async function backup(req: Request, res: Response): Promise<void> {
  log.info_lv2(`${DEBUG}backup`);

  const tags = await getBackupTags();
  const units = await getBackupUnits();
  const recipes = await getBackupRecipes();

  if (tags === null || units === null || recipes === null) {
    const response: IResponse = { completed: false };
    res.status(500).json(response);
    return;
  }

  const archive = createBackupArchive(tags, units, recipes);
  res.set('Content-Type', 'application/octet-stream');
  res.set('Content-Disposition', `attachment; filename=${archive.downloadName}`);
  res.set('Content-Length', `${archive.data.length}`);
  res.status(200).send(archive.data);
}
