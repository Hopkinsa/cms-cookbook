import { Request, Response } from 'express';
import { log } from '../utility/helpers.ts';

const DEBUG = 'default-response | ';

class DefaultResponse {
  static site_root = (req: Request, res: Response): void => {
    try {
      log.info_lv2(`${DEBUG}site_root`);

      res.status(200).send('Incorrect route');
    } catch (err: any) {
      log.error(`${DEBUG}site_root: `, err.message);
    }
  };
}

export default DefaultResponse;
