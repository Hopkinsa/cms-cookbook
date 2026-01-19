import * as sql from './sql-update';

describe('sql-update', () => {
  test('exports SQL strings', () => {
    expect(sql.UPDATE_RECIPE_DATA).toContain('UPDATE');
    expect(sql.UPDATE_TAG_DATA).toContain('UPDATE');
  });
});