import Backup from './backup';
import DBService from '../../services/db.service';

describe('Backup', () => {
  afterEach(() => jest.restoreAllMocks());

  test('backup sends zip when data present', async () => {
    const tags = [{ id: 1, type: 'c', tag: 't' }];
    const units = [{ id: 1, title: 'a', unit: 'u', abbreviation: 'ab' }];
    const recipes = [{ title: 'r' }];
    const users = [{ id: 1, first_name: 'Admin', surname: 'User', username: 'admin', email: 'admin@example.com', password_hash: 'hash', is_active: 1, created_at: 1, updated_at: 1 }];
    const permissions = [{ id: 1, code: 'user.read', description: 'Read users' }];
    const userPermissions = [{ user_id: 1, permission_id: 1 }];
    const passwordResetTokens = [{ id: 1, user_id: 1, token_hash: 'token', expires_at: 2, created_at: 1, used_at: null }];
    const prepare = jest
      .fn()
      .mockReturnValueOnce({ all: jest.fn().mockReturnValue(tags) })
      .mockReturnValueOnce({ all: jest.fn().mockReturnValue(units) })
      .mockReturnValueOnce({ all: jest.fn().mockReturnValue(recipes) })
      .mockReturnValueOnce({ all: jest.fn().mockReturnValue(users) })
      .mockReturnValueOnce({ all: jest.fn().mockReturnValue(permissions) })
      .mockReturnValueOnce({ all: jest.fn().mockReturnValue(userPermissions) })
      .mockReturnValueOnce({ all: jest.fn().mockReturnValue(passwordResetTokens) });
    (DBService as any).db = { prepare };

    const req: any = {};
    const status = jest.fn().mockReturnThis();
    const send = jest.fn();
    const set = jest.fn();
    const res: any = { status, send, set };

    await Backup.backup(req, res);
    expect(set).toHaveBeenCalled();
    expect(send).toHaveBeenCalled();
  });

  test('backup returns 500 when no data', async () => {
    const prepare = jest.fn().mockReturnValue({ all: jest.fn().mockReturnValue(undefined) });
    (DBService as any).db = { prepare };

    const req: any = {};
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await Backup.backup(req, res);
    expect(status).toHaveBeenCalledWith(500);
  });
});
