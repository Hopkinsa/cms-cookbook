import * as sql from './backup.sql';

describe('backup SQL', () => {
  test('exports SQL strings', () => {
    expect(sql.GET_RECIPES).toContain('SELECT');
    expect(sql.GET_UNITS).toContain('SELECT');
    expect(sql.GET_TAGS).toContain('SELECT');
  });
});
