import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALL_MODULES, findModule, nextModule } from '../content';
import ModuleClient from './ModuleClient';

export function generateStaticParams() {
  return ALL_MODULES.map(({ module }) => ({ moduleId: module.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}): Promise<Metadata> {
  const { moduleId } = await params;
  const found = findModule(moduleId);
  return { title: found ? `${found.module.title} | NESR AI Learning` : 'NESR AI Learning' };
}

export default async function AiLearningModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const found = findModule(moduleId);
  if (!found) notFound();

  const next = nextModule(moduleId);

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
