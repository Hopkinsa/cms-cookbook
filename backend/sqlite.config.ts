import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

export class SQLite {
  private static db: Database;

  static get instance(): Database {
    if (!SQLite.db) {
      SQLite.setup();
    }
    return SQLite.db;
  }

  static async setup(): Promise<void> {
    SQLite.db = await open({
      filename: ':memory:',
      driver: sqlite3.Database,
    });
  }

  static destroy(): void {
    SQLite.db.close();
  }
}
