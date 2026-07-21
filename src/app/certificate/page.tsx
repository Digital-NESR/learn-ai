import type { Metadata } from 'next';
import AiLearningHeader from '../components/AiLearningHeader';
import { getEffectiveTracks } from '@/lib/content-resolver';
import { getMyProgress, getMyEarnedCertificates, getMyCertificateStatus } from '../actions/progress';
import { ACHIEVEMENT_IDS, computeEarnedAchievements, type AchievementId } from '@/lib/achievements';
import { ACHIEVEMENT_CERT_META } from '@/lib/achievement-certificates';
import TrophyHallClient, { type TrophyTile } from './TrophyHallClient';

export const metadata: Metadata = { title: 'The Trophy Hall | NESR AI Verse' };
export const dynamic = 'force-dynamic';

/** Which achievements gate one another, in order — used to pick the single
 * "up next" tile per chain, and to explain why a locked tile is locked. */
const TRACK_CHAINS: AchievementId[][] = [
  ['general-beginner', 'general-intermediate', 'general-advanced'],
  ['technical-beginner', 'technical-intermediate', 'technical-advanced'],
  ['productivity'],
];

const TILE_META: Record<AchievementId, { group: string; title: string }> = {
  'general-beginner': { group: 'GENERAL TRACK', title: 'Beginner Cleared' },
  'technical-beginner': { group: 'TECHNICAL TRACK', title: 'Beginner Cleared' },
  productivity: { group: 'PRODUCTIVITY', title: 'Productivity Track' },
  'general-intermediate': { group: 'GENERAL TRACK', title: 'Intermediate Cleared' },
  'technical-intermediate': { group: 'TECHNICAL TRACK', title: 'Intermediate Cleared' },
  'general-advanced': { group: 'GENERAL TRACK', title: 'Advanced Cleared' },
  'technical-advanced': { group: 'TECHNICAL TRACK', title: 'Advanced Cleared' },
  'general-realm': { group: 'REALM', title: 'General Realm' },
  'technical-realm': { group: 'REALM', title: 'Technical Realm' },
  certified: { group: 'CERTIFICATION', title: 'Certified' },
  'dungeon-master': { group: 'FINAL HONOUR', title: 'Dungeon Master' },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function TrophyHallPage() {
  const [tracks, progress, earned, status] = await Promise.all([
    getEffectiveTracks(),
    getMyProgress(),
    getMyEarnedCertificates(),
    getMyCertificateStatus(),
  ]);

  const completedIds = new Set(Object.keys(progress));
  const earnedByAchievement = new Map(earned.map(c => [c.achievementId, c] as const));
  const results = computeEarnedAchievements(tracks, completedIds, status.earned);
  const earnedIds = new Set(results.filter(a => a.earned).map(a => a.id));

  // The first not-yet-earned id in each chain is the one worth highlighting.
  const nextIds = new Set<AchievementId>();
  for (const chain of TRACK_CHAINS) {
    for (const id of chain) {
      if (!earnedIds.has(id)) {
        nextIds.add(id);
        break;
      }
    }
  }

  function requirementFor(id: AchievementId): string {
    const track = tracks.find(t => t.id === id);
    if (track) {
      if (nextIds.has(id)) {
        const remaining = track.modules.length - track.modules.filter(m => completedIds.has(m.id)).length;
        return `Finish the remaining ${remaining} part${remaining === 1 ? '' : 's'} of ${track.title} to claim this tier.`;
      }
      const chain = TRACK_CHAINS.find(c => c.includes(id))!;
      const prevId = chain[chain.indexOf(id) - 1];
      return `Clear the ${ACHIEVEMENT_CERT_META[prevId].tierName} tier first.`;
    }
    if (id === 'general-realm') return 'Earn all three General Track tiers to conquer the realm.';
    if (id === 'technical-realm') return 'Earn all three Technical Track tiers to conquer the realm.';
    if (id === 'certified') {
      return `Complete every Required part, at least half of Important, and ${status.optional.needed} of Specialized to get certified.`;
    }
    return 'Earn every one of the ten honours above to attain 100% completion of the NESR AI Verse — the highest rank we bestow.';
  }

  function buildTile(id: AchievementId): TrophyTile {
    const meta = ACHIEVEMENT_CERT_META[id];
    const cert = earnedByAchievement.get(id);
    const isEarned = earnedIds.has(id);
    return {
      id,
      group: TILE_META[id].group,
      title: TILE_META[id].title,
      tier: meta.tier,
      tierName: meta.tierName,
      description: meta.description,
      earned: isEarned,
      next: !isEarned && nextIds.has(id),
      date: cert ? formatDate(cert.issuedAt) : undefined,
      issuedAt: cert?.issuedAt,
      requirement: isEarned ? undefined : requirementFor(id),
    };
  }

  const tileIds = ACHIEVEMENT_IDS.filter(id => id !== 'dungeon-master');
  const tiles = tileIds.map(buildTile);
  const master = buildTile('dungeon-master');
  const recipientName = earned[0]?.recipientName ?? '';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <AiLearningHeader />
      <main className="flex-1">
        <TrophyHallClient
          tiles={tiles}
          master={master}
          earnedCount={earnedIds.size}
          total={ACHIEVEMENT_IDS.length}
          recipientName={recipientName}
        />
      </main>
    </div>
  );
}
