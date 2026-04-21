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
