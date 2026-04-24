import 'express-session';

declare module 'express-session' {
  interface SessionData {
    auth?: {
      userId: number;
      firstName: string;
      surname: string;
      username: string;
      email: string;
      permissions: string[];
    };
  }
}
