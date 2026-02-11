import DBBackup from './db-backup';
import DBService from '../../services/db.service';

describe('DBBackup', () => {
  afterEach(() => jest.restoreAllMocks());

  test('dbBackup sends zip when data present', async () => {
    const tags = [{ id: 1, type: 'c', tag: 't' }];
    const units = [{ id: 1, title: 'a', unit: 'u', abbreviation: 'ab' }];
    const recipes = [{ title: 'r' }];
    const all = jest.fn().mockResolvedValueOnce(tags).mockResolvedValueOnce(units).mockResolvedValueOnce(recipes);
    (DBService as any).db = { all };

    const req: any = {};
    const status = jest.fn().mockReturnThis();
    const send = jest.fn();
    const set = jest.fn();
    const res: any = { status, send, set };

    await DBBackup.dbBackup(req, res);
    expect(set).toHaveBeenCalled();
    expect(send).toHaveBeenCalled();
  });

  test('dbBackup returns 500 when no data', async () => {
    const all = jest.fn().mockResolvedValue(undefined);
    (DBService as any).db = { all };

    const req: any = {};
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await DBBackup.dbBackup(req, res);
    expect(status).toHaveBeenCalledWith(500);
  });
});