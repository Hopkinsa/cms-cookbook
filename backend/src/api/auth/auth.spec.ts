import Database from 'better-sqlite3';
import type { Express } from 'express';
import request from 'supertest';
import { setImmediate as nodeSetImmediate } from 'timers';

import DBService from '../../services/db.service.ts';
import { createDatabase, seedAuthDatabase } from '../init/init.ts';
import { createUser } from '../../auth/auth.repository.ts';

let app: Express;

describe('auth and protected routes', () => {
  beforeAll(async () => {
    globalThis.setImmediate = nodeSetImmediate;
    ({ app } = await import('../../app.ts'));
  });

  beforeEach(async () => {
    DBService.db = new Database(':memory:');
    await createDatabase(DBService.db);
    await seedAuthDatabase(DBService.db);
    await createUser({
      firstName: 'Admin',
      surname: 'User',
      username: 'admin',
      email: 'admin@example.com',
      password: 'Password123!',
      isActive: true,
      permissions: [
        'recipe.create',
        'recipe.update',
        'recipe.delete',
        'tag.create',
        'tag.update',
        'tag.delete',
        'image.upload',
        'image.update',
        'image.delete',
        'backup.export',
        'backup.restore',
        'user.read',
        'user.create',
        'user.update',
        'user.delete',
        'user.permissions.manage',
      ],
    });
  });

  afterEach(() => {
    DBService.db.close();
    jest.restoreAllMocks();
  });

  test('rejects protected recipe creation when unauthenticated', async () => {
    const response = await request(app).post('/api/recipe').send({
      title: 'Recipe title',
      description: 'desc',
      img_url: '',
      prep_time: '10',
      cook_time: '20',
      serves: '2',
      notes: 'note',
    });

    expect(response.status).toBe(401);
  });

  test('login creates a session and exposes it through the session endpoint', async () => {
    const agent = request.agent(app);

    const loginResponse = await agent.post('/api/auth/login').send({
      login: 'admin',
      password: 'Password123!',
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.authenticated).toBe(true);
    expect(loginResponse.body.user.username).toBe('admin');

    const sessionResponse = await agent.get('/api/auth/session');
    expect(sessionResponse.status).toBe(200);
    expect(sessionResponse.body.authenticated).toBe(true);
    expect(sessionResponse.body.user.permissions).toContain('recipe.create');
  });

  test('authenticated session can list users when permission is present', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({
      login: 'admin@example.com',
      password: 'Password123!',
    });

    const response = await agent.get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].username).toBe('admin');
  });
});
