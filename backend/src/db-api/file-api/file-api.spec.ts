// Mock fs functions at module level to avoid spy-on config errors
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  unlinkSync: jest.fn(),
  readdirSync: jest.fn(),
}));

import FileApi from './file-api';
import * as fs from 'fs';
import sharp from 'sharp';

jest.mock('sharp');

describe('FileApi', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    (sharp as unknown as jest.Mock).mockClear();
  });

  test('generateNames produces icon and banner names', () => {
    const names = FileApi.generateNames('test.jpg');
    expect(names.icon).toBe('test-Icon.jpg');
    expect(names.banner).toBe('test-Banner.jpg');
  });

  test('uploadImageFiles responds 400 when no file', async () => {
    const req: any = {};
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await FileApi.uploadImageFiles(req, res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalled();
  });

  test('deleteImageFiles returns 404 when file not found', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    const req: any = { params: { name: 'nope.jpg' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await FileApi.deleteImageFiles(req, res);
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith('Image not found');
  });

  test('getImageFiles filters names and calls resizeImage', async () => {
    const files = ['.DS_Store', 'a-Icon.jpg', 'b-Banner.jpg', 'good.jpg'];
    (fs.readdirSync as jest.Mock).mockReturnValue(files as any);
    const resizeSpy = jest.spyOn(FileApi as any, 'resizeImage').mockImplementation(() => {});
    const req: any = {};
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await FileApi.getImageFiles(req, res);
    expect(json).toHaveBeenCalledWith(['good.jpg']);
    expect(resizeSpy).toHaveBeenCalledWith('good.jpg');
  });
});