import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}

/** Session + admin-email check shared by every admin-gated server action. Throws if not an admin. */
export async function requireAdmin(): Promise<string> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!isAdminEmail(email)) throw new Error('Admins only');
  return email as string;
}
