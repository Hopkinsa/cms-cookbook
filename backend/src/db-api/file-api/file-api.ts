import { Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

import { log } from '../../utility/helpers.ts';

const DEBUG = 'file-api | ';

const UPLOAD_PATH = path.resolve('../backend/images/uploaded');

class FileApi {
  // POST route for file upload
  public static uploadImageFiles = async (req: Request, res: Response) => {
    const file: string = !req.file ? 'No File' : req.file?.originalname;
    log.info_lv2(`${DEBUG}uploadImageFiles: ${file}`);
    let res_code = 200;
    let res_message = '';

    if (!req.file) {
      res_code = 400;
      res_message = 'No file uploaded or invalid file type!';
    } else {
      res_code = 200;
      res_message = 'File uploaded successfully!';
    }
    res.status(res_code).json(res_message);
  };

  public static deleteImageFiles = async (req: Request, res: Response) => {
    const file: string = req.params['name'];
    log.info_lv2(`${DEBUG}deleteImageFiles: ${file}`);
    let res_code = 200;
    let res_message = '';
    const filepath = `${UPLOAD_PATH}/${file}`;

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    } else {
      res_code = 404;
      res_message = 'Image not found';
    }

    res.status(res_code).json(res_message);
  };

  public static getImageFiles = async (req: Request, res: Response) => {
    log.info_lv2(`${DEBUG}getImageFiles`);
    const filenames = fs.readdirSync(UPLOAD_PATH);

    const filteredFilenames: string[] = filenames.filter((name) => name !== '.DS_Store');

    res.status(200).json(filteredFilenames);
  };
}

export default FileApi;
