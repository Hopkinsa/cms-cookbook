import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  const pipe = new TruncatePipe();

  it('should truncate long strings and append ellipsis', () => {
    expect(pipe.transform('abcdef', 3)).toBe('abc...');
  });

  it('should not truncate strings that are shorter or equal to length', () => {
    expect(pipe.transform('abc', 3)).toBe('abc');
  });

  it('should handle number input by converting to string', () => {
    expect(pipe.transform(12345, 3)).toBe('123...');
  });

  it('should handle object input by converting to string', () => {
    const result = pipe.transform({ a: 1, b: 2 }, 5);
    // [object Object] -> first 5 chars [obje + '...'
    expect(result).toBe('[obje...');
  });
});
