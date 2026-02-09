import { Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import sharp from 'sharp';

import { IMAGE_PATH, log } from '../../utility/helpers.ts';

const DEBUG = 'file-api | ';

const UPLOAD_PATH = path.resolve(`${IMAGE_PATH}`);

class FileApi {
  static generateNames(fileName: string): { icon: string; banner: string } {
    const lastIndex = fileName.lastIndexOf('.');
    const before = fileName.slice(0, lastIndex);
    const after = fileName.slice(lastIndex); // if (lastIndex + 1) it would not include the period
    const nameIcon = `${before}-Icon${after}`;
    const nameBanner = `${before}-Banner${after}`;
    return { icon: nameIcon, banner: nameBanner };
  }

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
        const scaleX = iconWidth / width;
        const newHeight = height * scaleX;
        const cropArea = {
          left: 0,
          top: Math.round(Math.abs(newHeight - iconHeight) / 2),
          width: iconWidth,
          height: iconHeight,
        };
        sharp(input)
          .resize(Math.round(width * scaleX))
          .extract(cropArea)
          .jpeg({ quality: 80 })
          .toFile(outputIcon);
      });

    await sharp(input)
      .metadata()
      .then(({ width, height }) => {
        const scaleX = bannerWidth / width;
        const newHeight = height * scaleX;
        const cropArea = {
          left: 0,
          top: Math.round(Math.abs(newHeight - bannerHeight) / 2),
          width: bannerWidth,
          height: bannerHeight,
        };
        sharp(input)
          .resize(Math.round(width * scaleX))
          .extract(cropArea)
          .jpeg({ quality: 80 })
          .toFile(outputBanner);
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
          );
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

  static getImageFiles = async (req: Request, res: Response): Promise<void> => {
    log.info_lv2(`${DEBUG}getImageFiles`);
    const filenames = fs.readdirSync(UPLOAD_PATH);

    const filteredFilenames: string[] = filenames.filter(
      (name) => name !== '.DS_Store' && !name.includes('-Icon.') && !name.includes('-Banner.'),
    );
    res.status(200).json(filteredFilenames);
  };
}

export default FileApi;
