/**
 * Fixed deliverables questionnaire for hackathon submissions - maps onto the
 * "Deliverables Checklist" and judging rubric in the prep guide (see
 * hackathon-guide.ts). Answers are stored as a jsonb map keyed by `id` on
 * hackathon_submissions.answers (see actions/hackathon-submission.ts).
 */

export interface DeliverableQuestion {
  id: string;
  label: string;
  prompt: string;
}

export const DELIVERABLE_QUESTIONS: DeliverableQuestion[] = [
  {
    id: 'problemStatement',
    label: 'Problem Statement',
    prompt: 'Explain your problem statement - what challenge does it address, and who does it benefit?',
  },
  {
    id: 'techStack',
    label: 'Tools & Tech Used',
    prompt: 'Expand on the tools, technologies, or AI methods you used to build your solution.',
  },
  {
    id: 'dataSources',
    label: 'Data & Documents Used',
    prompt: 'What dataset(s) or documents did you use, and where did they come from?',
  },
  {
    id: 'businessValue',
    label: 'Business Value Proposition',
    prompt: 'Explain the business value proposition - why does this matter to the business, in terms leadership can act on?',
  },
  {
    id: 'costBenefit',
    label: 'Cost vs. Benefit Estimate',
    prompt: 'Give a cost vs. benefit estimate - what does it cost to build and run, versus the value it creates?',
  },
  {
    id: 'impact',
    label: 'Impact Quantification',
    prompt: 'Quantify the impact - time saved, cost avoided, quality improved, or faster turnaround.',
  },
  {
    id: 'responsibleAI',
    label: 'Responsible AI, Legal & Compliance',
    prompt: 'What responsible AI, legal, or compliance considerations did you check?',
  },
  {
    id: 'nextSteps',
    label: 'Path to Piloting',
    prompt: 'What is the realistic path to piloting this solution after the event?',
  },
];

export const DELIVERABLE_QUESTION_IDS = DELIVERABLE_QUESTIONS.map(q => q.id);
