import DBDelete from './db-delete';

describe('DBDelete', () => {
  test('deleteRecipe returns 500 on NaN id', async () => {
    const req: any = { params: { id: 'NaN' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await DBDelete.deleteRecipe(req, res);
    expect(status).toHaveBeenCalledWith(500);
  });
});