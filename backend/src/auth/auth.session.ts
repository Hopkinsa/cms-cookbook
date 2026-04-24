import session, { type SessionData, type Store } from 'express-session';

import DBService from '../services/db.service.ts';
import { log } from '../utility/helpers.ts';
import { DEFAULT_FRONTEND_ORIGIN, DEFAULT_SESSION_SECRET, SESSION_COOKIE_NAME } from './auth.constants.ts';

const DEBUG = 'auth.session | ';
const SESSIONS_TABLE = `
CREATE TABLE IF NOT EXISTS sessions (
    sid TEXT PRIMARY KEY,
    sess TEXT NOT NULL,
    expire INTEGER NOT NULL
);
`;

class SQLiteSessionStore extends session.Store {
  private activeDatabase: object | null = null;

  private ensureTable(): void {
    if (!DBService.db) {
      return;
    }

    if (this.activeDatabase === DBService.db) {
      return;
    }

    DBService.db.prepare(SESSIONS_TABLE).run();
    this.activeDatabase = DBService.db;
  }

  private getExpiryMs(sessionData: SessionData): number {
    const expires = sessionData.cookie?.expires;
    if (expires instanceof Date) {
      return expires.getTime();
    }

    const maxAge = typeof sessionData.cookie?.maxAge === 'number' ? sessionData.cookie.maxAge : 1000 * 60 * 60 * 8;
    return Date.now() + maxAge;
  }

  override get(sid: string, callback: (err?: unknown, sessionData?: SessionData | null) => void): void {
    try {
      this.ensureTable();
      const row = DBService.db.prepare('SELECT sess, expire FROM sessions WHERE sid = ?').get(sid) as { sess: string; expire: number } | undefined;
      if (!row) {
        callback(undefined, null);
        return;
      }

      if (row.expire <= Date.now()) {
        DBService.db.prepare('DELETE FROM sessions WHERE sid = ?').run(sid);
        callback(undefined, null);
        return;
      }

      callback(undefined, JSON.parse(row.sess) as SessionData);
    } catch (error) {
      callback(error);
    }
  }

  override set(sid: string, sessionData: SessionData, callback?: (err?: unknown) => void): void {
    try {
      this.ensureTable();
      const expiry = this.getExpiryMs(sessionData);
      DBService.db.prepare('DELETE FROM sessions WHERE expire <= ?').run(Date.now());
      DBService.db.prepare('INSERT OR REPLACE INTO sessions (sid, sess, expire) VALUES (?, ?, ?)').run(
        sid,
        JSON.stringify(sessionData),
        expiry,
      );
      callback?.();
    } catch (error) {
      callback?.(error);
    }
  }

  override destroy(sid: string, callback?: (err?: unknown) => void): void {
    try {
      this.ensureTable();
      DBService.db.prepare('DELETE FROM sessions WHERE sid = ?').run(sid);
      callback?.();
    } catch (error) {
      callback?.(error);
    }
  }

  override touch(sid: string, sessionData: SessionData, callback?: () => void): void {
    this.set(sid, sessionData, () => callback?.());
  }
}

const sessionStore: Store = new SQLiteSessionStore();

function getSessionSecret(): string {
  const secret = process.env['SESSION_SECRET'];
  if (secret) {
    return secret;
  }

  log.info_lv1(`${DEBUG}SESSION_SECRET is not set. Falling back to a development-only default secret.`);
  return DEFAULT_SESSION_SECRET;
}

export function createSessionMiddleware() {
  const isProduction = process.env['NODE_ENV'] === 'production';

  return session({
    name: SESSION_COOKIE_NAME,
    secret: getSessionSecret(),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 8,
    },
  });
}

export function getAllowedOrigin(): string {
  return process.env['FRONTEND_ORIGIN'] ?? DEFAULT_FRONTEND_ORIGIN;
}
