import type { AchievementId } from './achievements';

/** Copied verbatim from the "NESR AI Certificates" Claude Design project
 * (Certificate.dc.html / NESR AI Certificates.dc.html) — do not restyle
 * without updating the design project too. */
export type CertTier = 'bronze' | 'silver' | 'gold' | 'realm' | 'certified' | 'master';

export interface TierStyle {
  ringGrad: string;
  medalBg: string;
  ribbonBg: string;
  ribbonText: string;
  accent: string;
  pips: string;
  /** An extra inner gold hairline border, used for the two highest tiers. */
  regal: boolean;
}

export const TIER_STYLE: Record<CertTier, TierStyle> = {
  bronze: {
    ringGrad: 'conic-gradient(#EBC38C,#C6863F,#8a5522,#EBC38C,#C6863F)',
    ribbonBg: '#E6B57C',
    ribbonText: '#20302a',
    accent: '#B0702F',
    medalBg: 'radial-gradient(circle at 50% 40%,#0e7a5f,#08402F)',
    pips: '★',
    regal: false,
  },
  silver: {
    ringGrad: 'conic-gradient(#F1F4F8,#C3CBD5,#8A94A0,#F1F4F8,#C3CBD5)',
    ribbonBg: '#D6DCE3',
    ribbonText: '#20302a',
    accent: '#79838F',
    medalBg: 'radial-gradient(circle at 50% 40%,#0e7a5f,#08402F)',
    pips: '★ ★',
    regal: false,
  },
  gold: {
    ringGrad: 'conic-gradient(#EAD08A,#B8912E,#8a6a1e,#EAD08A,#B8912E)',
    ribbonBg: '#EAD08A',
    ribbonText: '#20302a',
    accent: '#A9812A',
    medalBg: 'radial-gradient(circle at 50% 40%,#0e7a5f,#08402F)',
    pips: '★ ★ ★',
    regal: false,
  },
  realm: {
    ringGrad: 'conic-gradient(#F4A6B0,#C0392B,#7a1220,#F4A6B0,#C0392B)',
    ribbonBg: '#E7A9B0',
    ribbonText: '#20302a',
    accent: '#F4A6B0',
    medalBg: 'radial-gradient(circle at 50% 40%,#0e7a5f,#08402F)',
    pips: '★ ★ ★ ★',
    regal: false,
  },
  certified: {
    ringGrad: 'conic-gradient(#8FE3C4,#0e9e73,#064e3b,#8FE3C4,#0e9e73)',
    ribbonBg: '#A7E0CB',
    ribbonText: '#20302a',
    accent: '#8FE3C4',
    medalBg: 'radial-gradient(circle at 50% 40%,#0e7a5f,#08402F)',
    pips: '★ ★ ★ ★ ★',
    regal: true,
  },
  master: {
    ringGrad: 'conic-gradient(#6b7076,#26292d,#050506,#6b7076,#2c3034)',
    ribbonBg: '#1c1f22',
    ribbonText: '#EDEEF0',
    accent: '#1c1f22',
    medalBg: 'radial-gradient(circle at 50% 40%,#0e7a5f,#08402F)',
    pips: '★ ★ ★ ★ ★ ★',
    regal: true,
  },
};

export interface AchievementCertMeta {
  tier: CertTier;
  tierName: string;
  heading: string;
  description: string;
}

export const ACHIEVEMENT_CERT_META: Record<AchievementId, AchievementCertMeta> = {
  'general-beginner': {
    tier: 'bronze',
    tierName: 'BEGINNER',
    heading: 'General Track · Beginner Cleared',
    description:
      'Has completed the foundational modules and assessments of the General Track, establishing a confident footing in the NESR AI Verse.',
  },
  'general-intermediate': {
    tier: 'silver',
    tierName: 'INTERMEDIATE',
    heading: 'General Track · Intermediate Cleared',
    description:
      'Has progressed through the intermediate General Track, deepening practical command of everyday AI skills within the NESR AI Verse.',
  },
  'general-advanced': {
    tier: 'gold',
    tierName: 'ADVANCED',
    heading: 'General Track · Advanced Cleared',
    description:
      'Has demonstrated advanced mastery of the General Track, completing every advanced module, assessment, and applied challenge within the NESR AI Verse.',
  },
  'technical-beginner': {
    tier: 'bronze',
    tierName: 'BEGINNER',
    heading: 'Technical Track · Beginner Cleared',
    description:
      'Has completed the foundational modules and assessments of the Technical Track, laying the groundwork for hands-on AI craft in the NESR AI Verse.',
  },
  'technical-intermediate': {
    tier: 'silver',
    tierName: 'INTERMEDIATE',
    heading: 'Technical Track · Intermediate Cleared',
    description:
      'Has progressed through the intermediate Technical Track, building working fluency with the tools and techniques of the NESR AI Verse.',
  },
  'technical-advanced': {
    tier: 'gold',
    tierName: 'ADVANCED',
    heading: 'Technical Track · Advanced Cleared',
    description:
      'Has demonstrated advanced mastery of the Technical Track, completing every advanced module, assessment, and applied challenge within the NESR AI Verse.',
  },
  productivity: {
    tier: 'bronze',
    tierName: 'PRODUCTIVITY',
    heading: 'Productivity Track Cleared',
    description:
      'Has cleared the complete Productivity Track, mastering the workflows and practices for working faster and smarter with AI in the NESR AI Verse.',
  },
  'general-realm': {
    tier: 'realm',
    tierName: 'REALM CONQUERED',
    heading: 'General Realm Conquered',
    description:
      'Has conquered the entire General Realm — Beginner through Advanced — achieving complete command of the General Track within the NESR AI Verse.',
  },
  'technical-realm': {
    tier: 'realm',
    tierName: 'REALM CONQUERED',
    heading: 'Technical Realm Conquered',
    description:
      'Has conquered the entire Technical Realm — Beginner through Advanced — achieving complete command of the Technical Track within the NESR AI Verse.',
  },
  certified: {
    tier: 'certified',
    tierName: 'CERTIFIED',
    heading: 'Certified',
    description:
      'Is formally certified across the General and Technical Realms and the Productivity Track — a fully accredited practitioner of the NESR AI Verse.',
  },
  'dungeon-master': {
    tier: 'master',
    tierName: 'DUNGEON MASTER',
    heading: 'Dungeon Master · 100%',
    description:
      'Has attained 100% completion of the entire NESR AI Verse — every track, every realm, every challenge — earning the highest honour we bestow: Dungeon Master.',
  },
};
