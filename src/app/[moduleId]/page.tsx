import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEffectiveModule, getEffectiveNextModule } from '@/lib/content-resolver';
import ModuleClient from './ModuleClient';

// Course content (including which module ids exist) can change at any time
// via /admin, so this route can't be statically prebuilt - always render
// on demand against the current effective content.
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}): Promise<Metadata> {
  const { moduleId } = await params;
  const found = await getEffectiveModule(moduleId);
  return { title: found ? `${found.module.title} | NESR AI Verse` : 'NESR AI Verse' };
}

export default async function AiLearningModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const found = await getEffectiveModule(moduleId);
  if (!found) notFound();

  const next = await getEffectiveNextModule(moduleId);

  return (
    <ModuleClient
      module={found.module}
      track={found.track}
      next={
        next
          ? { id: next.module.id, title: next.module.title, trackTitle: next.track.title }
          : null
      }
    />
  );
}
