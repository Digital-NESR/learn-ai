import { Pool } from 'pg';

/**
 * Read-only lookup against the shared employee directory (azure_ad_users_staging,
 * fed from Entra by another team's sync job). Never write to this database.
 */
const employeeDirectoryPool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.EMPLOYEE_DIRECTORY_DB_NAME || 'azure_emp_directory',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

employeeDirectoryPool.on('error', (err) =>
  console.error('[employeeDirectoryPool] unexpected error:', err),
);

export default employeeDirectoryPool;
