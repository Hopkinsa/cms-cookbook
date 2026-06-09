import { existsSync } from 'fs';
import path from 'path';

import { config } from 'dotenv';

const ENV_FILE_CANDIDATES = ['.env', '../.env', 'helper/dot.env', '../helper/dot.env'];

export function resolveEnvFilePath(cwd = process.cwd()): string | null {
  for (const candidate of ENV_FILE_CANDIDATES) {
    const resolvedPath = path.resolve(cwd, candidate);
    if (existsSync(resolvedPath)) {
      return resolvedPath;
    }
  }

  return null;
}

export function loadEnvironment(cwd = process.cwd()): string | null {
  const envFilePath = resolveEnvFilePath(cwd);
  if (!envFilePath) {
    return null;
  }

  config({ path: envFilePath });
  return envFilePath;
}
