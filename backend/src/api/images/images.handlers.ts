import { Request, Response } from 'express';

import { log, routeParamValue } from '../../utility/helpers.ts';
import { isDerivedImageFile } from './file-names.ts';
import { deleteImageSet, imageExists, listImageFiles } from './file-storage.ts';
import { resolveUploadPath } from './file-paths.ts';
import { editImage, resizeImage } from './image-processing.ts';
import { type ImageEditBody } from './images.types.ts';

const DEBUG = 'images | ';

export async function uploadImageFiles(req: Request, res: Response): Promise<void> {
  const file = !req.file ? 'No File' : req.file.originalname;
  log.info_lv2(`${DEBUG}uploadImageFiles: ${file}`);

  if (!req.file) {
    res.status(400).json('No file uploaded or invalid file type!');
    return;
  }

  if (!isDerivedImageFile(file)) {
    await resizeImage(file);
  }

  res.status(200).json('File uploaded successfully!');
}

export async function editImageFiles(req: Request, res: Response): Promise<void> {
  const body = req.body as ImageEditBody;
  const file = body.file ?? '';
  const saveTo = body.saveTo ?? '';
  const cropBoxData = body.cropBoxData;
  log.info_lv2(`${DEBUG}editImageFiles: ${saveTo}`);

  if (!file || !saveTo || cropBoxData === undefined) {
    res.status(400).json('No file specified!');
    return;
  }

  if (!imageExists(file)) {
    res.status(404).json('Image not found');
    return;
  }

  await editImage(resolveUploadPath(file), resolveUploadPath(saveTo), cropBoxData);
  res.status(200).json('');
}

export async function deleteImageFiles(req: Request, res: Response): Promise<void> {
  const file = routeParamValue(req.params['name']) ?? '';
  log.info_lv2(`${DEBUG}deleteImageFiles: ${file}`);

  if (!deleteImageSet(file)) {
    res.status(404).json('Image not found');
    return;
  }

  res.status(200).json('');
}

export async function getImageFiles(req: Request, res: Response): Promise<void> {
  log.info_lv2(`${DEBUG}getImageFiles`);
  res.status(200).json(listImageFiles());
}

export async function resetAllImageFiles(req: Request, res: Response): Promise<void> {
  log.info_lv2(`${DEBUG}resetAllImageFiles`);
  const filteredFilenames = listImageFiles();

  for (const img of filteredFilenames) {
    if (imageExists(img)) {
      await resizeImage(img);
    }
  }

  res.status(200).json(filteredFilenames);
}
