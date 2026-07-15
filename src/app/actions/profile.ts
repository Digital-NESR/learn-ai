'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import employeeDirectoryPool from '@/lib/db-employee-directory';

export interface MyProfile {
  name: string;
  email: string;
  jobTitle: string | null;
}

export async function getMyProfile(): Promise<MyProfile | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  const name = session?.user?.name;
  if (!email || !name) return null;

  const { rows } = await employeeDirectoryPool.query(
    `select job_title from azure_ad_users_staging where mail ilike $1 limit 1`,
    [email],
  );

  return { name, email, jobTitle: rows[0]?.job_title ?? null };
}
