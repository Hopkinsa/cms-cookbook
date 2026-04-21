import { FIND_TAG_BY_ID } from './tag-sql';
import { findTagByID } from './tag-read';

describe('findTagByID', () => {
  afterEach(() => jest.restoreAllMocks());

  test('queries tags by tag sql', async () => {
    const get = jest.fn().mockReturnValue(undefined);
    const prepare = jest.fn().mockReturnValue({ get });
    const db: any = { prepare };
    const dbService = require('../../services/db.service').default as any;
    const oldDb = dbService.db;
    dbService.db = db;

    const req: any = { params: { id: '3' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await findTagByID(req, res);
    expect(prepare).toHaveBeenCalledWith(FIND_TAG_BY_ID);

    dbService.db = oldDb;
  });
});