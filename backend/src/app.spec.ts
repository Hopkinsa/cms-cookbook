import request from 'supertest';
import { app } from './app';

describe('app middleware', () => {
  test('sets CORS headers', async () => {
    const res = await request(app).get('/');
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });
});