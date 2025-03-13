import { PostgresJsAdapter } from '@lucia-auth/adapter-postgresql';
import { Lucia } from 'lucia';
import { sql } from './db';

const adapter = new PostgresJsAdapter(sql, {
  user: 'employees',
  session: 'user_session',
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      username: attributes.username,
      profile_picture: attributes.profile_picture,
      role: attributes.role,
    };
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  username: string;
  profile_picture: string;
  role:
    | 'administrator'
    | 'frontdesk'
    | 'house_keeping_manager'
    | 'house_keeping';
}
