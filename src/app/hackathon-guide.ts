/**
 * Hackathon prep guide — content model.
 *
 * Same block system as the courses (see content.ts), so this can pick up
 * `video` blocks the same way once walkthrough videos exist. Rendered by
 * the shared <Block> component (components/ContentBlocks.tsx).
 *
 * Content is derived from the "AI Prototyping Hackathon" internal slide deck.
 */

import type { ContentBlock } from './content';

export interface GuideChapter {
  id: string;
  label: string; // short label for the in-page nav chip
  title: string;
  tagline: string;
  sections: ContentBlock[];
}

// General accent for the hackathon pages — matches the site's brand green
// family (see globals.css --brand) rather than a one-off color.
export const HACKATHON_ACCENT = '#45c07a';
// Brighter neon variant reserved for the countdown timer specifically.
export const HACKATHON_NEON = '#39ff88';

export const GUIDE_CHAPTERS: GuideChapter[] = [
  {
    id: 'how-it-works',
    label: 'How It Works',
    title: 'How the Hackathon Works',
    tagline: 'Build bold. Prove the value. Ship something real.',
    sections: [
      {
        kind: 'lead',
        text: 'Turn real-life pain points into AI prototypes worth piloting.',
        body: 'Find a slow, manual, or repetitive part of the business, build a working AI prototype for it, prove the business value, and leave with a realistic plan to pilot it for real.',
      },
      {
        kind: 'steps',
        heading: 'From painpoint to pilot',
        numbered: true,
        steps: [
          {
            title: 'Find the problem',
            body: 'Where is work slow, manual, or repetitive? What’s something you want to improve?',
          },
          {
            title: 'Build practical AI',
            body: 'Incorporate AI into your solution — build an assistant, automate a workflow, or build a dashboard.',
          },
          {
            title: 'Prove business value',
            body: 'Show time saved, cost avoided, quality improved, or faster turnaround.',
          },
          {
            title: 'Move from prototype to pilot',
            body: 'End with a demo and a next-step plan.',
          },
        ],
      },
      {
        kind: 'compare',
        heading: 'Every idea needs two layers',
        left: {
          title: 'Business layer',
          items: [
            'What problem does this solve?',
            'Who is the user or team affected?',
            'What is the business value proposition?',
          ],
        },
        right: {
          title: 'Technical layer',
          items: [
            'What data is required?',
            'What model or method is used?',
            'What is the workflow and architecture?',
            'How is it evaluated?',
            'What safety controls are in place?',
          ],
        },
      },
    ],
  },
  {
    id: 'business-layer',
    label: 'Business Layer',
    title: 'Business Layer: Problem, User, Value',
    tagline: 'Every idea needs a clear problem, user, and value proposition.',
    sections: [
      {
        kind: 'list',
        heading: 'What to define',
        items: [
          {
            title: 'Problem statement',
            body: 'What specific pain point is the team focusing on? How is it handled today, and what part is slow, inefficient, or error-prone?',
          },
          {
            title: 'Target user',
            body: 'Which team or user group is affected? Who directly benefits once the idea is deployed?',
          },
          {
            title: 'Value proposition',
            body: 'Why does this matter to the business — in terms leadership can act on, not just a technical description?',
          },
        ],
      },
    ],
  },
  {
    id: 'technical-layer',
    label: 'Technical Layer',
    title: 'Technical Layer: Building Blocks',
    tagline: 'The six building blocks behind every technical solution.',
    sections: [
      {
        kind: 'list',
        heading: 'Building blocks',
        items: [
          { title: 'Data', body: 'What dataset or documents are used, and where do they come from?' },
          { title: 'Model', body: 'What AI method or model powers the solution?' },
          { title: 'Workflow', body: 'What is the end-to-end process, step by step?' },
          { title: 'Architecture', body: 'How do the components fit together technically?' },
          { title: 'Evaluation', body: 'How is quality and accuracy measured?' },
          { title: 'Safety', body: 'What controls guard against misuse or error?' },
        ],
      },
    ],
  },
  {
    id: 'deliverables',
    label: 'Deliverables',
    title: 'Deliverables Checklist',
    tagline: 'What every team needs to bring to submission.',
    sections: [
      {
        kind: 'checklist',
        heading: 'Deliverables checklist',
        items: [
          'Problem statement',
          'Target user',
          'Chosen challenge/topic — today’s process and its gaps',
          'Dataset or documents used',
          'AI methods or workflows chosen',
          'Demo or prototype',
          'Business value proposition',
          'Impact quantification',
          'Cost vs. benefit estimate',
          'Responsible AI, legal & compliance check',
        ],
      },
    ],
  },
  {
    id: 'impact-and-cost',
    label: 'Impact & Cost',
    title: 'Quantify Impact & Prove the Math',
    tagline: 'Quantify the impact — don’t just claim it.',
    sections: [
      {
        kind: 'list',
        heading: 'What to quantify',
        items: [
          { title: 'Time saved', body: 'How much faster is the process now?' },
          { title: 'Cost saved', body: 'What expense does this reduce or avoid?' },
          { title: 'Quality improved', body: 'What gets more accurate, consistent, or reliable?' },
          { title: 'Faster turnaround', body: 'How much sooner does the outcome land?' },
        ],
      },
      {
        kind: 'compare',
        heading: 'Cost vs. benefit: prove the math',
        left: {
          title: 'Cost elements to estimate',
          items: [
            'AI/compute cost — model usage, API calls, infrastructure to run the solution',
            'Human review cost — time required for people to check, approve, correct AI output',
            'Maintenance cost — ongoing upkeep (monitoring, support)',
          ],
        },
        right: {
          title: 'The verdict',
          items: [
            'Net value created = total benefit − total cost',
            'Verdict: does the technical solution save more than it costs?',
          ],
        },
      },
    ],
  },
  {
    id: 'responsible-ai',
    label: 'Responsible AI',
    title: 'Responsible AI, Legal & Compliance',
    tagline: 'Every solution needs a privacy, legal, and policy check.',
    sections: [
      {
        kind: 'list',
        heading: 'What to check',
        items: [
          {
            title: 'Data privacy',
            body: 'Does the solution touch confidential or personal data? How is it protected?',
          },
          {
            title: 'Legal and regulatory fit',
            body: 'Are there industry, regional, or contractual rules that apply?',
          },
          {
            title: 'Policy alignment',
            body: 'Does the idea align with existing company policy, or does it need an exception?',
          },
        ],
      },
    ],
  },
  {
    id: 'judging',
    label: 'Judging',
    title: 'How Submissions Are Judged',
    tagline: 'The rubric, and what a strong submission looks like.',
    sections: [
      {
        kind: 'list',
        heading: 'Judging rubric — heaviest weighted first',
        items: [
          { title: 'Business value', body: 'Does the idea solve a real, meaningful problem for the business?' },
          {
            title: 'Productivity & workflow impact',
            body: 'How much time, effort, or friction does this remove from a real workflow?',
          },
          {
            title: 'Scalability & implementation plan',
            body: 'Could this realistically be piloted and scaled after the event?',
          },
          { title: 'Cost vs. benefit', body: 'Does the solution save more than it costs to build and run?' },
          {
            title: 'Responsible AI, legal & compliance',
            body: 'Has the team checked privacy, legal, and policy considerations?',
          },
          { title: 'Prototype quality', body: 'Does the demo actually work, not just look good on a slide?' },
        ],
      },
      {
        kind: 'checklist',
        heading: 'What a strong submission looks like',
        items: [
          'States the problem and user in one clear sentence',
          'Quantifies impact with a defensible estimate',
          'Shows a working demo, not just a concept slide',
          'Includes a real cost-vs-benefit calculation',
          'Names the data, model, and safety controls used',
          'Flags privacy, legal, or policy considerations early',
          'Has a realistic path to piloting after the event',
          'Maps every deliverable back to the checklist',
        ],
      },
      {
        kind: 'lead',
        text: 'Before you submit…',
        body: 'Confirm your team’s problem statement, fill in the deliverables checklist as you build, and revise your pitch against the rubric before submitting.',
      },
    ],
  },
];

export const TOTAL_GUIDE_CHAPTERS = GUIDE_CHAPTERS.length;
