import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;

export const sql = postgres(connectionString, {
  ssl: false,
  idle_timeout: 30,
  max_lifetime: 30 * 60,
});
