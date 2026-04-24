const addFile = jest.fn();
const toBuffer = jest.fn(() => Buffer.from('zip'));

jest.mock('adm-zip', () => {
  return jest.fn().mockImplementation(() => ({
    addFile,
    toBuffer,
  }));
});

import { createBackupArchive } from './backup.archive.ts';

describe('backup archive', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('includes auth data files alongside cookbook data', () => {
    const archive = createBackupArchive(
      [{ id: 1, type: 'c', tag: 't' }],
      [{ id: 1, title: 'a', unit: 'u', abbreviation: 'ab' }],
      [{ id: 1, card: '{}' }],
      [{ id: 1, first_name: 'Admin', surname: 'User', username: 'admin', email: 'admin@example.com', password_hash: 'hash', is_active: 1, created_at: 1, updated_at: 1 }],
      [{ id: 1, code: 'user.read', description: 'Read users' }],
      [{ user_id: 1, permission_id: 1 }],
      [{ id: 1, user_id: 1, token_hash: 'token', expires_at: 2, created_at: 1, used_at: null }],
    );

    expect(addFile.mock.calls.map(([fileName]) => fileName)).toEqual([
      'tags.json',
      'units.json',
      'recipes.json',
      'users.json',
      'permissions.json',
      'user-permissions.json',
      'password-reset-tokens.json',
    ]);
    expect(archive.data).toEqual(Buffer.from('zip'));
    expect(archive.downloadName).toMatch(/^backup-\d{14}\.zip$/);
  });
});
