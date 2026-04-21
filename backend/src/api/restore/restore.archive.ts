import AdmZip from 'adm-zip';

import { type RestoreArchiveData } from './restore.types.ts';

const REQUIRED_ARCHIVE_FILES = ['recipes.json', 'tags.json', 'units.json'] as const;

export function parseRestoreArchive(buffer: Buffer): RestoreArchiveData | null {
  const zip = new AdmZip(buffer);
  const zipEntries = zip.getEntries();
  const entryNames = zipEntries.map((zipEntry) => zipEntry.name).sort();
  const expectedNames = [...REQUIRED_ARCHIVE_FILES].sort();

  if (zipEntries.length !== REQUIRED_ARCHIVE_FILES.length) {
    return null;
  }

  if (entryNames.some((entryName, index) => entryName !== expectedNames[index])) {
    return null;
  }

  return {
    tags: JSON.parse(zipEntries.find((entry) => entry.name === 'tags.json')?.getData().toString('utf8') ?? '[]'),
    units: JSON.parse(zipEntries.find((entry) => entry.name === 'units.json')?.getData().toString('utf8') ?? '[]'),
    recipes: JSON.parse(zipEntries.find((entry) => entry.name === 'recipes.json')?.getData().toString('utf8') ?? '[]'),
  };
}
