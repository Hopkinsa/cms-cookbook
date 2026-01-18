import { Router } from 'express';

import FileApi from '../db-api/file-api/file-api.ts';
import uploadImage from '../db-api/file-api/multer.middleware.ts';

export const FILE_ROUTES = Router();

FILE_ROUTES.delete('/images/:name', FileApi.deleteImageFiles);
FILE_ROUTES.post('/images/upload', uploadImage.single('file'), FileApi.uploadImageFiles);
FILE_ROUTES.get('/images', FileApi.getImageFiles);
