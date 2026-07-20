'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import aiversePool from '@/lib/db-aiverse';
import { getEffectiveAllModules } from '@/lib/content-resolver';
import { computeCertificateStatus, type CertificateStatus } from '@/lib/certificate';

export interface ModuleResult {
  score: number;
  total: number;
  completedAt: string;
}
export type ProgressMap = Record<string, ModuleResult>;

async function requireUser() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  const name = session?.user?.name;
  if (!email || !name) throw new Error('Not signed in');
  await aiversePool.query(
    `insert into users (email, name) values ($1, $2)
     on conflict (email) do update set name = excluded.name, last_seen_at = now()`,
    [email, name],
  );
  return { email, name };
}

export async function getMyProgress(): Promise<ProgressMap> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!email) return {};
  const { rows } = await aiversePool.query(
    `select module_id, score, total, completed_at from module_progress where user_email = $1`,
    [email],
  );
  const map: ProgressMap = {};
  for (const row of rows) {
    map[row.module_id] = {
      score: row.score,
      total: row.total,
      completedAt: row.completed_at.toISOString(),
    };
  }
  return map;
}

export async function recordModuleResult(
  moduleId: string,
  score: number,
  total: number,
): Promise<{ certificateEarned: boolean }> {
  const { email, name } = await requireUser();
  const completedAt = new Date().toISOString();

  const existing = await aiversePool.query(
    `select score from module_progress where user_email = $1 and module_id = $2`,
    [email, moduleId],
  );
  const keepBestScore = existing.rowCount && existing.rows[0].score >= score;

  await aiversePool.query(
    `insert into module_progress (user_email, module_id, score, total, completed_at)
     values ($1, $2, $3, $4, $5)
     on conflict (user_email, module_id) do update
       set score = case when $6 then module_progress.score else excluded.score end,
           total = case when $6 then module_progress.total else excluded.total end,
           completed_at = excluded.completed_at,
           updated_at = now()`,
    [email, moduleId, score, total, completedAt, keepBestScore],
  );

  const effectiveModules = await getEffectiveAllModules();
  const { rows: completedRows } = await aiversePool.query(
    `select module_id from module_progress where user_email = $1`,
    [email],
  );
  const completedIds = new Set(completedRows.map(r => r.module_id));
  const status = computeCertificateStatus(effectiveModules.map(m => m.module), completedIds);

  let certificateEarned = false;
  if (status.earned) {
    const res = await aiversePool.query(
      `insert into certificates (user_email, recipient_name) values ($1, $2)
       on conflict (user_email) do nothing`,
      [email, name],
    );
    certificateEarned = (res.rowCount ?? 0) > 0;
  }

  return { certificateEarned };
}

/** Per-tier completion status against the certificate rule, for progress UI. */
export async function getMyCertificateStatus(): Promise<CertificateStatus> {
  const effectiveModules = await getEffectiveAllModules();
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!email) return computeCertificateStatus(effectiveModules.map(m => m.module), new Set());

  const { rows } = await aiversePool.query(
    `select module_id from module_progress where user_email = $1`,
    [email],
  );
  const completedIds = new Set(rows.map(r => r.module_id));
  return computeCertificateStatus(effectiveModules.map(m => m.module), completedIds);
}

export async function getMyCertificate(): Promise<{ recipientName: string; issuedAt: string } | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!email) return null;
  const { rows } = await aiversePool.query(
    `select recipient_name, issued_at from certificates where user_email = $1`,
    [email],
  );
  if (!rows.length) return null;
  return { recipientName: rows[0].recipient_name, issuedAt: rows[0].issued_at.toISOString() };
}
