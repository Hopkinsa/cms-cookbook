import * as fs from 'fs';

import { generateNames, isVisibleImageFile } from './file-names.ts';
import { resolveUploadPath, UPLOAD_PATH } from './file-paths.ts';

export function imageExists(filename: string): boolean {
  return fs.existsSync(resolveUploadPath(filename));
}

export function deleteImageSet(filename: string): boolean {
  const fileNames = generateNames(filename);
  const paths = [
    resolveUploadPath(filename),
    resolveUploadPath(fileNames.icon),
    resolveUploadPath(fileNames.banner),
  ];

  if (!fs.existsSync(paths[0])) {
    return false;
  }

  for (const filePath of paths) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  return true;
}

export function listImageFiles(): string[] {
  return fs.readdirSync(UPLOAD_PATH).filter(isVisibleImageFile);
}
