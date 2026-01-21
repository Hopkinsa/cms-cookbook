import { Router } from 'express';

import { recipeBody, searchQuery, sortQuery, tagBody } from '../validation/api.validation.ts';

import DBCreate from '../db-api/db-create/db-create.ts';
import DBRead from '../db-api/db-read/db-read.ts';
import DBUpdate from '../db-api/db-update/db-update.ts';
import DBDelete from '../db-api/db-delete/db-delete.ts';
import DBBackup from '../db-api/db-backup/db-backup.ts';
import DBRestore from '../db-api/db-restore/db-restore.ts';

import uploadZip from '../db-api/db-restore/multer.middleware.ts';

export const API_ROUTES = Router();

API_ROUTES.delete('/api/recipe/:id', DBDelete.deleteRecipe); // By id
API_ROUTES.patch('/api/recipe/:id', recipeBody, DBUpdate.updateRecipe); // By id
API_ROUTES.post('/api/recipe', recipeBody, DBCreate.createRecipe);
API_ROUTES.get('/api/recipe/:id', DBRead.findRecipeByID); // By id

API_ROUTES.get('/api/search', searchQuery, DBRead.findRecipes);
API_ROUTES.get('/api/recipes', sortQuery, DBRead.getRecipes);

API_ROUTES.get('/api/units/:id', DBRead.findUnitByID); // By id
API_ROUTES.get('/api/units', DBRead.getUnits);

API_ROUTES.delete('/api/tags/:id', DBDelete.deleteTag); // By id
API_ROUTES.patch('/api/tags/:id', tagBody, DBUpdate.updateTag); // By id
API_ROUTES.post('/api/tags', tagBody, DBCreate.createTag);
API_ROUTES.get('/api/tags/:id', DBRead.findTagByID); // By id
API_ROUTES.get('/api/tags', DBRead.getTags);

API_ROUTES.post('/api/restore', uploadZip.single('file'), DBRestore.dbRestore);
API_ROUTES.get('/api/backup', DBBackup.dbBackup);


