import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { getEffectiveTracks } from '@/lib/content-resolver';
import AdminClient from './AdminClient';

export const metadata: Metadata = { title: 'Admin | NESR AI Verse' };
// Content can be edited at any time, and this page must never be cached —
// not linked from anywhere in the nav, reachable only by typing the URL.
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) notFound();

  const tracks = await getEffectiveTracks();
  return <AdminClient initialTracks={tracks} />;
}
