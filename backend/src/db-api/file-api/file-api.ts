import { Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

import { log } from '../../utility/helpers.ts';

const DEBUG = 'file-api | ';

const UPLOAD_PATH = path.resolve('../backend/images/uploaded');

class FileApi {
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
    const filepath = `${UPLOAD_PATH}/${file}`;

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    } else {
      resCode = 404;
      resMessage = 'Image not found';
    }

    res.status(resCode).json(resMessage);
  };

  static getImageFiles = async (req: Request, res: Response): Promise<void> => {
    log.info_lv2(`${DEBUG}getImageFiles`);
    const filenames = fs.readdirSync(UPLOAD_PATH);

    const filteredFilenames: string[] = filenames.filter((name) => name !== '.DS_Store');

    res.status(200).json(filteredFilenames);
  };
}

export default FileApi;
