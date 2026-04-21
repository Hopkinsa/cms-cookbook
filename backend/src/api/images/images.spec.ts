// Mock fs functions at module level to avoid spy-on config errors
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  unlinkSync: jest.fn(),
  readdirSync: jest.fn(),
}));

import ImagesApi from './images';
import * as fs from 'fs';
import * as imageProcessing from './image-processing';
import sharp from 'sharp';

jest.mock('sharp');

describe('ImagesApi', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    (sharp as unknown as jest.Mock).mockClear();
  });

  test('generateNames produces icon and banner names', () => {
    const names = ImagesApi.generateNames('test.jpg');
    expect(names.icon).toBe('test-Icon.jpg');
    expect(names.banner).toBe('test-Banner.jpg');
  });

  test('uploadImageFiles responds 400 when no file', async () => {
    const req: any = {};
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await ImagesApi.uploadImageFiles(req, res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalled();
  });

  test('uploadImageFiles skips resize for derived filenames', async () => {
    const req: any = { file: { originalname: 'test-Icon.jpg' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };
    const resizeSpy = jest.spyOn(ImagesApi, 'resizeImage').mockResolvedValue(undefined);

    await ImagesApi.uploadImageFiles(req, res);
    expect(status).toHaveBeenCalledWith(200);
    expect(resizeSpy).not.toHaveBeenCalled();
  });

  test('editImageFiles responds 400 when crop data is missing', async () => {
    const req: any = { body: { file: 'test.jpg', saveTo: 'out.jpg' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await ImagesApi.editImageFiles(req, res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith('No file specified!');
  });

  test('deleteImageFiles returns 404 when file not found', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    const req: any = { params: { name: 'nope.jpg' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await ImagesApi.deleteImageFiles(req, res);
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith('Image not found');
  });

  test('getImageFiles filters names', async () => {
    const files = ['.DS_Store', 'a-Icon.jpg', 'b-Banner.jpg', 'good.jpg'];
    (fs.readdirSync as jest.Mock).mockReturnValue(files as any);
    const req: any = {};
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await ImagesApi.getImageFiles(req, res);
    expect(json).toHaveBeenCalledWith(['good.jpg']);
  });

  test('listImageFiles filters generated variants', async () => {
    const files = ['.DS_Store', 'a-Icon.jpg', 'b-Banner.jpg', 'good.jpg'];
    (fs.readdirSync as jest.Mock).mockReturnValue(files as any);

    await expect(ImagesApi.listImageFiles()).resolves.toEqual(['good.jpg']);
  });

  test('resetAllImageFiles filters names and resizes each source image', async () => {
    const files = ['.DS_Store', 'a-Icon.jpg', 'b-Banner.jpg', 'good.jpg'];
    (fs.readdirSync as jest.Mock).mockReturnValue(files as any);
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    const resizeSpy = jest.spyOn(imageProcessing, 'resizeImage').mockResolvedValue(undefined);
    const req: any = {};
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await ImagesApi.resetAllImageFiles(req, res);
    expect(json).toHaveBeenCalledWith(['good.jpg']);
    expect(resizeSpy).toHaveBeenCalledWith('good.jpg');
  });
});
