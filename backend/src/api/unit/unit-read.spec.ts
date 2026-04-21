import DBService from '../../services/db.service';

import { findUnitByID, getUnits } from './unit-read';

describe('unit read handlers', () => {
  afterEach(() => jest.restoreAllMocks());

  test('findUnitByID returns 200 with the requested unit', async () => {
    const unit = { id: 7, type: 'volume', unit: 'cup', unit_abbr: 'c' };
    const get = jest.fn().mockReturnValue(unit);
    const prepare = jest.fn().mockReturnValue({ get });
    (DBService as any).db = { prepare };

    const status = jest.fn().mockReturnThis();
    const json = jest.fn();

    await findUnitByID({ params: { id: '7' } } as any, { status, json } as any);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(unit);
  });

  test('findUnitByID returns 404 when the unit is missing', async () => {
    const get = jest.fn().mockReturnValue(undefined);
    const prepare = jest.fn().mockReturnValue({ get });
    (DBService as any).db = { prepare };

    const status = jest.fn().mockReturnThis();
    const json = jest.fn();

    await findUnitByID({ params: { id: '9' } } as any, { status, json } as any);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ message: 'No unit found' });
  });

  test('getUnits returns 200 with unit rows', async () => {
    const units = [{ id: 1, type: 'weight', unit: 'gram', unit_abbr: 'g' }];
    const all = jest.fn().mockReturnValue(units);
    const prepare = jest.fn().mockReturnValue({ all });
    (DBService as any).db = { prepare };

    const status = jest.fn().mockReturnThis();
    const json = jest.fn();

    await getUnits({} as any, { status, json } as any);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(units);
  });

  test('getUnits returns 404 when no units are found', async () => {
    const all = jest.fn().mockReturnValue(undefined);
    const prepare = jest.fn().mockReturnValue({ all });
    (DBService as any).db = { prepare };

    const status = jest.fn().mockReturnThis();
    const json = jest.fn();

    await getUnits({} as any, { status, json } as any);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ message: 'No units found' });
  });
});
