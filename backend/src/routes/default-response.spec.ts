import DefaultResponse from './default-response';

describe('DefaultResponse', () => {
  test('site_root responds with 200 and Incorrect route', () => {
    const req: any = {};
    const status = jest.fn().mockReturnThis();
    const send = jest.fn();
    const res: any = { status, send };

    DefaultResponse.site_root(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(send).toHaveBeenCalledWith('Incorrect route');
  });
});