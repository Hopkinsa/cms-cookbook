import AdmZip from 'adm-zip';

import { type RestoreArchiveData } from './restore.types.ts';

const REQUIRED_ARCHIVE_FILES = [
  'password-reset-tokens.json',
  'permissions.json',
  'recipes.json',
  'tags.json',
  'units.json',
  'user-permissions.json',
  'users.json',
] as const;

function getEntryName(entry: { entryName?: string; name?: string }): string {
  return entry.entryName ?? entry.name ?? '';
}

export function parseRestoreArchive(buffer: Buffer): RestoreArchiveData | null {
  const zip = new AdmZip(buffer);
  const zipEntries = zip.getEntries();
  const entryNames = zipEntries.map((zipEntry) => getEntryName(zipEntry)).sort();
  const expectedNames = [...REQUIRED_ARCHIVE_FILES].sort();

  if (zipEntries.length !== REQUIRED_ARCHIVE_FILES.length) {
    return null;
  }

  if (entryNames.some((entryName, index) => entryName !== expectedNames[index])) {
    return null;
  }

  return {
    tags: JSON.parse(zipEntries.find((entry) => getEntryName(entry) === 'tags.json')?.getData().toString('utf8') ?? '[]'),
    units: JSON.parse(zipEntries.find((entry) => getEntryName(entry) === 'units.json')?.getData().toString('utf8') ?? '[]'),
    recipes: JSON.parse(zipEntries.find((entry) => getEntryName(entry) === 'recipes.json')?.getData().toString('utf8') ?? '[]'),
    users: JSON.parse(zipEntries.find((entry) => getEntryName(entry) === 'users.json')?.getData().toString('utf8') ?? '[]'),
    permissions: JSON.parse(zipEntries.find((entry) => getEntryName(entry) === 'permissions.json')?.getData().toString('utf8') ?? '[]'),
    userPermissions: JSON.parse(zipEntries.find((entry) => getEntryName(entry) === 'user-permissions.json')?.getData().toString('utf8') ?? '[]'),
    passwordResetTokens: JSON.parse(zipEntries.find((entry) => getEntryName(entry) === 'password-reset-tokens.json')?.getData().toString('utf8') ?? '[]'),
  };
}
