import { type Request, type Response } from 'express';

import { backup } from './backup.handlers.ts';

class Backup {
  static backup = (req: Request, res: Response): Promise<void> => backup(req, res);
}

export { backup };


export default Backup;
