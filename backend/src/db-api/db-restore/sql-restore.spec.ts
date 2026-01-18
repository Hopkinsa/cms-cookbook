import * as sql from './sql-restore';

describe('sql-restore', () => {
  test('exports CREATE TABLE statements', () => {
    expect(sql.TAG_TABLE).toContain('CREATE TABLE');
    expect(sql.UNIT_TABLE).toContain('CREATE TABLE');
    expect(sql.RECIPE_TABLE).toContain('CREATE TABLE');
  });
});