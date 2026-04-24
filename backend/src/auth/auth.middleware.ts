import { NextFunction, Request, Response } from 'express';

import { type PermissionCode, type SessionUser } from './auth.types.ts';

export type AuthenticatedSession = Request['session'] & { auth?: SessionUser };

export function getAuthSession(req: Request): AuthenticatedSession {
  return req.session as AuthenticatedSession;
}

function getSessionUser(req: Request): SessionUser | null {
  return getAuthSession(req).auth ?? null;
}

export function requireAuthenticated(req: Request, res: Response, next: NextFunction): void {
  if (!getSessionUser(req)) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  next();
}

export function requirePermission(permission: PermissionCode) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!sessionUser.permissions.includes(permission)) {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    next();
  };
}

export function buildSessionResponse(req: Request): { authenticated: boolean; user: SessionUser | null } {
  const sessionUser = getSessionUser(req);
  return {
    authenticated: sessionUser !== null,
    user: sessionUser,
  };
}
