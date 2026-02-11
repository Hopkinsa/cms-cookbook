import * as sql from './sql-backup';

describe('sql-backup', () => {
  test('exports SQL strings', () => {
    expect(sql.GET_RECIPES).toContain('SELECT');
    expect(sql.GET_UNITS).toContain('SELECT');
    expect(sql.GET_TAGS).toContain('SELECT');
  });
});