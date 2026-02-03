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

  static resizeImage(filename: string): void {
    const fileNames = FileApi.generateNames(filename);

    sharp(`${UPLOAD_PATH}/${filename}`)
      .resize({ width: 450 })
      .jpeg({ quality: 50 })
      .toFile(`${UPLOAD_PATH}/${fileNames.icon}`);

    sharp(`${UPLOAD_PATH}/${filename}`)
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toFile(`${UPLOAD_PATH}/${fileNames.banner}`);
  }

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
        FileApi.resizeImage(file);
      }
      resCode = 200;
      resMessage = 'File uploaded successfully!';
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
