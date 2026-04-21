jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

import DBService from '../../services/db.service';
import { log } from '../../utility/helpers';
import { validationResult } from 'express-validator';

import { executeReadAllOrNull, executeReadGet, handleReadValidationFailure } from './read-handler';

describe('read-handler', () => {
  afterEach(() => jest.restoreAllMocks());

  test('returns false when validation passes', () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: () => true, array: () => [] });
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();

    const failed = handleReadValidationFailure({} as any, { status, json } as any);

    expect(failed).toBe(false);
    expect(status).not.toHaveBeenCalled();
    expect(json).not.toHaveBeenCalled();
  });

  test('returns 422 when validation fails', () => {
    const errors = [{ msg: 'bad id' }];
    (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: () => false, array: () => errors });
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();

    const failed = handleReadValidationFailure({} as any, { status, json } as any);

    expect(failed).toBe(true);
    expect(status).toHaveBeenCalledWith(422);
    expect(json).toHaveBeenCalledWith({ errors });
  });

  test('returns null and logs when executeReadAllOrNull fails', () => {
    const all = jest.fn().mockImplementation(() => {
      throw new Error('db failed');
    });
    const prepare = jest.fn().mockReturnValue({ all });
    (DBService as any).db = { prepare };
    const infoSpy = jest.spyOn(log, 'info_lv2').mockImplementation(() => {});
    const errorSpy = jest.spyOn(log, 'error').mockImplementation(() => {});

    const result = executeReadAllOrNull('SELECT * FROM test', [1], 'read-handler | getAll');

    expect(result).toBeNull();
    expect(prepare).toHaveBeenCalledWith('SELECT * FROM test');
    expect(all).toHaveBeenCalledWith(1);
    expect(infoSpy).toHaveBeenCalledWith('read-handler | getAll');
    expect(errorSpy).toHaveBeenCalledWith('read-handler | getAll - Error: ', 'db failed');
  });

  test('returns a record when executeReadGet succeeds', () => {
    const row = { id: 3, name: 'Metric' };
    const get = jest.fn().mockReturnValue(row);
    const prepare = jest.fn().mockReturnValue({ get });
    (DBService as any).db = { prepare };

    const result = executeReadGet<typeof row>('SELECT * FROM units WHERE id = ?', [3], 'read-handler | getOne');

    expect(result).toEqual(row);
    expect(prepare).toHaveBeenCalledWith('SELECT * FROM units WHERE id = ?');
    expect(get).toHaveBeenCalledWith(3);
  });
});
