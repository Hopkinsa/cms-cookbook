import sharp from 'sharp';

import { log } from '../../utility/helpers.ts';
import { generateNames } from './file-names.ts';
import { resolveUploadPath } from './file-paths.ts';
import { type ICropArea, type ImageCropBoxData } from './images.types.ts';

const DEBUG = 'images | ';

const IMAGE_VARIANTS = {
  icon: { width: 450, height: 270, errorContext: 'resizeImage Icon' },
  banner: { width: 800, height: 171, errorContext: 'resizeImage Banner' },
} as const;

export function resizeDimensions(
  targetWidth: number,
  targetHeight: number,
  imgWidth: number,
  imgHeight: number,
): { width: number; height: number; crop: ICropArea } {
  const scaleX = targetWidth / imgWidth;
  const scaleY = targetHeight / imgHeight;
  let newWidth = Math.round(imgWidth * scaleX);
  let newHeight = Math.round(imgHeight * scaleX);

  if (newHeight <= targetHeight) {
    newWidth = Math.round(imgWidth * scaleY);
    newHeight = Math.round(imgHeight * scaleY);
  }

  if (newWidth <= targetWidth) {
    newWidth = Math.round(imgWidth * scaleX);
  }

  return {
    width: newWidth,
    height: newHeight,
    crop: {
      left: 0,
      top: Math.round(Math.abs(newHeight - targetHeight) / 2),
      width: targetWidth,
      height: targetHeight,
    },
  };
}

async function writeResizedVariant(
  inputPath: string,
  outputPath: string,
  targetWidth: number,
  targetHeight: number,
  errorContext: string,
): Promise<void> {
  await sharp(inputPath)
    .metadata()
    .then(({ width = targetWidth, height = targetHeight }) => {
      const newSize = resizeDimensions(targetWidth, targetHeight, width, height);
      return sharp(inputPath)
        .resize(newSize.width, newSize.height)
        .extract(newSize.crop)
        .jpeg({ quality: 80 })
        .toFile(outputPath);
    })
    .catch((err: Error) => {
      log.error(`${DEBUG}${errorContext}: `, err.message);
    });
}

export async function resizeImage(filename: string): Promise<void> {
  const fileNames = generateNames(filename);
  const inputPath = resolveUploadPath(filename);

  await writeResizedVariant(
    inputPath,
    resolveUploadPath(fileNames.icon),
    IMAGE_VARIANTS.icon.width,
    IMAGE_VARIANTS.icon.height,
    IMAGE_VARIANTS.icon.errorContext,
  );

  await writeResizedVariant(
    inputPath,
    resolveUploadPath(fileNames.banner),
    IMAGE_VARIANTS.banner.width,
    IMAGE_VARIANTS.banner.height,
    IMAGE_VARIANTS.banner.errorContext,
  );
}

export function toCropArea(cropBoxData: ImageCropBoxData): ICropArea {
  return {
    left: Number.parseInt(cropBoxData.x, 10),
    top: Number.parseInt(cropBoxData.y, 10),
    width: Number.parseInt(cropBoxData.width, 10),
    height: Number.parseInt(cropBoxData.height, 10),
  };
}

export async function editImage(inputPath: string, outputPath: string, cropBoxData: ImageCropBoxData): Promise<void> {
  const rotate = cropBoxData.rotate;
  const scaleX = Math.abs(cropBoxData.scaleX);
  const scaleY = Math.abs(cropBoxData.scaleY);
  const flipImage = cropBoxData.scaleX < 0;
  const flopImage = cropBoxData.scaleY < 0;
  const cropArea = toCropArea(cropBoxData);

  await sharp(inputPath)
    .metadata()
    .then(({ width = cropArea.width, height = cropArea.height }) =>
      sharp(inputPath)
        .resize(Math.round(width * scaleX), Math.round(height * scaleY))
        .rotate(rotate)
        .extract(cropArea)
        .flip(flipImage)
        .flop(flopImage)
        .jpeg({ quality: 80 })
        .toFile(outputPath),
    )
    .catch((err: Error) => {
      log.error(`${DEBUG}editImage: `, err.message);
    });
}
