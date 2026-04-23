const getEntries = jest.fn();

jest.mock('adm-zip', () => {
  return jest.fn().mockImplementation(() => ({
    getEntries,
  }));
});

import { parseRestoreArchive } from './restore.archive.ts';

describe('restore archive', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('parses restore archives that include auth data', () => {
    getEntries.mockReturnValue([
      { name: 'tags.json', getData: () => Buffer.from('[{"id":1,"type":"c","tag":"t"}]') },
      { name: 'units.json', getData: () => Buffer.from('[{"id":1,"title":"a","unit":"u","abbreviation":"ab"}]') },
      { name: 'recipes.json', getData: () => Buffer.from('[{"id":1,"card":"{}"}]') },
      { name: 'users.json', getData: () => Buffer.from('[{"id":1,"first_name":"Admin","surname":"User","username":"admin","email":"admin@example.com","password_hash":"hash","is_active":1,"created_at":1,"updated_at":1}]') },
      { name: 'permissions.json', getData: () => Buffer.from('[{"id":1,"code":"user.read","description":"Read users"}]') },
      { name: 'user-permissions.json', getData: () => Buffer.from('[{"user_id":1,"permission_id":1}]') },
      { name: 'password-reset-tokens.json', getData: () => Buffer.from('[{"id":1,"user_id":1,"token_hash":"token","expires_at":2,"created_at":1,"used_at":null}]') },
    ]);

    expect(parseRestoreArchive(Buffer.from('stub'))).toEqual({
      tags: [{ id: 1, type: 'c', tag: 't' }],
      units: [{ id: 1, title: 'a', unit: 'u', abbreviation: 'ab' }],
      recipes: [{ id: 1, card: '{}' }],
      users: [{ id: 1, first_name: 'Admin', surname: 'User', username: 'admin', email: 'admin@example.com', password_hash: 'hash', is_active: 1, created_at: 1, updated_at: 1 }],
      permissions: [{ id: 1, code: 'user.read', description: 'Read users' }],
      userPermissions: [{ user_id: 1, permission_id: 1 }],
      passwordResetTokens: [{ id: 1, user_id: 1, token_hash: 'token', expires_at: 2, created_at: 1, used_at: null }],
    });
  });

  test('rejects archives with missing auth files', () => {
    getEntries.mockReturnValue([{ name: 'tags.json', getData: () => Buffer.from('[]') }]);

    expect(parseRestoreArchive(Buffer.from('stub'))).toBeNull();
  });
});
