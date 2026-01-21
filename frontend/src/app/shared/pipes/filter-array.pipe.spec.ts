import { FilterArrayPipe } from './filter-array.pipe';

describe('FilterArrayPipe', () => {
  const pipe = new FilterArrayPipe();

  it('should return null when collection is null', () => {
    expect(pipe.transform(null, 'field', 'search')).toBeNull();
  });

  it('should return original collection when field or searchString missing', () => {
    const arr = [{ name: 'one' }];
    expect(pipe.transform(arr, '', 'one')).toBe(arr);
    expect(pipe.transform(arr, 'name', '')).toBe(arr);
  });

  it('should filter using a JSON-array string field', () => {
    const arr = [
      { id: 1, tags: '["a","b"]' },
      { id: 2, tags: '["c"]' },
    ];
    const res = pipe.transform(arr, 'tags', 'a');
    expect(res.length).toBe(1);
    expect(res[0].id).toBe(1);
  });

  it('should filter using a plain string field (case-insensitive)', () => {
    const arr = [
      { id: 1, title: 'Chocolate Cake' },
      { id: 2, title: 'Vanilla' },
    ];
    const res = pipe.transform(arr, 'title', 'cake');
    expect(res.length).toBe(1);
    expect(res[0].id).toBe(1);

    const res2 = pipe.transform(arr, 'title', 'CHOCOLATE');
    expect(res2.length).toBe(1);
    expect(res2[0].id).toBe(1);
  });

  it('should handle fields that are actual arrays by stringifying and matching', () => {
    const arr = [
      { id: 1, tags: ['a', 'b'] },
      { id: 2, tags: ['c'] },
    ];
    const res = pipe.transform(arr, 'tags', 'a');
    expect(res.length).toBe(1);
    expect(res[0].id).toBe(1);
  });
});
