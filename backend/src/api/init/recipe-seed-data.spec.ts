import { recipeSeedData } from './recipe-seed-data';

describe('recipe seed data', () => {
  test('exports recipe seed array', () => {
    expect(Array.isArray(recipeSeedData)).toBe(true);
  });
});
