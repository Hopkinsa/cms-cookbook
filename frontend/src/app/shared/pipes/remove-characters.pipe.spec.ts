import { RemoveCharactersPipe } from './remove-characters.pipe';

describe('RemoveCharactersPipe', () => {
  const pipe = new RemoveCharactersPipe();

  it('should replace all occurrences of a character', () => {
    expect(pipe.transform('a-b-c', '-', '_')).toBe('a_b_c');
  });

  it('should leave string unchanged when character not present', () => {
    expect(pipe.transform('abc', 'x', '_')).toBe('abc');
  });

  it('should replace multiple occurrences', () => {
    expect(pipe.transform('----', '-', '')).toBe('');
  });
});
