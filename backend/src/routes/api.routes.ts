import { Router } from 'express';

import { recipeBody, searchQuery, sortQuery, tagBody } from '../validation/api.validation.ts';

import DefaultResponse from './default-response.ts';
import DBCreate from '../db-api/db-create/db-create.ts';
import DBRead from '../db-api/db-read/db-read.ts';
import DBUpdate from '../db-api/db-update/db-update.ts';
import DBDelete from '../db-api/db-delete/db-delete.ts';
import DBBackup from '../db-api/db-backup/db-backup.ts';
import DBRestore from '../db-api/db-restore/db-restore.ts';

export const API_ROUTES = Router();

API_ROUTES.delete('/recipe/:id', DBDelete.deleteRecipe); // By id
API_ROUTES.patch('/recipe/:id', recipeBody, DBUpdate.updateRecipe); // By id
API_ROUTES.post('/recipe', recipeBody, DBCreate.createRecipe);
API_ROUTES.get('/recipe/:id', DBRead.findRecipeByID); // By id

API_ROUTES.get('/search', searchQuery, DBRead.findRecipes);
API_ROUTES.get('/recipes', sortQuery, DBRead.getRecipes);

API_ROUTES.get('/units/:id', DBRead.findUnitByID); // By id
API_ROUTES.get('/units', DBRead.getUnits);

API_ROUTES.delete('/tags/:id', DBDelete.deleteTag); // By id
API_ROUTES.patch('/tags/:id', tagBody, DBUpdate.updateTag); // By id
API_ROUTES.post('/tags', tagBody, DBCreate.createTag);
API_ROUTES.get('/tags/:id', DBRead.findTagByID); // By id
API_ROUTES.get('/tags', DBRead.getTags);

// API_ROUTES.post('/restore', DBRestore.dbRestore);
API_ROUTES.post('/backup', DBBackup.dbBackup);

// Catch-all
API_ROUTES.get('/{*splat}', DefaultResponse.site_root);
