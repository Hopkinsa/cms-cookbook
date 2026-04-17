import { createDatabase, populateDatabase } from './db-init';

describe('db-init', () => {
  test('createDatabase calls prepared statements for tables', async () => {
    const calls: string[] = [];
    const db: any = {
      prepare: (sql: string) => ({
        run: () => {
          calls.push(sql);
        },
      }),
    };
    await createDatabase(db);
    expect(calls.length).toBeGreaterThanOrEqual(3);
  });

  test('populateDatabase calls prepared statements for initial data', async () => {
    const calls: string[] = [];
    const db: any = {
      prepare: (sql: string) => ({
        run: () => {
          calls.push(sql);
        },
      }),
    };
    await populateDatabase(db);
    expect(calls.length).toBeGreaterThanOrEqual(3);
  });
});
