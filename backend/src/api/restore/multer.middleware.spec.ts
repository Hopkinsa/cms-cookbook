import uploadZip from './multer.middleware';

describe('restore multer', () => {
  test('uploadZip exists', () => {
    expect(uploadZip).toBeDefined();
  });
});
