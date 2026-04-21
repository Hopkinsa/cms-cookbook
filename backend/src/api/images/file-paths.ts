import * as path from 'path';

import { IMAGE_PATH } from '../../utility/helpers.ts';

export const UPLOAD_PATH = path.resolve(`${IMAGE_PATH}`);

export function resolveUploadPath(filename: string): string {
  return `${UPLOAD_PATH}/${filename}`;
}
