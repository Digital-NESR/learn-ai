/**
 * Judging rubric for hackathon submissions - mirrors the categories described
 * in the "Judging" prep-guide chapter (see hackathon-guide.ts), weighted to a
 * 100-point total. Scores are stored per-judge-per-team as a jsonb map keyed
 * by category id (see hackathon_scores in database/aiverse_schema.sql).
 */

export interface RubricCategory {
  id: string;
  label: string;
  description: string;
  maxScore: number;
}

export const RUBRIC_CATEGORIES: RubricCategory[] = [
  {
    id: 'businessValue',
    label: 'Business Value',
    description: 'Does the idea solve a real, meaningful problem for the business?',
    maxScore: 25,
  },
  {
    id: 'productivityWorkflow',
    label: 'Productivity & Workflow Impact',
    description: 'How much time, effort, or friction does this remove from a real workflow?',
    maxScore: 20,
  },
  {
    id: 'costBenefit',
    label: 'Cost vs. Benefit',
    description: 'Does the solution save more than it costs to build and run?',
    maxScore: 15,
  },
  {
    id: 'responsibleAI',
    label: 'Responsible AI, Legal & Compliance',
    description: 'Has the team checked privacy, legal, and policy considerations?',
    maxScore: 15,
  },
  {
    id: 'prototypeQuality',
    label: 'Prototype Quality',
    description: 'Does the demo actually work, not just look good on a slide?',
    maxScore: 15,
  },
  {
    id: 'scalability',
    label: 'Scalability & Implementation Plan',
    description: 'Could this realistically be piloted and scaled after the event?',
    maxScore: 10,
  },
];

export const RUBRIC_CATEGORY_IDS = RUBRIC_CATEGORIES.map(c => c.id);
export const RUBRIC_TOTAL_MAX = RUBRIC_CATEGORIES.reduce((sum, c) => sum + c.maxScore, 0);
