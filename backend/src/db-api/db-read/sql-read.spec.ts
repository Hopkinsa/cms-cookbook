import * as sql from './sql-read';

describe('sql-read constants', () => {
  test('exports SQL strings', () => {
    expect(typeof sql.FIND_RECIPE_BY_ID).toBe('string');
    expect(sql.FIND_RECIPE_BY_ID).toContain('SELECT');
    expect(sql.GET_UNITS).toContain('SELECT');
  });
});