import Restore from './restore';
import DBService from '../../services/db.service';

// Mock AdmZip for deterministic behavior in test
jest.mock('adm-zip', () => {
  return jest.fn().mockImplementation((buf: Buffer) => ({
    getEntries: () => {
      // Return entries only for our test stub buffer to distinguish valid/invalid cases
      if (buf && buf.toString() === 'stub') {
        return [
          { name: 'tags.json', getData: () => Buffer.from('[{"id":1,"type":"c","tag":"t"}]') },
          { name: 'units.json', getData: () => Buffer.from('[{"id":1,"title":"a","unit":"u","abbreviation":"ab"}]') },
          { name: 'recipes.json', getData: () => Buffer.from('[{"id":1,"card":"{}"}]') },
          { name: 'users.json', getData: () => Buffer.from('[{"id":1,"first_name":"Admin","surname":"User","username":"admin","email":"admin@example.com","password_hash":"hash","is_active":1,"created_at":1,"updated_at":1}]') },
          { name: 'permissions.json', getData: () => Buffer.from('[{"id":1,"code":"user.read","description":"Read users"}]') },
          { name: 'user-permissions.json', getData: () => Buffer.from('[{"user_id":1,"permission_id":1}]') },
          { name: 'password-reset-tokens.json', getData: () => Buffer.from('[{"id":1,"user_id":1,"token_hash":"token","expires_at":2,"created_at":1,"used_at":null}]') },
        ];
      }
      return [];
    },
  }));
});

describe('Restore', () => {
  afterEach(() => jest.restoreAllMocks());

  test('processUpload returns false for wrong entries', async () => {
    const buf = Buffer.from('notazip');
    const req: any = { file: { buffer: buf } };
    const ok = await Restore.processUpload(req);
    expect(ok).toBe(false);
  });

  test('processUpload processes zip with three entries', async () => {
    const run = jest.fn();
    const prepare = jest.fn().mockReturnValue({ run });
    (DBService as any).db = { prepare };

    const req: any = { file: { buffer: Buffer.from('stub') } };
    const ok = await Restore.processUpload(req);
    expect(ok).toBe(true);
    expect(prepare).toHaveBeenCalled();
  });

  test('restore returns 400 when no file is provided', async () => {
    const req: any = {};
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await Restore.restore(req, res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ completed: false });
  });
});
