import { body, query } from 'express-validator';

export const recipeBody = [
  body('title').trim().escape().isLength({ min: 5 }).withMessage('Must be at least 5 characters'),

  body('description').trim().escape(),

  body('img_url').trim().escape(),

  body('prep_time').trim().matches('[0-9]').withMessage('Must be numeric'),

  body('cook_time').trim().matches('[0-9]').withMessage('Must be numeric'),

  body('serves').trim().matches('[0-9]').withMessage('Must be numeric'),

  body('notes').trim().escape(),
];

export const tagBody = [
  body('type').trim().escape().notEmpty().withMessage('There must be a type'),

  body('tag').trim().escape().isLength({ min: 3 }).withMessage('Must be at least 3 characters'),
];

export const searchQuery = [query('terms').trim().escape().notEmpty().withMessage('There must be a search term')];
