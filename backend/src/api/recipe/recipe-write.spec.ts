import DBService from '../../services/db.service';
import { validationResult } from 'express-validator';

import { createRecipe, deleteRecipe, updateRecipe } from './recipe-write';

describe('recipe write handlers', () => {
  afterEach(() => jest.restoreAllMocks());

  test('createRecipe returns 200 on success', async () => {
    jest.spyOn(validationResult as any, 'apply').mockReturnValue({ isEmpty: () => true, array: () => [] });
    const run = jest.fn();
    const prepare = jest.fn().mockReturnValue({ run });
    (DBService as any).db = { prepare };

    const req: any = {
      body: {
        title: 'Recipe',
        description: 'desc',
        tags: [],
        img_url: '',
        prep_time: 1,
        cook_time: 2,
        serves: 3,
        notes: '',
      },
    };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await createRecipe(req, res);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ completed: true });
    expect(run).toHaveBeenCalledTimes(1);
  });

  test('updateRecipe returns 500 on invalid id', async () => {
    jest.spyOn(validationResult as any, 'apply').mockReturnValue({ isEmpty: () => true, array: () => [] });
    const req: any = { params: { id: 'NaN' }, body: {} };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await updateRecipe(req, res);
    expect(status).toHaveBeenCalledWith(500);
  });

  test('deleteRecipe returns 500 on NaN id', async () => {
    const req: any = { params: { id: 'NaN' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await deleteRecipe(req, res);
    expect(status).toHaveBeenCalledWith(500);
  });
});