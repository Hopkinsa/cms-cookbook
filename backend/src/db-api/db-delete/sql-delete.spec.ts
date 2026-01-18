import * as sql from './sql-delete';

describe('sql-delete', () => {
  test('exports SQL strings', () => {
    expect(sql.DELETE_RECIPE_DATA).toContain('DELETE');
    expect(sql.DELETE_TAG_DATA).toContain('DELETE');
  });
});