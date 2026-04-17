import DBRead from './db-read';

describe('DBRead.prepParemeters', () => {
  test('parses query string into parameters', () => {
    const q: any = { t: 'created', d: 'desc', terms: 'apple' };
    const p = DBRead.prepParemeters(q);
    expect(p.sort.target).toBe('date_created');
    expect(p.sort.direction).toBe('desc');
    expect(p.terms).toBe('apple');
  });
});

describe('DBRead.findRecipeByID', () => {
  afterEach(() => jest.restoreAllMocks());

  test('returns 200 with recipe when found', async () => {
    const card = { card: JSON.stringify({ title: 'x' }) };
    const get = jest.fn().mockReturnValue(card);
    const prepare = jest.fn().mockReturnValue({ get });
    const db: any = { prepare };
    const dbService = require('../../services/db.service').default as any;
    const oldDb = dbService.db;
    dbService.db = db;

    const req: any = { params: { id: '1' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await DBRead.findRecipeByID(req, res);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ title: 'x' });

    dbService.db = oldDb;
  });

  test('returns 404 when not found', async () => {
    const get = jest.fn().mockReturnValue(undefined);
    const prepare = jest.fn().mockReturnValue({ get });
    const db: any = { prepare };
    (require('../../services/db.service').default as any).db = db;

    const req: any = { params: { id: '1' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await DBRead.findRecipeByID(req, res);
    expect(status).toHaveBeenCalledWith(404);
  });
});
