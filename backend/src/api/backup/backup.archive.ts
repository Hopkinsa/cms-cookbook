import AdmZip from 'adm-zip';

import { log } from '../../utility/helpers.ts';
import { ICard, ITags, IUnit } from '../../model/data-model.ts';
import {
  type PasswordResetTokenTableRecord,
  type PermissionTableRecord,
  type UserPermissionTableRecord,
  type UserTableRecord,
} from '../../auth/auth.types.ts';

const DEBUG = 'backup | ';

function stringifyRecords<T>(records: T[]): string {
  return JSON.stringify(records, null, 2) + '\n';
}

function buildDownloadName(now: Date): string {
  const ymdTime = `${now.getFullYear().toString().padStart(2, '0')}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
  const hmsTime = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
  return `backup-${ymdTime}${hmsTime}.zip`;
}

export function createBackupArchive(
  tags: ITags[],
  units: IUnit[],
  recipes: ICard[],
  users: UserTableRecord[],
  permissions: PermissionTableRecord[],
  userPermissions: UserPermissionTableRecord[],
  passwordResetTokens: PasswordResetTokenTableRecord[],
): { data: Buffer; downloadName: string } {
  log.info_lv2(`${DEBUG} Tags and Categories backed up`);
  log.info_lv2(`${DEBUG} Units backed up`);
  log.info_lv2(`${DEBUG} Recipes backed up`);
  log.info_lv2(`${DEBUG} Users backed up`);
  log.info_lv2(`${DEBUG} Permissions backed up`);
  log.info_lv2(`${DEBUG} User permissions backed up`);
  log.info_lv2(`${DEBUG} Password reset tokens backed up`);

  const zip = new AdmZip();
  zip.addFile('tags.json', Buffer.from(stringifyRecords(tags)));
  zip.addFile('units.json', Buffer.from(stringifyRecords(units)));
  zip.addFile('recipes.json', Buffer.from(stringifyRecords(recipes)));
  zip.addFile('users.json', Buffer.from(stringifyRecords(users)));
  zip.addFile('permissions.json', Buffer.from(stringifyRecords(permissions)));
  zip.addFile('user-permissions.json', Buffer.from(stringifyRecords(userPermissions)));
  zip.addFile('password-reset-tokens.json', Buffer.from(stringifyRecords(passwordResetTokens)));

  return {
    data: zip.toBuffer(),
    downloadName: buildDownloadName(new Date()),
  };
}
