import {
  CREATE_RECIPE_DATA,
  DELETE_RECIPE_DATA,
  FIND_RECIPE_BY_ID,
  GET_RECIPES,
  UPDATE_RECIPE_DATA,
} from './recipe-sql';

describe('recipe SQL', () => {
  test('exports recipe SQL strings', () => {
    expect(CREATE_RECIPE_DATA).toContain('INSERT');
    expect(FIND_RECIPE_BY_ID).toContain('SELECT');
    expect(GET_RECIPES).toContain('SELECT');
    expect(UPDATE_RECIPE_DATA).toContain('UPDATE');
    expect(DELETE_RECIPE_DATA).toContain('DELETE');
  });
});