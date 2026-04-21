jest.mock('fs', () => {
  const actual = jest.requireActual('fs');
  return {
    ...actual,
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
  };
});

import * as fs from 'fs';
import * as path from 'path';

import * as initApi from '../api/init/init';
import { DATA_PATH, log } from '../utility/helpers';
import DBService from './db.service';

describe('DBService', () => {
  const pathToDB = path.join(DATA_PATH, 'cookbook.db');

  beforeEach(() => {
    DBService.newDB = false;
    jest.clearAllMocks();
  });

  afterEach(() => {
    DBService.newDB = false;
    jest.restoreAllMocks();
  });

  test('creates and seeds the database when the file is missing', async () => {
    const fakeDb = { name: 'db' } as any;
    (fs.existsSync as jest.Mock).mockImplementation((target: fs.PathLike) => {
      if (target === pathToDB) {
        return false;
      }

      if (target === DATA_PATH) {
        return false;
      }

      return true;
    });
    (fs.mkdirSync as jest.Mock).mockImplementation(() => undefined as any);
    const openDatabaseSpy = jest.spyOn(DBService, 'openDatabase').mockResolvedValue(fakeDb);
    const createDatabaseSpy = jest.spyOn(initApi, 'createDatabase').mockResolvedValue();
    const populateDatabaseSpy = jest.spyOn(initApi, 'populateDatabase').mockResolvedValue();
    const infoSpy = jest.spyOn(log, 'info_lv2').mockImplementation(() => {});

    await DBService.connectToDatabase();

  expect(fs.mkdirSync).toHaveBeenCalledWith(DATA_PATH);
    expect(openDatabaseSpy).toHaveBeenCalled();
    expect(DBService.db).toBe(fakeDb);
    expect(createDatabaseSpy).toHaveBeenCalledWith(fakeDb);
    expect(populateDatabaseSpy).toHaveBeenCalledWith(fakeDb);
    expect(infoSpy).toHaveBeenCalledWith('db.service | Database folder does not exist.');
    expect(infoSpy).toHaveBeenCalledWith(`db.service | The database at '${pathToDB}' was created.`);
  });

  test('opens an existing database without creating schema', async () => {
    const fakeDb = { name: 'existing-db' } as any;
    (fs.existsSync as jest.Mock).mockImplementation((target: fs.PathLike) => target === pathToDB);
    const openDatabaseSpy = jest.spyOn(DBService, 'openDatabase').mockResolvedValue(fakeDb);
    const createDatabaseSpy = jest.spyOn(initApi, 'createDatabase').mockResolvedValue();
    const populateDatabaseSpy = jest.spyOn(initApi, 'populateDatabase').mockResolvedValue();
    const infoSpy = jest.spyOn(log, 'info_lv2').mockImplementation(() => {});

    await DBService.connectToDatabase();

    expect(openDatabaseSpy).toHaveBeenCalled();
    expect(DBService.db).toBe(fakeDb);
    expect(createDatabaseSpy).not.toHaveBeenCalled();
    expect(populateDatabaseSpy).not.toHaveBeenCalled();
    expect(infoSpy).toHaveBeenCalledWith(`db.service | The database at '${pathToDB}' was opened.`);
  });
});
