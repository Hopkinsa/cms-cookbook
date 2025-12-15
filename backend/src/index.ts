import { createServer } from 'http';

import { log } from './utility/helpers.ts'
import { connectToDatabase } from './services/db.service.ts';
import { app } from './app.ts';

const server = createServer(app);

log.title(`Starting Cookbook backend server`);
connectToDatabase()
.then(() => {
  server.listen(3000, () => {
    log.info_lv2(`Server port: 3000`);
  });
})
.catch((error: Error) => {
  log.error('Database connection failed', error.message);
  process.exit();
});
