import { Pool } from 'pg';

const aiversePool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.AIVERSE_DB_NAME || 'aiverse_db',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

aiversePool.on('error', (err) => console.error('[aiversePool] unexpected error:', err));

export default aiversePool;
