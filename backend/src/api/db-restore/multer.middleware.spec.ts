import uploadZip from './multer.middleware';

describe('db-restore multer', () => {
  test('uploadZip exists', () => {
    expect(uploadZip).toBeDefined();
  });
});