import { Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import sharp from 'sharp';

import { IMAGE_PATH, log } from '../../utility/helpers.ts';

const DEBUG = 'file-api | ';

const UPLOAD_PATH = path.resolve(`${IMAGE_PATH}`);

interface ICropArea {
      left: number;
      top: number;
      width: number;
      height: number;
}

class FileApi {
  static generateNames(fileName: string): { icon: string; banner: string } {
    const lastIndex = fileName.lastIndexOf('.');
    const before = fileName.slice(0, lastIndex);
    const after = fileName.slice(lastIndex); // if (lastIndex + 1) it would not include the period
    const nameIcon = `${before}-Icon${after}`;
    const nameBanner = `${before}-Banner${after}`;
    return { icon: nameIcon, banner: nameBanner };
  }

  static resizeDimensions = (
    targetWidth: number,
    targetHeight: number,
    imgWidth: number,
    imgHeight: number,
  ): { width: number; height: number; crop: ICropArea } => {
    const scaleX = targetWidth / imgWidth;
    const scaleY = targetHeight / imgHeight;
    let newWidth = Math.round(imgWidth * scaleX);
    let newHeight = Math.round(imgHeight * scaleX);

    if (newHeight <= targetHeight) {
      newWidth = Math.round(imgWidth * scaleY);
      newHeight = Math.round(imgHeight * scaleY);
    }
    if (newWidth <= targetWidth) {
      // fallback - will distort image, but prevent error
      newWidth = Math.round(imgWidth * scaleX);
    }

    const cropArea = {
      left: 0,
      top: Math.round(Math.abs(newHeight - targetHeight) / 2),
      width: targetWidth,
      height: targetHeight,
    };

    return { width: newWidth, height: newHeight, crop: cropArea };
  };

  static resizeImage = async (filename: string): Promise<void> => {
    const fileNames = FileApi.generateNames(filename);

    const input = `${UPLOAD_PATH}/${filename}`;
    const outputIcon = `${UPLOAD_PATH}/${fileNames.icon}`;
    const outputBanner = `${UPLOAD_PATH}/${fileNames.banner}`;

    const iconWidth = 450;
    const iconHeight = 270;
    const bannerWidth = 800;
    const bannerHeight = 171;
    await sharp(input)
      .metadata()
      .then(({ width, height }) => {
        const newSize = FileApi.resizeDimensions(iconWidth, iconHeight, width, height);
        sharp(input).resize(newSize.width, newSize.height).extract(newSize.crop).jpeg({ quality: 80 }).toFile(outputIcon);
      })
      .catch((err) => {
        log.error(`${DEBUG}FileApi - resizeImage Icon: `, err.message);
      });

    await sharp(input)
      .metadata()
      .then(({ width, height }) => {
        const newSize = FileApi.resizeDimensions(bannerWidth, bannerHeight, width, height);
        sharp(input).resize(newSize.width, newSize.height).extract(newSize.crop).jpeg({ quality: 80 }).toFile(outputBanner);
      })
      .catch((err) => {
        log.error(`${DEBUG}FileApi - resizeImage Banner: `, err.message);
      });
  };

  // POST route for file upload
  static uploadImageFiles = async (req: Request, res: Response): Promise<void> => {
    const file: string = !req.file ? 'No File' : req.file?.originalname;
    log.info_lv2(`${DEBUG}uploadImageFiles: ${file}`);
    let resCode = 200;
    let resMessage = '';

    if (!req.file) {
      resCode = 400;
      resMessage = 'No file uploaded or invalid file type!';
    } else {
      if (!file.includes('-Icon.') && !file.includes('-Banner.')) {
        await FileApi.resizeImage(file);
      }
      resCode = 200;
      resMessage = 'File uploaded successfully!';
    }
    res.status(resCode).json(resMessage);
  };

  static editImageFiles = async (req: Request, res: Response): Promise<void> => {
    const file: string = !req.body.file ? '' : req.body.file;
    const saveTo: string = !req.body.saveTo ? '' : req.body.saveTo;
    const cropBoxData = req.body.cropBoxData;
    log.info_lv2(`${DEBUG}editImageFiles: ${saveTo}`);
    let resCode = 200;
    let resMessage = '';
    if (!file || !saveTo) {
      resCode = 400;
      resMessage = 'No file specified!';
    } else {
      const input = `${UPLOAD_PATH}/${file}`;
      const output = `${UPLOAD_PATH}/${saveTo}`;

      if (fs.existsSync(input)) {
        const rotate = cropBoxData.rotate;
        const scaleX = Math.abs(cropBoxData.scaleX); // Must be positive
        const scaleY = Math.abs(cropBoxData.scaleY); // Must be positive
        const cropX = parseInt(cropBoxData.x);
        const cropY = parseInt(cropBoxData.y);
        const cropWidth = parseInt(cropBoxData.width);
        const cropHeight = parseInt(cropBoxData.height);

        const flipImage = cropBoxData.scaleX < 0; // Mirror the image vertically
        const flopImage = cropBoxData.scaleY < 0; // Mirror the image horizontally

        const cropArea = {
          left: cropX,
          top: cropY,
          width: cropWidth,
          height: cropHeight,
        };

        await sharp(input)
          .metadata()
          .then(({ width, height }) =>
            sharp(input)
              .resize(Math.round(width * scaleX), Math.round(height * scaleY))
              .rotate(rotate)
              .extract(cropArea)
              .flip(flipImage)
              .flop(flopImage)
              .jpeg({ quality: 80 })
              .toFile(output),
          )
          .catch((err) => {
            log.error(`${DEBUG}FileApi - editImageFiles: `, err.message);
          });
      } else {
        resCode = 404;
        resMessage = 'Image not found';
      }
    }
    res.status(resCode).json(resMessage);
  };

  static deleteImageFiles = async (req: Request, res: Response): Promise<void> => {
    const file: string = req.params['name'];
    log.info_lv2(`${DEBUG}deleteImageFiles: ${file}`);
    let resCode = 200;
    let resMessage = '';
    const fileNames = FileApi.generateNames(file);
    const filepath1 = `${UPLOAD_PATH}/${file}`;
    const filepath2 = `${UPLOAD_PATH}/${fileNames.icon}`;
    const filepath3 = `${UPLOAD_PATH}/${fileNames.banner}`;

    if (fs.existsSync(filepath1)) {
      fs.unlinkSync(filepath1);
      if (fs.existsSync(filepath2)) {
        fs.unlinkSync(filepath2);
      }
      if (fs.existsSync(filepath3)) {
        fs.unlinkSync(filepath3);
      }
    } else {
      resCode = 404;
      resMessage = 'Image not found';
    }

    res.status(resCode).json(resMessage);
  };

  static listImageFiles = async (): Promise<string[]> => {
    log.info_lv2(`${DEBUG}listImageFiles`);
    const filenames = fs.readdirSync(UPLOAD_PATH);

    const filteredFilenames: string[] = filenames.filter(
      (name) => name !== '.DS_Store' && !name.includes('-Icon.') && !name.includes('-Banner.'),
    );
    return filteredFilenames;
  };

  static getImageFiles = async (req: Request, res: Response): Promise<void> => {
    log.info_lv2(`${DEBUG}getImageFiles`);

    const filteredFilenames: string[] = await FileApi.listImageFiles();

    res.status(200).json(filteredFilenames);
  };

  static resetAllImageFiles = async (req: Request, res: Response): Promise<void> => {
    log.info_lv2(`${DEBUG}resetAllImageFiles`);
    const filteredFilenames: string[] = await FileApi.listImageFiles();

    await filteredFilenames.forEach(async (img: string) => {
      const filepath = `${UPLOAD_PATH}/${img}`;
      if (fs.existsSync(filepath)) {
        await FileApi.resizeImage(img);
      }
    });

    res.status(200).json(filteredFilenames);
  };
}

export default FileApi;
