import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import aiversePool from '@/lib/db-aiverse';

export const runtime = 'nodejs';

/** Wraps a field in quotes and escapes embedded quotes if it contains a comma, quote, or newline. */
function csvField(value: unknown): string {
  const s = value === null || value === undefined ? '' : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toRow(fields: unknown[]): string {
  return fields.map(csvField).join(',') + '\r\n';
}

// This route sits outside middleware.ts's matcher (see src/middleware.ts), so it
// checks the admin session itself rather than relying on the site-wide gate.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: 'Admins only' }, { status: 403 });
  }

  const { rows } = await aiversePool.query(
    `select
       t.name as team_name, t.status as team_status, t.created_by_email,
       m.display_name, m.email, m.department, m.job_title, m.joined_at
     from hackathon_teams t
     join hackathon_team_members m on m.team_id = t.id
     order by t.name, m.joined_at`,
  );

  let csv = toRow(['Team', 'Team Status', 'Creator Email', 'Member Name', 'Member Email', 'Department', 'Job Title', 'Joined At']);
  for (const r of rows) {
    csv += toRow([
      r.team_name,
      r.team_status,
      r.created_by_email,
      r.display_name,
      r.email,
      r.department ?? '',
      r.job_title ?? '',
      r.joined_at.toISOString(),
    ]);
  }

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="hackathon-participants.csv"',
    },
  });
}
