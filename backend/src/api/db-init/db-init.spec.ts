import { createDatabase, populateDatabase } from './db-init';

describe('db-init', () => {
  test('createDatabase calls db.run for tables', async () => {
    const calls: string[] = [];
    const db: any = { run: (sql: string) => { calls.push(sql); return Promise.resolve(); } };
    await createDatabase(db);
    expect(calls.length).toBeGreaterThanOrEqual(3);
  });

  test('populateDatabase calls db.run for initial data', async () => {
    const calls: string[] = [];
    const db: any = { run: (sql: string) => { calls.push(sql); return Promise.resolve(); } };
    await populateDatabase(db);
    expect(calls.length).toBeGreaterThanOrEqual(3);
  });
});