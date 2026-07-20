import type { Module, ModuleRequirement } from '../app/content';

/** At least this fraction of the "half" bucket must be completed. */
export const HALF_BUCKET_FRACTION = 0.5;
/** At least this many of the "optional" bucket must be completed (capped at the bucket's size). */
export const OPTIONAL_BUCKET_MIN = 2;

export interface RequirementBucket {
  total: number;
  done: number;
  /** how many completions in this bucket are needed for the certificate */
  needed: number;
  met: boolean;
}

export interface CertificateStatus {
  required: RequirementBucket;
  half: RequirementBucket;
  optional: RequirementBucket;
  /** true once every bucket's threshold is met */
  earned: boolean;
}

function bucket(total: number, done: number, needed: number): RequirementBucket {
  return { total, done, needed, met: done >= needed };
}

/**
 * Certificate rule: every "required" module, at least half of the "half"
 * bucket, and a small fixed number of the "optional" bucket (see
 * src/app/content.ts for what each module is tagged). Pure function so the
 * server action (the actual gate) and the UI (progress display) always agree.
 */
export function computeCertificateStatus(
  modules: Pick<Module, 'id' | 'requirement'>[],
  completedIds: ReadonlySet<string>,
): CertificateStatus {
  const byTier: Record<ModuleRequirement, Pick<Module, 'id' | 'requirement'>[]> = {
    required: [],
    half: [],
    optional: [],
  };
  for (const m of modules) byTier[m.requirement ?? 'required'].push(m);

  const doneCount = (list: Pick<Module, 'id'>[]) => list.filter(m => completedIds.has(m.id)).length;

  const required = bucket(byTier.required.length, doneCount(byTier.required), byTier.required.length);
  const half = bucket(
    byTier.half.length,
    doneCount(byTier.half),
    Math.ceil(byTier.half.length * HALF_BUCKET_FRACTION),
  );
  const optional = bucket(
    byTier.optional.length,
    doneCount(byTier.optional),
    Math.min(OPTIONAL_BUCKET_MIN, byTier.optional.length),
  );

  return {
    required,
    half,
    optional,
    earned: required.total > 0 && required.met && half.met && optional.met,
  };
}
