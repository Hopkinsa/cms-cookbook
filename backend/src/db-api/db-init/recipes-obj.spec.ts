import { data } from './recipes-obj';

describe('recipes-obj data', () => {
  test('exports data array', () => {
    expect(Array.isArray(data)).toBe(true);
  });
});