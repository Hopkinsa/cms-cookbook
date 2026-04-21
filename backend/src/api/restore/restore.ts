import { type Request, type Response } from 'express';

import { processUpload, restore } from './restore.handlers.ts';

class Restore {
  static processUpload = (req: Request): Promise<boolean> => processUpload(req);

  static restore = (req: Request, res: Response): Promise<void> => restore(req, res);
}

export { processUpload, restore };

export default Restore;
