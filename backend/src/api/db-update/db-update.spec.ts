import DBUpdate from './db-update';
import DBService from '../../services/db.service';
import { validationResult } from 'express-validator';

describe('DBUpdate', () => {
  afterEach(() => jest.restoreAllMocks());

  test('updateRecipe returns 500 on invalid id', async () => {
    jest.spyOn(validationResult as any, 'apply').mockReturnValue({ isEmpty: () => true, array: () => [] });
    const req: any = { params: { id: 'NaN' }, body: {} };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await DBUpdate.updateRecipe(req, res);
    expect(status).toHaveBeenCalledWith(500);
  });

  test('updateTag returns 500 when ids mismatch', async () => {
    jest.spyOn(validationResult as any, 'apply').mockReturnValue({ isEmpty: () => true, array: () => [] });
    const req: any = { params: { id: '1' }, body: { id: 2 } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await DBUpdate.updateTag(req, res);
    expect(status).toHaveBeenCalledWith(500);
  });
});