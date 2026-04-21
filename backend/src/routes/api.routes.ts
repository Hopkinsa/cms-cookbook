import { Router } from 'express';

import { recipeBody, searchQuery, sortQuery, tagBody } from '../validation/api.validation.ts';

import { backup } from '../api/backup/backup.ts';
import { findRecipeByID, findRecipes, getRecipes } from '../api/recipe/recipe-read.ts';
import { createRecipe, deleteRecipe, updateRecipe } from '../api/recipe/recipe-write.ts';
import { restore } from '../api/restore/restore.ts';
import { findTagByID, getTags } from '../api/tag/tag-read.ts';
import { createTag, deleteTag, updateTag } from '../api/tag/tag-write.ts';
import { findUnitByID, getUnits } from '../api/unit/unit-read.ts';

import uploadZip from '../api/restore/multer.middleware.ts';

export const API_ROUTES = Router();

API_ROUTES.delete('/api/recipe/:id', deleteRecipe); // By id
API_ROUTES.patch('/api/recipe/:id', recipeBody, updateRecipe); // By id
API_ROUTES.post('/api/recipe', recipeBody, createRecipe);
API_ROUTES.get('/api/recipe/:id', findRecipeByID); // By id

API_ROUTES.get('/api/search', searchQuery, findRecipes);
API_ROUTES.get('/api/recipes', sortQuery, getRecipes);

API_ROUTES.get('/api/units/:id', findUnitByID); // By id
API_ROUTES.get('/api/units', getUnits);

API_ROUTES.delete('/api/tags/:id', deleteTag); // By id
API_ROUTES.patch('/api/tags/:id', tagBody, updateTag); // By id
API_ROUTES.post('/api/tags', tagBody, createTag);
API_ROUTES.get('/api/tags/:id', findTagByID); // By id
API_ROUTES.get('/api/tags', getTags);

API_ROUTES.post('/api/restore', uploadZip.single('file'), restore);
API_ROUTES.get('/api/backup', backup);


