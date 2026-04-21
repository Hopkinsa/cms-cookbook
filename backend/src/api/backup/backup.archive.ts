import AdmZip from 'adm-zip';

import { log } from '../../utility/helpers.ts';
import { ICard, ITags, IUnit } from '../../model/data-model.ts';

const DEBUG = 'backup | ';

function stringifyRecords<T>(records: T[]): string {
  return JSON.stringify(records, null, 2) + '\n';
}

function buildDownloadName(now: Date): string {
  const ymdTime = `${now.getFullYear().toString().padStart(2, '0')}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
  const hmsTime = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
  return `backup-${ymdTime}${hmsTime}.zip`;
}

export function createBackupArchive(tags: ITags[], units: IUnit[], recipes: ICard[]): { data: Buffer; downloadName: string } {
  log.info_lv2(`${DEBUG} Tags and Categories backed up`);
  log.info_lv2(`${DEBUG} Units backed up`);
  log.info_lv2(`${DEBUG} Recipes backed up`);

  const zip = new AdmZip();
  zip.addFile('tags.json', Buffer.from(stringifyRecords(tags)));
  zip.addFile('units.json', Buffer.from(stringifyRecords(units)));
  zip.addFile('recipes.json', Buffer.from(stringifyRecords(recipes)));

  return {
    data: zip.toBuffer(),
    downloadName: buildDownloadName(new Date()),
  };
}
