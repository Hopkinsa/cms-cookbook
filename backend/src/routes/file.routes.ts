import { Router } from 'express';

import { deleteImageFiles, editImageFiles, getImageFiles, uploadImageFiles } from '../api/images/images.ts';
import uploadImage from '../api/images/multer.middleware.ts';
import { requirePermission } from '../auth/auth.middleware.ts';

export const FILE_ROUTES = Router();

FILE_ROUTES.delete('/api/images/:name', requirePermission('image.delete'), deleteImageFiles);
FILE_ROUTES.post('/api/images/edit', requirePermission('image.update'), editImageFiles);
FILE_ROUTES.post('/api/images/upload', requirePermission('image.upload'), uploadImage.single('file'), uploadImageFiles);

/*
 * Use the following route to resize all existing images
 * Commented out as only really need if there are a lot of unedited pictures
FILE_ROUTES.get('/api/images/reset', resetAllImageFiles);
 */

FILE_ROUTES.get('/api/images', getImageFiles);
