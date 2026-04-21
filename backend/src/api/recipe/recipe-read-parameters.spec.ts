import { prepareReadParameters } from './recipe-read-parameters';

describe('prepareReadParameters', () => {
  test('parses query string into parameters', () => {
    const q: any = { t: 'created', d: 'desc', o: '12', q: '24', terms: 'apple' };
    const p = prepareReadParameters(q);
    expect(p.sort.target).toBe('date_created');
    expect(p.sort.direction).toBe('desc');
    expect(p.page.offset).toBe(12);
    expect(p.page.quantity).toBe(24);
    expect(p.terms).toBe('apple');
  });
});