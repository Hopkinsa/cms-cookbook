import { generateFilename } from './filename.helper';

describe('generateFilename', () => {
  it('should create icon and banner for simple filename', () => {
    const res = generateFilename('image.jpg');
    expect(res.icon).toBe('image-Icon.jpg');
    expect(res.banner).toBe('image-Banner.jpg');
  });

  it('should handle filenames with multiple dots', () => {
    const res = generateFilename('archive.tar.gz');
    expect(res.icon).toBe('archive.tar-Icon.gz');
    expect(res.banner).toBe('archive.tar-Banner.gz');
  });

  it('should follow current behavior for names without a dot', () => {
    // current implementation uses lastIndexOf('.') which returns -1
    // and results in slice(0, -1) for "before" and slice(-1) for "after"
    const res = generateFilename('filename');
    expect(res.icon).toBe('filenam-Icone');
    expect(res.banner).toBe('filenam-Bannere');
  });
});
