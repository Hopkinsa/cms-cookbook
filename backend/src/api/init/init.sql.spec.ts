import * as sql from './init.sql';

describe('init SQL', () => {
  test('exports CREATE TABLE statements', () => {
    expect(sql.TAG_TABLE).toContain('CREATE TABLE');
    expect(sql.UNIT_TABLE).toContain('CREATE TABLE');
    expect(sql.RECIPE_TABLE).toContain('CREATE TABLE');
    expect(sql.USERS_TABLE).toContain('CREATE TABLE');
    expect(sql.PERMISSIONS_TABLE).toContain('CREATE TABLE');
  });
});
