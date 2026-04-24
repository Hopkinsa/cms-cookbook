jest.mock('sharp', () => jest.fn());

import sharp from 'sharp';

import { log } from '../../utility/helpers.ts';
import { editImage, resizeDimensions, resizeImage, toCropArea } from './image-processing.ts';

type SharpInstance = {
  metadata: jest.Mock;
  resize: jest.Mock;
  extract: jest.Mock;
  jpeg: jest.Mock;
  toFile: jest.Mock;
  rotate: jest.Mock;
  flip: jest.Mock;
  flop: jest.Mock;
};

function createSharpInstance(options?: { metadata?: { width?: number; height?: number }; error?: Error }): SharpInstance {
  const instance: SharpInstance = {
    metadata: jest.fn(),
    resize: jest.fn(),
    extract: jest.fn(),
    jpeg: jest.fn(),
    toFile: jest.fn(),
    rotate: jest.fn(),
    flip: jest.fn(),
    flop: jest.fn(),
  };

  instance.metadata.mockImplementation(() => {
    if (options?.error) {
      return Promise.reject(options.error);
    }

    return Promise.resolve(options?.metadata ?? {});
  });
  instance.resize.mockReturnValue(instance);
  instance.extract.mockReturnValue(instance);
  instance.jpeg.mockReturnValue(instance);
  instance.rotate.mockReturnValue(instance);
  instance.flip.mockReturnValue(instance);
  instance.flop.mockReturnValue(instance);
  instance.toFile.mockResolvedValue(undefined);

  return instance;
}

describe('image-processing', () => {
  const sharpMock = sharp as unknown as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calculates resized dimensions for standard and short source images', () => {
    expect(resizeDimensions(450, 270, 900, 600)).toEqual({
      width: 450,
      height: 300,
      crop: { left: 0, top: 15, width: 450, height: 270 },
    });

    expect(resizeDimensions(800, 171, 1000, 100)).toEqual({
      width: 1710,
      height: 171,
      crop: { left: 0, top: 0, width: 800, height: 171 },
    });
  });

  it('converts crop box data into numeric crop coordinates', () => {
    expect(
      toCropArea({
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
        x: '10',
        y: '11',
        width: '120',
        height: '90',
      }),
    ).toEqual({ left: 10, top: 11, width: 120, height: 90 });
  });

  it('resizes icon and banner variants for an uploaded image', async () => {
    const iconMetadata = createSharpInstance({ metadata: { width: 900, height: 600 } });
    const iconWrite = createSharpInstance();
    const bannerMetadata = createSharpInstance({ metadata: { width: 900, height: 600 } });
    const bannerWrite = createSharpInstance();
    const sharpCalls = [iconMetadata, iconWrite, bannerMetadata, bannerWrite];
    sharpMock.mockImplementation(() => sharpCalls.shift());

    await resizeImage('photo.jpg');

    expect(iconWrite.resize).toHaveBeenCalledWith(450, 300);
    expect(iconWrite.extract).toHaveBeenCalledWith({ left: 0, top: 15, width: 450, height: 270 });
    expect(iconWrite.toFile).toHaveBeenCalledWith(expect.stringContaining('/photo-Icon.jpg'));

    expect(bannerWrite.resize).toHaveBeenCalledWith(800, 533);
    expect(bannerWrite.extract).toHaveBeenCalledWith({ left: 0, top: 181, width: 800, height: 171 });
    expect(bannerWrite.toFile).toHaveBeenCalledWith(expect.stringContaining('/photo-Banner.jpg'));
  });

  it('logs resize errors when sharp metadata fails', async () => {
    const errorSpy = jest.spyOn(log, 'error').mockImplementation(() => {});
    const resizeCalls = [
      createSharpInstance({ error: new Error('icon failed') }),
      createSharpInstance({ error: new Error('banner failed') }),
    ];
    sharpMock.mockImplementation(() => resizeCalls.shift());

    await resizeImage('photo.jpg');

    expect(errorSpy).toHaveBeenCalledWith('images | resizeImage Icon: ', 'icon failed');
    expect(errorSpy).toHaveBeenCalledWith('images | resizeImage Banner: ', 'banner failed');
  });

  it('edits an image with rotate, flip, flop, and crop operations', async () => {
    const metadataInstance = createSharpInstance({ metadata: { width: 120, height: 80 } });
    const editInstance = createSharpInstance();
    const sharpCalls = [metadataInstance, editInstance];
    sharpMock.mockImplementation(() => sharpCalls.shift());

    await editImage('input.jpg', 'output.jpg', {
      rotate: 90,
      scaleX: -2,
      scaleY: -3,
      x: '4',
      y: '5',
      width: '60',
      height: '40',
    });

    expect(editInstance.resize).toHaveBeenCalledWith(240, 240);
    expect(editInstance.rotate).toHaveBeenCalledWith(90);
    expect(editInstance.extract).toHaveBeenCalledWith({ left: 4, top: 5, width: 60, height: 40 });
    expect(editInstance.flip).toHaveBeenCalledWith(true);
    expect(editInstance.flop).toHaveBeenCalledWith(true);
    expect(editInstance.toFile).toHaveBeenCalledWith('output.jpg');
  });

  it('logs edit errors when sharp metadata fails', async () => {
    const errorSpy = jest.spyOn(log, 'error').mockImplementation(() => {});
    sharpMock.mockImplementation(() => createSharpInstance({ error: new Error('edit failed') }));

    await editImage('input.jpg', 'output.jpg', {
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
      x: '0',
      y: '0',
      width: '10',
      height: '10',
    });

    expect(errorSpy).toHaveBeenCalledWith('images | editImage: ', 'edit failed');
  });
});
