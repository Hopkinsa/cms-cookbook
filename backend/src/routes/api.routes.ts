import { Router } from 'express';

import {
	loginBody,
	passwordResetBody,
	passwordResetRequestBody,
	recipeBody,
	searchQuery,
	sortQuery,
	tagBody,
	userCreateBody,
	userUpdateBody,
} from '../validation/api.validation.ts';

import {
	completePasswordReset,
	createUserHandler,
	deleteUserHandler,
	getSession,
	listUsers,
	login,
	logout,
	requestPasswordReset,
	updateUserHandler,
} from '../api/auth/auth.ts';
import { backup } from '../api/backup/backup.ts';
import { findRecipeByID, findRecipes, getRecipes } from '../api/recipe/recipe-read.ts';
import { createRecipe, deleteRecipe, updateRecipe } from '../api/recipe/recipe-write.ts';
import { restore } from '../api/restore/restore.ts';
import { findTagByID, getTags } from '../api/tag/tag-read.ts';
import { createTag, deleteTag, updateTag } from '../api/tag/tag-write.ts';
import { findUnitByID, getUnits } from '../api/unit/unit-read.ts';
import { requirePermission } from '../auth/auth.middleware.ts';

import uploadZip from '../api/restore/multer.middleware.ts';

export const API_ROUTES = Router();

API_ROUTES.post('/api/auth/login', loginBody, login);
API_ROUTES.post('/api/auth/logout', logout);
API_ROUTES.get('/api/auth/session', getSession);
API_ROUTES.post('/api/auth/password-reset/request', passwordResetRequestBody, requestPasswordReset);
API_ROUTES.post('/api/auth/password-reset/complete', passwordResetBody, completePasswordReset);

API_ROUTES.get('/api/users', requirePermission('user.read'), listUsers);
API_ROUTES.post('/api/users', requirePermission('user.create'), userCreateBody, createUserHandler);
API_ROUTES.patch('/api/users/:id', requirePermission('user.update'), userUpdateBody, updateUserHandler);
API_ROUTES.delete('/api/users/:id', requirePermission('user.delete'), deleteUserHandler);

API_ROUTES.delete('/api/recipe/:id', requirePermission('recipe.delete'), deleteRecipe); // By id
API_ROUTES.patch('/api/recipe/:id', requirePermission('recipe.update'), recipeBody, updateRecipe); // By id
API_ROUTES.post('/api/recipe', requirePermission('recipe.create'), recipeBody, createRecipe);
API_ROUTES.get('/api/recipe/:id', findRecipeByID); // By id

API_ROUTES.get('/api/search', searchQuery, findRecipes);
API_ROUTES.get('/api/recipes', sortQuery, getRecipes);

API_ROUTES.get('/api/units/:id', findUnitByID); // By id
API_ROUTES.get('/api/units', getUnits);

API_ROUTES.delete('/api/tags/:id', requirePermission('tag.delete'), deleteTag); // By id
API_ROUTES.patch('/api/tags/:id', requirePermission('tag.update'), tagBody, updateTag); // By id
API_ROUTES.post('/api/tags', requirePermission('tag.create'), tagBody, createTag);
API_ROUTES.get('/api/tags/:id', findTagByID); // By id
API_ROUTES.get('/api/tags', getTags);

API_ROUTES.post('/api/restore', requirePermission('backup.restore'), uploadZip.single('file'), restore);
API_ROUTES.get('/api/backup', requirePermission('backup.export'), backup);


