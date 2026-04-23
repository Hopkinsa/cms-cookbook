import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';

import { IMAGE_PATH, TEMPLATE_PATH } from './utility/helpers.ts';
import { createSessionMiddleware, getAllowedOrigin } from './auth/auth.session.ts';
import { FILE_ROUTES } from './routes/file.routes.ts';
import { API_ROUTES } from './routes/api.routes.ts';
import AngularResponse from './routes/angular-routes.ts';

export const app: Express = express();

app.set('trust proxy', 1);

const allowedOrigin = getAllowedOrigin();

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Expose-Headers', 'x-total-count');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type,authorization');
  next();
});

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// parse requests of content-type - application/json
app.use(
  express.json({
    inflate: true,
    limit: '100kb',
    strict: true,
    type: 'application/json',
  }),
);

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    exposedHeaders: ['x-total-count'],
  }),
);

app.use(createSessionMiddleware());

app.use('/image', express.static(`${IMAGE_PATH}`));
app.use('/template', express.static(`${TEMPLATE_PATH}`));

app.use(FILE_ROUTES);
app.use(API_ROUTES);

// Catch-all to serve Angular app
API_ROUTES.get('/{*splat}', AngularResponse.angular_root);
