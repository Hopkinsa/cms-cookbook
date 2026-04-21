import { Request, Response } from 'express';

import { log } from '../../utility/helpers.ts';
import { IResponse } from '../../model/data-model.ts';
import { parseRestoreArchive } from './restore.archive.ts';
import { restoreArchiveData } from './restore.repository.ts';

const DEBUG = 'restore | ';

export async function processUpload(req: Request): Promise<boolean> {
  log.info_lv2(`${DEBUG}processUpload`);

  if (!req.file) {
    return false;
  }

  const archiveData = parseRestoreArchive(req.file.buffer);
  if (archiveData === null) {
    return false;
  }

  await restoreArchiveData(archiveData);
  return true;
}

export async function restore(req: Request, res: Response): Promise<void> {
  const file = !req.file ? 'No File' : req.file.originalname;
  log.info_lv2(`${DEBUG}restore: ${file}`);

  const ok = await processUpload(req);
  const response: IResponse = { completed: ok };

  res.status(ok ? 200 : 400).json(response);
}
