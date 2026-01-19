import { SortArrayPipe } from './sort-array.pipe';

describe('SortArrayPipe', () => {
  const pipe = new SortArrayPipe();

  it('should return null when collection is null', () => {
    expect(pipe.transform(null, 'name', 'asc')).toBeNull();
  });

  it('should sort an array of strings ascending', () => {
    const arr = ['b', 'a', 'c'];
    const res = pipe.transform(arr, 'name', 'asc');
    expect(res).toEqual(['a', 'b', 'c']);
  });

  it('should sort an array of strings descending', () => {
    const arr = ['b', 'a', 'c'];
    const res = pipe.transform(arr, 'name', 'desc');
    expect(res).toEqual(['c', 'b', 'a']);
  });

  it('should return original collection if field is falsy', () => {
    const arr = ['b', 'a'];
    const res = pipe.transform(arr, '', '');
    expect(res).toBe(arr);
  });
});
