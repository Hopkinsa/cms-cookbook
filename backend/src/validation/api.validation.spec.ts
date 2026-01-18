import { recipeBody, tagBody, searchQuery, sortQuery } from './api.validation';

describe('api.validation', () => {
  test('exports expected validator arrays', () => {
    expect(Array.isArray(recipeBody)).toBe(true);
    expect(Array.isArray(tagBody)).toBe(true);
    expect(Array.isArray(searchQuery)).toBe(true);
    expect(Array.isArray(sortQuery)).toBe(true);

    // Basic sanity checks on lengths
    expect(recipeBody.length).toBeGreaterThanOrEqual(1);
    expect(tagBody.length).toBeGreaterThanOrEqual(1);
    expect(searchQuery.length).toBeGreaterThanOrEqual(1);
    expect(sortQuery.length).toBeGreaterThanOrEqual(1);
  });
});