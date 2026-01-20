import { Request, Response } from 'express';

import * as path from 'path';
import * as fs from 'fs';
import { STATIC_PATH } from '../utility/helpers.ts';
import { log } from '../utility/helpers.ts';

const DEBUG = 'angular-routes | ';

class AngularResponse {
  static angular_root = (req: Request, res: Response): void => {
    try {
      if (req.path === '/' || req.path === '') {
        res.sendFile(path.join(STATIC_PATH, 'index.html'));
      } else {
        const filepath = path.join(STATIC_PATH, req.path);
        if (fs.existsSync(filepath)) {
          res.sendFile(filepath);
        } else {
          if (path.extname(filepath as string).trim() === '') {
            res.sendFile(path.join(STATIC_PATH, 'index.html'));
          } else {
            log.error(`${DEBUG}Unknown file: ${req.path as string}`);
          }
        }
      }
    } catch (err: unknown) {
      log.error(`${DEBUG}Catch-all: ${err as unknown as string}`);
    }
  };
}

export default AngularResponse;
