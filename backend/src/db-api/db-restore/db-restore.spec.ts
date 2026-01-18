import DBRestore from './db-restore';
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

describe('DBRestore', () => {
  afterEach(() => jest.restoreAllMocks());

  test('dbProcessUpload returns false for wrong entries', async () => {
    const buf = Buffer.from('notazip');
    const req: any = { file: { buffer: buf } };
    const ok = await DBRestore.dbProcessUpload(req);
    expect(ok).toBe(false);
  });

  test('dbProcessUpload processes zip with three entries', async () => {
    const run = jest.fn().mockResolvedValue(undefined);
    (DBService as any).db = { run };

    const req: any = { file: { buffer: Buffer.from('stub') } };
    const ok = await DBRestore.dbProcessUpload(req);
    expect(ok).toBe(true);
  });
});