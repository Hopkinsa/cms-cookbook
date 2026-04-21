import Backup from './backup';
import DBService from '../../services/db.service';

describe('Backup', () => {
  afterEach(() => jest.restoreAllMocks());

  test('backup sends zip when data present', async () => {
    const tags = [{ id: 1, type: 'c', tag: 't' }];
    const units = [{ id: 1, title: 'a', unit: 'u', abbreviation: 'ab' }];
    const recipes = [{ title: 'r' }];
    const prepare = jest
      .fn()
      .mockReturnValueOnce({ all: jest.fn().mockReturnValue(tags) })
      .mockReturnValueOnce({ all: jest.fn().mockReturnValue(units) })
      .mockReturnValueOnce({ all: jest.fn().mockReturnValue(recipes) });
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
