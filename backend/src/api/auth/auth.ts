import { Request, Response } from 'express';

import { handleValidationFailure, sendCompletedResponse, sendFailureResponse } from '../shared/write-handler.ts';
import { buildSessionResponse, getAuthSession } from '../../auth/auth.middleware.ts';
import { findUserByLogin, createPasswordResetToken, getUsers, createUser, updateUser, deleteUser, findUserById, resetUserPassword } from '../../auth/auth.repository.ts';
import { verifyPassword } from '../../auth/auth.password.ts';
import { type PermissionCode, type SessionUser } from '../../auth/auth.types.ts';
import { log, routeParamInt } from '../../utility/helpers.ts';

const DEBUG = 'auth.api | ';

function toSessionUser(user: ReturnType<typeof findUserById> extends infer T ? T : never): SessionUser {
  if (!user) {
    throw new Error('Cannot build session without user');
  }

  return {
    userId: user.id,
    firstName: user.firstName,
    surname: user.surname,
    username: user.username,
    email: user.email,
    permissions: user.permissions,
  };
}

function parsePermissions(value: unknown): PermissionCode[] {
  return Array.isArray(value) ? (value as PermissionCode[]) : [];
}

export async function login(req: Request, res: Response): Promise<void> {
  if (handleValidationFailure(req, res)) {
    return;
  }

  const loginValue = `${req.body['login'] ?? ''}`.trim();
  const password = `${req.body['password'] ?? ''}`;
  log.info_lv2(`${DEBUG}login: ${loginValue}`);

  const user = findUserByLogin(loginValue);
  if (!user || !user.isActive) {
    sendFailureResponse(res, 'Invalid credentials', 401);
    return;
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);
  if (!passwordValid) {
    sendFailureResponse(res, 'Invalid credentials', 401);
    return;
  }

  getAuthSession(req).auth = toSessionUser(user);
  req.session.save((error) => {
    if (error) {
      sendFailureResponse(res, 'Unable to create session', 500);
      return;
    }

    res.status(200).json(buildSessionResponse(req));
  });
}

export async function logout(req: Request, res: Response): Promise<void> {
  req.session.destroy((error) => {
    if (error) {
      sendFailureResponse(res, 'Unable to logout', 500);
      return;
    }

    res.clearCookie('cms-cookbook.sid');
    sendCompletedResponse(res);
  });
}

export async function getSession(req: Request, res: Response): Promise<void> {
  res.status(200).json(buildSessionResponse(req));
}

export async function listUsers(req: Request, res: Response): Promise<void> {
  log.info_lv2(`${DEBUG}listUsers`);
  res.status(200).json(getUsers());
}

export async function createUserHandler(req: Request, res: Response): Promise<void> {
  if (handleValidationFailure(req, res)) {
    return;
  }

  try {
    const user = await createUser({
      firstName: `${req.body['firstName']}`.trim(),
      surname: `${req.body['surname']}`.trim(),
      username: `${req.body['username']}`.trim(),
      email: `${req.body['email']}`.trim(),
      password: `${req.body['password']}`,
      permissions: parsePermissions(req.body['permissions']),
      isActive: Boolean(req.body['isActive']),
    });

    res.status(201).json(user);
  } catch (error) {
    sendFailureResponse(res, (error as Error).message, 400);
  }
}

export async function updateUserHandler(req: Request, res: Response): Promise<void> {
  if (handleValidationFailure(req, res)) {
    return;
  }

  const userId = routeParamInt(req.params['id']);
  if (Number.isNaN(userId)) {
    sendFailureResponse(res, 'User ID missing or invalid', 400);
    return;
  }

  try {
    const updatedUser = await updateUser(userId, {
      firstName: `${req.body['firstName']}`.trim(),
      surname: `${req.body['surname']}`.trim(),
      username: `${req.body['username']}`.trim(),
      email: `${req.body['email']}`.trim(),
      password: req.body['password'] ? `${req.body['password']}` : undefined,
      permissions: parsePermissions(req.body['permissions']),
      isActive: Boolean(req.body['isActive']),
    });

    if (!updatedUser) {
      sendFailureResponse(res, 'User not found', 404);
      return;
    }

    if (getAuthSession(req).auth?.userId === updatedUser.id) {
      getAuthSession(req).auth = toSessionUser(findUserById(updatedUser.id));
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    sendFailureResponse(res, (error as Error).message, 400);
  }
}

export async function deleteUserHandler(req: Request, res: Response): Promise<void> {
  const userId = routeParamInt(req.params['id']);
  if (Number.isNaN(userId)) {
    sendFailureResponse(res, 'User ID missing or invalid', 400);
    return;
  }

  if (getAuthSession(req).auth?.userId === userId) {
    sendFailureResponse(res, 'Cannot delete the current session user', 400);
    return;
  }

  const deleted = deleteUser(userId);
  if (!deleted) {
    sendFailureResponse(res, 'User not found', 404);
    return;
  }

  sendCompletedResponse(res);
}

export async function requestPasswordReset(req: Request, res: Response): Promise<void> {
  if (handleValidationFailure(req, res)) {
    return;
  }

  const loginValue = `${req.body['login']}`.trim();
  const reset = await createPasswordResetToken(loginValue);
  const isProduction = process.env['NODE_ENV'] === 'production';

  res.status(200).json({
    completed: true,
    message: 'If the account exists, a password reset token has been created.',
    resetToken: !isProduction && reset ? reset.resetToken : undefined,
  });
}

export async function completePasswordReset(req: Request, res: Response): Promise<void> {
  if (handleValidationFailure(req, res)) {
    return;
  }

  const token = `${req.body['token']}`.trim();
  const password = `${req.body['password']}`;
  const reset = await resetUserPassword(token, password);
  if (!reset) {
    sendFailureResponse(res, 'Reset token is invalid or expired', 400);
    return;
  }

  sendCompletedResponse(res);
}
