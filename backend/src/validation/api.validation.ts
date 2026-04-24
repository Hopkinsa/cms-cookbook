import { body, query } from 'express-validator';

import { AUTH_PERMISSION_CODES } from '../auth/auth.types.ts';

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

export const sortQuery = [
  query('t').optional().trim().escape().matches('title|created|updated').withMessage('There must be a target to sort by'),
  query('d').optional().trim().escape().matches('asc|desc').withMessage('There must be a direction (asc or desc)')
];

const passwordRule = body('password')
  .isString()
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters');

const permissionRule = body('permissions')
  .isArray()
  .withMessage('Permissions must be supplied as an array')
  .custom((permissions: unknown[]) => permissions.every((permission) => {
    return typeof permission === 'string' && AUTH_PERMISSION_CODES.includes(permission as (typeof AUTH_PERMISSION_CODES)[number]);
  }))
  .withMessage('Permissions contain an invalid code');

export const loginBody = [
  body('login').trim().notEmpty().withMessage('Login is required'),
  passwordRule,
];

export const userCreateBody = [
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('surname').trim().isLength({ min: 1 }).withMessage('Surname is required'),
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').trim().isEmail().withMessage('A valid email address is required'),
  passwordRule,
  body('isActive').isBoolean().withMessage('isActive must be a boolean'),
  permissionRule,
];

export const userUpdateBody = [
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('surname').trim().isLength({ min: 1 }).withMessage('Surname is required'),
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').trim().isEmail().withMessage('A valid email address is required'),
  body('password').optional({ values: 'falsy' }).isString().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('isActive').isBoolean().withMessage('isActive must be a boolean'),
  permissionRule,
];

export const passwordResetRequestBody = [body('login').trim().notEmpty().withMessage('Login is required')];

export const passwordResetBody = [
  body('token').trim().notEmpty().withMessage('Reset token is required'),
  passwordRule,
];
