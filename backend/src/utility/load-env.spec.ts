import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import os from 'os';
import path from 'path';

import { loadEnvironment, resolveEnvFilePath } from './load-env.ts';

describe('loadEnvironment', () => {
  let tempRoot = '';

  beforeEach(() => {
    tempRoot = mkdtempSync(path.join(os.tmpdir(), 'cms-cookbook-env-'));
    delete process.env['CMS_COOKBOOK_TEST_ENV'];
  });

  afterEach(() => {
    rmSync(tempRoot, { recursive: true, force: true });
    delete process.env['CMS_COOKBOOK_TEST_ENV'];
  });

  it('prefers a local .env file when present', () => {
    const backendDir = path.join(tempRoot, 'backend');
    mkdirSync(backendDir, { recursive: true });
    writeFileSync(path.join(backendDir, '.env'), 'CMS_COOKBOOK_TEST_ENV=backend\n');
    mkdirSync(path.join(tempRoot, 'helper'), { recursive: true });
    writeFileSync(path.join(tempRoot, 'helper', 'dot.env'), 'CMS_COOKBOOK_TEST_ENV=helper\n');

    expect(resolveEnvFilePath(backendDir)).toBe(path.join(backendDir, '.env'));
    expect(loadEnvironment(backendDir)).toBe(path.join(backendDir, '.env'));
    expect(process.env['CMS_COOKBOOK_TEST_ENV']).toBe('backend');
  });

  it('falls back to helper/dot.env when backend/.env is missing', () => {
    const backendDir = path.join(tempRoot, 'backend');
    const helperDir = path.join(tempRoot, 'helper');
    mkdirSync(backendDir, { recursive: true });
    mkdirSync(helperDir, { recursive: true });
    writeFileSync(path.join(helperDir, 'dot.env'), 'CMS_COOKBOOK_TEST_ENV=helper\n');

    expect(resolveEnvFilePath(backendDir)).toBe(path.join(helperDir, 'dot.env'));
    expect(loadEnvironment(backendDir)).toBe(path.join(helperDir, 'dot.env'));
    expect(process.env['CMS_COOKBOOK_TEST_ENV']).toBe('helper');
  });
});
