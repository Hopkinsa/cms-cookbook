import { type Request, type Response } from 'express';

import { deleteImageFiles, editImageFiles, getImageFiles, resetAllImageFiles, uploadImageFiles } from './images.handlers.ts';
import { generateNames } from './file-names.ts';
import { resizeDimensions, resizeImage } from './image-processing.ts';
import { listImageFiles } from './file-storage.ts';
import { type ICropArea } from './images.types.ts';

class ImagesApi {
  static generateNames = generateNames;

  static resizeDimensions = (
    targetWidth: number,
    targetHeight: number,
    imgWidth: number,
    imgHeight: number,
  ): { width: number; height: number; crop: ICropArea } => resizeDimensions(targetWidth, targetHeight, imgWidth, imgHeight);

  static resizeImage = resizeImage;

  static uploadImageFiles = (req: Request, res: Response): Promise<void> => uploadImageFiles(req, res);

  static editImageFiles = (req: Request, res: Response): Promise<void> => editImageFiles(req, res);

  static deleteImageFiles = (req: Request, res: Response): Promise<void> => deleteImageFiles(req, res);

  static listImageFiles = async (): Promise<string[]> => listImageFiles();

  static getImageFiles = (req: Request, res: Response): Promise<void> => getImageFiles(req, res);

  static resetAllImageFiles = (req: Request, res: Response): Promise<void> => resetAllImageFiles(req, res);
}

export { deleteImageFiles, editImageFiles, getImageFiles, resetAllImageFiles, uploadImageFiles };

export default ImagesApi;
