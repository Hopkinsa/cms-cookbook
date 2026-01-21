import { createServer } from 'http';

import { log } from './utility/helpers.ts';
import  DBService from './services/db.service.ts';
import { app } from './app.ts';

const PORT = 3000;
const server = createServer(app);

log.title(`Starting Cookbook backend server`);
DBService.connectToDatabase()
  .then(() => {
    server.listen(PORT, () => {
      log.info_lv2(`Server port: ${PORT}`);
    });
  })
  .catch((error: Error) => {
    log.error('Database connection failed', error.message);
    process.exit();
  });
