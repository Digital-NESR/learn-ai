import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import aiversePool from '@/lib/db-aiverse';

export const runtime = 'nodejs';

const CONTENT_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

// Outside middleware.ts's matcher like the other /api routes, so this checks
// its own session — an admin, or a member of the team that owns the submission.
export async function GET(_req: Request, { params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params;

  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!email) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { rows } = await aiversePool.query(
    `select f.file_name, f.file_type, f.file_data, s.team_id
     from hackathon_submission_files f
     join hackathon_submissions s on s.id = f.submission_id
     where f.id = $1`,
    [fileId],
  );
  if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const file = rows[0];

  if (!isAdminEmail(email)) {
    const { rows: memberRows } = await aiversePool.query(
      `select 1 from hackathon_team_members where team_id = $1 and email = $2`,
      [file.team_id, email],
    );
    if (!memberRows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return new NextResponse(file.file_data, {
    status: 200,
    headers: {
      'Content-Type': CONTENT_TYPES[file.file_type] ?? 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${file.file_name.replace(/"/g, '')}"`,
    },
  });
}
