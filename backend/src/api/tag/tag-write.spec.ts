import DBService from '../../services/db.service';
import { validationResult } from 'express-validator';

import { createTag, updateTag } from './tag-write';

describe('tag write handlers', () => {
  afterEach(() => jest.restoreAllMocks());

  test('createTag returns 500 on database error', async () => {
    jest.spyOn(validationResult as any, 'apply').mockReturnValue({ isEmpty: () => true, array: () => [] });
    const run = jest.fn().mockImplementation(() => {
      throw new Error('db failed');
    });
    const prepare = jest.fn().mockReturnValue({ run });
    (DBService as any).db = { prepare };

    const req: any = { body: { id: 1, type: 'category', tag: 'Dinner' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await createTag(req, res);
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ message: 'create failed' });
  });

  test('updateTag returns 500 when ids mismatch', async () => {
    jest.spyOn(validationResult as any, 'apply').mockReturnValue({ isEmpty: () => true, array: () => [] });
    const req: any = { params: { id: '1' }, body: { id: 2 } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await updateTag(req, res);
    expect(status).toHaveBeenCalledWith(500);
  });
});