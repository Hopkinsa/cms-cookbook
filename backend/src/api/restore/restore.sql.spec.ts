import * as sql from './restore.sql';

describe('restore SQL', () => {
  test('exports CREATE TABLE statements', () => {
    expect(sql.TAG_TABLE).toContain('CREATE TABLE');
    expect(sql.UNIT_TABLE).toContain('CREATE TABLE');
    expect(sql.RECIPE_TABLE).toContain('CREATE TABLE');
    expect(sql.USERS_TABLE).toContain('CREATE TABLE');
    expect(sql.PERMISSIONS_TABLE).toContain('CREATE TABLE');
    expect(sql.USER_PERMISSIONS_TABLE).toContain('CREATE TABLE');
    expect(sql.PASSWORD_RESET_TOKENS_TABLE).toContain('CREATE TABLE');
  });
});
