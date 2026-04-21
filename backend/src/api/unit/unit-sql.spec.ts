import { FIND_UNIT_BY_ID, GET_UNITS } from './unit-sql';

describe('unit SQL', () => {
  test('exports unit SQL strings', () => {
    expect(FIND_UNIT_BY_ID).toContain('SELECT');
    expect(GET_UNITS).toContain('SELECT');
  });
});