jest.mock('../shared/write-handler.ts', () => ({
  handleValidationFailure: jest.fn(),
  sendCompletedResponse: jest.fn(),
  sendFailureResponse: jest.fn(),
}));

jest.mock('../../auth/auth.middleware.ts', () => ({
  buildSessionResponse: jest.fn((req: any) => ({
    authenticated: Boolean(req.session.auth),
    user: req.session.auth ?? null,
  })),
  getAuthSession: jest.fn((req: any) => req.session),
}));

jest.mock('../../auth/auth.repository.ts', () => ({
  findUserByLogin: jest.fn(),
  createPasswordResetToken: jest.fn(),
  getUsers: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  findUserById: jest.fn(),
  resetUserPassword: jest.fn(),
}));

jest.mock('../../auth/auth.password.ts', () => ({
  verifyPassword: jest.fn(),
}));

jest.mock('../../utility/helpers.ts', () => {
  const actual = jest.requireActual('../../utility/helpers.ts');
  return {
    ...actual,
    log: {
      info_lv2: jest.fn(),
    },
  };
});

import type { Request, Response } from 'express';

import { login, logout, getSession, listUsers, createUserHandler, updateUserHandler, deleteUserHandler, requestPasswordReset, completePasswordReset } from './auth.ts';
import { handleValidationFailure, sendCompletedResponse, sendFailureResponse } from '../shared/write-handler.ts';
import { buildSessionResponse } from '../../auth/auth.middleware.ts';
import { findUserByLogin, createPasswordResetToken, getUsers, createUser, updateUser, deleteUser, findUserById, resetUserPassword } from '../../auth/auth.repository.ts';
import { verifyPassword } from '../../auth/auth.password.ts';

function createRequest(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
    params: {},
    session: {
      save: (callback: (error?: Error) => void) => callback(),
    },
    ...overrides,
  } as Request;
}

function createResponse(): Response {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
  } as unknown as Response;
}

describe('auth handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env['NODE_ENV'];
    (handleValidationFailure as jest.Mock).mockReturnValue(false);
  });

  it('rejects login when validation fails', async () => {
    const req = createRequest();
    const res = createResponse();
    (handleValidationFailure as jest.Mock).mockReturnValue(true);

    await login(req, res);

    expect(findUserByLogin).not.toHaveBeenCalled();
  });

  it('rejects login for missing or invalid credentials', async () => {
    const req = createRequest({ body: { login: ' admin ', password: 'secret' } });
    const res = createResponse();

    (findUserByLogin as jest.Mock).mockReturnValueOnce(null);
    await login(req, res);
    expect(findUserByLogin).toHaveBeenCalledWith('admin');
    expect(sendFailureResponse).toHaveBeenCalledWith(res, 'Invalid credentials', 401);

    (findUserByLogin as jest.Mock).mockReturnValueOnce({ isActive: false });
    await login(req, res);
    expect(sendFailureResponse).toHaveBeenCalledWith(res, 'Invalid credentials', 401);

    (findUserByLogin as jest.Mock).mockReturnValueOnce({ isActive: true, passwordHash: 'hash' });
    (verifyPassword as jest.Mock).mockResolvedValueOnce(false);
    await login(req, res);
    expect(verifyPassword).toHaveBeenCalledWith('secret', 'hash');
    expect(sendFailureResponse).toHaveBeenCalledWith(res, 'Invalid credentials', 401);
  });

  it('creates a session on successful login', async () => {
    const save = jest.fn((callback: (error?: Error) => void) => callback());
    const req = createRequest({ body: { login: 'admin', password: 'secret' }, session: { save } as any });
    const res = createResponse();
    const user = {
      id: 1,
      firstName: 'Admin',
      surname: 'User',
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: 'hash',
      isActive: true,
      permissions: ['user.read'],
    };
    (findUserByLogin as jest.Mock).mockReturnValue(user);
    (verifyPassword as jest.Mock).mockResolvedValue(true);

    await login(req, res);

    expect((req.session as any).auth).toEqual({
      userId: 1,
      firstName: 'Admin',
      surname: 'User',
      username: 'admin',
      email: 'admin@example.com',
      permissions: ['user.read'],
    });
    expect(save).toHaveBeenCalledTimes(1);
    expect(buildSessionResponse).toHaveBeenCalledWith(req);
    expect((res.status as jest.Mock)).toHaveBeenCalledWith(200);
    expect((res.json as jest.Mock)).toHaveBeenCalledWith({ authenticated: true, user: (req.session as any).auth });
  });

  it('reports a session save failure after successful authentication', async () => {
    const req = createRequest({
      body: { login: 'admin', password: 'secret' },
      session: {
        save: (callback: (error?: Error) => void) => callback(new Error('save failed')),
      } as any,
    });
    const res = createResponse();
    const user = {
      id: 1,
      firstName: 'Admin',
      surname: 'User',
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: 'hash',
      isActive: true,
      permissions: ['user.read'],
    };
    (findUserByLogin as jest.Mock).mockReturnValue(user);
    (verifyPassword as jest.Mock).mockResolvedValue(true);

    await login(req, res);

    expect(sendFailureResponse).toHaveBeenCalledWith(res, 'Unable to create session', 500);
    expect(res.status).not.toHaveBeenCalledWith(200);
  });

  it('handles logout success and failure', async () => {
    const res = createResponse();
    const failureReq = createRequest({
      session: {
        destroy: (callback: (error?: Error) => void) => callback(new Error('nope')),
      } as any,
    });

    await logout(failureReq, res);
    expect(sendFailureResponse).toHaveBeenCalledWith(res, 'Unable to logout', 500);

    const successReq = createRequest({
      session: {
        destroy: (callback: (error?: Error) => void) => callback(),
      } as any,
    });

    await logout(successReq, res);
    expect((res.clearCookie as jest.Mock)).toHaveBeenCalledWith('cms-cookbook.sid');
    expect(sendCompletedResponse).toHaveBeenCalledWith(res);
  });

  it('returns the current session and user list', async () => {
    const req = createRequest({ session: { auth: { userId: 1 } } as any });
    const res = createResponse();
    (getUsers as jest.Mock).mockReturnValue([{ id: 1, username: 'admin' }]);

    await getSession(req, res);
    expect((res.status as jest.Mock)).toHaveBeenCalledWith(200);
    expect((res.json as jest.Mock)).toHaveBeenCalledWith({ authenticated: true, user: { userId: 1 } });

    (res.status as jest.Mock).mockClear();
    (res.json as jest.Mock).mockClear();
    await listUsers(req, res);
    expect((res.status as jest.Mock)).toHaveBeenCalledWith(200);
    expect((res.json as jest.Mock)).toHaveBeenCalledWith([{ id: 1, username: 'admin' }]);
  });

  it('creates users and reports repository failures', async () => {
    const req = createRequest({
      body: {
        firstName: ' Admin ',
        surname: ' User ',
        username: ' admin ',
        email: ' admin@example.com ',
        password: 'secret',
        permissions: ['user.read'],
        isActive: 1,
      },
    });
    const res = createResponse();
    const createdUser = { id: 1, username: 'admin' };
    (createUser as jest.Mock).mockResolvedValueOnce(createdUser);

    await createUserHandler(req, res);
    expect(createUser).toHaveBeenCalledWith({
      firstName: 'Admin',
      surname: 'User',
      username: 'admin',
      email: 'admin@example.com',
      password: 'secret',
      permissions: ['user.read'],
      isActive: true,
    });
    expect((res.status as jest.Mock)).toHaveBeenCalledWith(201);
    expect((res.json as jest.Mock)).toHaveBeenCalledWith(createdUser);

    (createUser as jest.Mock).mockRejectedValueOnce(new Error('duplicate'));
    await createUserHandler(req, res);
    expect(sendFailureResponse).toHaveBeenCalledWith(res, 'duplicate', 400);
  });

  it('updates users across invalid id, not found, self-session refresh, and repository failure', async () => {
    const res = createResponse();
    const invalidReq = createRequest({ params: { id: 'abc' } as any });
    await updateUserHandler(invalidReq, res);
    expect(sendFailureResponse).toHaveBeenCalledWith(res, 'User ID missing or invalid', 400);

    const req = createRequest({
      params: { id: '2' } as any,
      session: { auth: { userId: 2 } } as any,
      body: {
        firstName: ' Editor ',
        surname: ' User ',
        username: ' editor ',
        email: ' editor@example.com ',
        password: 'secret',
        permissions: ['user.update'],
        isActive: true,
      },
    });

    (updateUser as jest.Mock).mockResolvedValueOnce(null);
    await updateUserHandler(req, res);
    expect(sendFailureResponse).toHaveBeenCalledWith(res, 'User not found', 404);

    const updatedUser = {
      id: 2,
      firstName: 'Editor',
      surname: 'User',
      username: 'editor',
      email: 'editor@example.com',
      permissions: ['user.update'],
    };
    (updateUser as jest.Mock).mockResolvedValueOnce(updatedUser);
    (findUserById as jest.Mock).mockReturnValueOnce({
      ...updatedUser,
      isActive: true,
      createdAt: 1,
      updatedAt: 2,
      passwordHash: 'hash',
    });

    await updateUserHandler(req, res);
    expect((req.session as any).auth).toEqual({
      userId: 2,
      firstName: 'Editor',
      surname: 'User',
      username: 'editor',
      email: 'editor@example.com',
      permissions: ['user.update'],
    });
    expect((res.status as jest.Mock)).toHaveBeenCalledWith(200);
    expect((res.json as jest.Mock)).toHaveBeenCalledWith(updatedUser);

    (updateUser as jest.Mock).mockRejectedValueOnce(new Error('bad update'));
    await updateUserHandler(req, res);
    expect(sendFailureResponse).toHaveBeenCalledWith(res, 'bad update', 400);
  });

  it('deletes users across invalid, self-delete, not found, and success paths', async () => {
    const res = createResponse();

    await deleteUserHandler(createRequest({ params: { id: 'abc' } as any }), res);
    expect(sendFailureResponse).toHaveBeenCalledWith(res, 'User ID missing or invalid', 400);

    await deleteUserHandler(createRequest({ params: { id: '2' } as any, session: { auth: { userId: 2 } } as any }), res);
    expect(sendFailureResponse).toHaveBeenCalledWith(res, 'Cannot delete the current session user', 400);

    (deleteUser as jest.Mock).mockReturnValueOnce(false);
    await deleteUserHandler(createRequest({ params: { id: '3' } as any, session: { auth: { userId: 2 } } as any }), res);
    expect(sendFailureResponse).toHaveBeenCalledWith(res, 'User not found', 404);

    (deleteUser as jest.Mock).mockReturnValueOnce(true);
    await deleteUserHandler(createRequest({ params: { id: '4' } as any, session: { auth: { userId: 2 } } as any }), res);
    expect(sendCompletedResponse).toHaveBeenCalledWith(res);
  });

  it('creates password reset responses for development and production', async () => {
    const req = createRequest({ body: { login: ' admin ' } });
    const res = createResponse();
    (createPasswordResetToken as jest.Mock).mockResolvedValue({ resetToken: 'token-123' });

    await requestPasswordReset(req, res);
    expect((res.status as jest.Mock)).toHaveBeenCalledWith(200);
    expect((res.json as jest.Mock)).toHaveBeenCalledWith({
      completed: true,
      message: 'If the account exists, a password reset token has been created.',
      resetToken: 'token-123',
    });

    process.env['NODE_ENV'] = 'production';
    await requestPasswordReset(req, res);
    expect((res.json as jest.Mock)).toHaveBeenLastCalledWith({
      completed: true,
      message: 'If the account exists, a password reset token has been created.',
      resetToken: undefined,
    });
  });

  it('completes password reset or rejects invalid tokens', async () => {
    const req = createRequest({ body: { token: ' reset ', password: 'secret' } });
    const res = createResponse();

    (resetUserPassword as jest.Mock).mockResolvedValueOnce(false);
    await completePasswordReset(req, res);
    expect(resetUserPassword).toHaveBeenCalledWith('reset', 'secret');
    expect(sendFailureResponse).toHaveBeenCalledWith(res, 'Reset token is invalid or expired', 400);

    (resetUserPassword as jest.Mock).mockResolvedValueOnce(true);
    await completePasswordReset(req, res);
    expect(sendCompletedResponse).toHaveBeenCalledWith(res);
  });
});
