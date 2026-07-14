/**
 * Hackathon prep guide — content model.
 *
 * Same block system as the courses (see content.ts), so this can pick up
 * `video` blocks the same way once walkthrough videos exist. Rendered by
 * the shared <Block> component (components/ContentBlocks.tsx).
 */

import type { ContentBlock } from './content';

export interface GuideChapter {
  id: string;
  label: string; // short label for the in-page nav chip
  title: string;
  tagline: string;
  sections: ContentBlock[];
}

export const HACKATHON_ACCENT = '#ea580c';
export const HACKATHON_ACCENT_SOFT = '#fff3ec';

export const GUIDE_CHAPTERS: GuideChapter[] = [
  {
    id: 'how-it-works',
    label: 'How It Works',
    title: 'How the Hackathon Works',
    tagline: 'Two build categories, two layers to every solution.',
    sections: [
      {
        kind: 'lead',
        text: 'Pick a category, then build both the business case and the technical solution.',
        body: 'Every team chooses one of two build categories. Whichever you pick, your solution needs to work on two layers: what problem it solves and for whom, and what it takes technically to build it.',
      },
      {
        kind: 'cards',
        heading: 'Two build categories',
        cards: [
          {
            title: 'Category A — AI Model / Data Science',
            body: 'Teams train or evaluate models in Kaggle or Colab. Best if you want to work directly with data and modeling.',
          },
          {
            title: 'Category B — AI Workflow / Power Platform',
            body: 'Teams use Power Automate, Power Apps, Power BI, SharePoint, Teams, and AI services to turn insights into action. Best if you want to build something end-users touch directly.',
          },
        ],
      },
      {
        kind: 'compare',
        heading: 'Two layers to every solution',
        left: {
          title: 'Business layer',
          items: [
            'What problem does this solve?',
            'Who is it for?',
            'What SDG (Sustainable Development Goal) does it support?',
          ],
        },
        right: {
          title: 'Technical layer',
          items: [
            'What data does it need?',
            'What model or workflow powers it?',
            'What architecture, evaluation, and safety controls are required?',
          ],
        },
      },
    ],
  },
  {
    id: 'architecture',
    label: 'Architecture',
    title: 'Recommended Build Architecture',
    tagline: 'The four stages every project should walk through.',
    sections: [
      {
        kind: 'steps',
        heading: 'The four stages',
        numbered: true,
        steps: [
          { title: 'Data preparation', body: 'Get, clean, and understand your dataset.' },
          { title: 'AI application layer', body: 'Build the thing people actually interact with.' },
          { title: 'Modeling', body: 'Pick and justify the model or method behind it.' },
          { title: 'Responsible AI & risk controls', body: 'Check the solution is safe, fair, and monitored.' },
        ],
      },
      {
        kind: 'checklist',
        heading: 'Data preparation checklist',
        items: [
          'Use the sample datasets provided in advance where possible',
          'Read the data dictionary before you start modeling',
          'Prefer synthetic data if the real company data is sensitive',
          'Check whether your dataset is labeled safe for public tools, or internal-only',
        ],
      },
      {
        kind: 'list',
        heading: 'AI application layer — build at least one of',
        items: [
          { title: 'Dashboard', body: 'Visualize the insight so someone can act on it at a glance.' },
          { title: 'Chatbot / copilot', body: 'Let people ask questions in plain language and get answers.' },
          { title: 'Forecasting tool', body: 'Predict a future number — cost, demand, emissions, usage.' },
          { title: 'Alerting workflow', body: 'Flag anomalies or thresholds automatically as they happen.' },
          { title: 'API service', body: 'Expose the model or logic so other tools can call it.' },
          { title: 'Decision-support simulator', body: '"What if we changed X?" — model the tradeoffs of a choice.' },
        ],
      },
      {
        kind: 'list',
        heading: 'Modeling guidance',
        items: [
          {
            title: 'Any model type is fair game',
            body: 'Classical ML, deep learning, LLMs, or optimization — pick whatever fits the problem.',
          },
          {
            title: 'Be ready to explain your choice',
            body: 'Judges will ask why this model type fits this problem — have a one-sentence answer.',
          },
          {
            title: 'Small and working beats big and theoretical',
            body: 'A small prototype that actually runs is worth more than a giant architecture on a slide.',
          },
        ],
      },
      {
        kind: 'list',
        heading: 'Every team must define',
        items: [
          { title: 'Primary SDG', body: 'The one Sustainable Development Goal your solution supports.' },
          { title: 'Target indicator or proxy metric', body: 'The number your solution is trying to move.' },
          { title: 'Baseline', body: 'What that number looks like today, before your solution.' },
          { title: 'Expected improvement', body: 'What you expect the number to become.' },
          { title: 'Measurement method', body: 'How you’d actually verify the improvement is real.' },
        ],
      },
      {
        kind: 'checklist',
        heading: 'Responsible AI & risk controls — every team must include',
        items: [
          'Data privacy review',
          'Bias / fairness considerations',
          'Human approval points before high-stakes actions',
          'Known failure modes',
          'Safety limitations — what it should NOT be trusted to do',
          'A monitoring plan for after launch',
        ],
      },
    ],
  },
  {
    id: 'sdgs',
    label: 'Pick an SDG',
    title: 'Choose Your SDG',
    tagline: 'Pick one primary Sustainable Development Goal and explain how your solution supports it.',
    sections: [
      {
        kind: 'lead',
        text: 'Pick one primary SDG.',
        body: 'These six UN Sustainable Development Goals are the most relevant to energy. Choose one as your primary goal and be ready to explain, in a sentence or two, exactly how your solution supports it.',
      },
      {
        kind: 'glossary',
        heading: 'SDGs relevant to energy',
        terms: [
          { term: 'SDG 7', def: 'Affordable and Clean Energy' },
          { term: 'SDG 9', def: 'Industry, Innovation and Infrastructure' },
          { term: 'SDG 11', def: 'Sustainable Cities and Communities' },
          { term: 'SDG 12', def: 'Responsible Consumption and Production' },
          { term: 'SDG 13', def: 'Climate Action' },
          { term: 'SDG 17', def: 'Partnerships for the Goals' },
        ],
      },
    ],
  },
  {
    id: 'examples',
    label: 'Examples',
    title: 'Example Challenges',
    tagline: 'Two full worked examples — problem, data, methods, output, and evaluation.',
    sections: [
      {
        kind: 'lead',
        text: 'Example 1 — Emissions Monitoring & Carbon Intelligence',
        body: 'Primary SDGs: 12, 13. Build an AI dashboard that detects emissions anomalies and recommends reduction actions by asset, site, or process.',
      },
      {
        kind: 'compare',
        heading: 'Example 1 — technical components',
        left: {
          title: 'Input data',
          items: [
            'Fuel consumption',
            'Production volumes',
            'Energy mix',
            'Asset operating conditions',
            'Emissions factors',
            'Satellite or IoT emissions data, if available',
          ],
        },
        right: {
          title: 'Possible methods',
          items: [
            'Regression models for emissions estimation',
            'Anomaly detection for abnormal emissions spikes',
            'LLM assistant for summarizing emissions reports',
            'Scenario modeling — "what happens if we switch fuel mix?"',
          ],
        },
      },
      {
        kind: 'list',
        heading: 'Example 1 — prototype output & evaluation',
        items: [
          { title: 'Prototype output', body: 'Emissions dashboard, site-level anomaly alerts, root-cause hypotheses, reduction recommendations, and an SDG 13 impact estimate.' },
          { title: 'Evaluation', body: 'Accuracy vs. measured emissions, number of anomalies detected, estimated CO₂e reduction, and how explainable the recommendations are.' },
        ],
      },
      {
        kind: 'lead',
        text: 'Example 2 — Customer Energy Efficiency Assistant',
        body: 'Primary SDGs: 7, 11, 12, 13. Build an AI assistant that analyzes a customer’s energy usage and gives personalized recommendations to reduce cost and emissions.',
      },
      {
        kind: 'compare',
        heading: 'Example 2 — technical components',
        left: {
          title: 'Input data',
          items: [
            'Smart meter readings',
            'Tariff data',
            'Building type',
            'Appliance or equipment profile',
            'Weather',
            'Customer behavior patterns',
          ],
        },
        right: {
          title: 'Possible methods',
          items: [
            'Clustering customers by usage pattern',
            'Recommendation systems',
            'LLM chatbot with retrieval over approved energy-saving guidance',
            'Forecasting monthly bill impact',
          ],
        },
      },
      {
        kind: 'list',
        heading: 'Example 2 — prototype output & evaluation',
        items: [
          { title: 'Prototype output', body: 'Personalized recommendations, bill savings estimate, CO₂e savings estimate, a chat interface, and a before/after usage simulation.' },
          { title: 'Evaluation', body: 'Recommendation relevance, estimated kWh reduction, estimated bill reduction, user satisfaction score, and safety — no misleading financial or technical claims.' },
        ],
      },
    ],
  },
  {
    id: 'kaggle-basics',
    label: 'Kaggle & Colab',
    title: 'Getting Data: Kaggle & Colab Basics',
    tagline: 'If you’re in Category A, here’s how to actually get a dataset and start working with it.',
    sections: [
      {
        kind: 'lead',
        text: 'Kaggle is the easiest place to find a free, ready-to-use dataset.',
        body: 'It hosts thousands of public datasets, plus free notebooks (with free GPU access) to explore and model them — no local setup required. If your team is in Category A, this is usually the fastest way to get moving.',
      },
      {
        kind: 'steps',
        heading: 'From zero to a dataset in your notebook',
        numbered: true,
        steps: [
          {
            title: 'Create a free Kaggle account',
            body: 'Sign up at kaggle.com — a Google account works for instant sign-in.',
          },
          {
            title: 'Find a dataset',
            body: 'Go to the "Datasets" tab and search by topic (e.g. "energy consumption", "CO2 emissions"). Filter by file type, size, and usability rating — higher-rated datasets have better documentation.',
          },
          {
            title: 'Check the data dictionary first',
            body: 'Open the dataset’s "Data Card" / description tab before downloading. It explains what each column means, its units, and any known quality issues.',
          },
          {
            title: 'Get it into a notebook — two ways',
            body: 'Easiest: click "New Notebook" directly on the dataset page — Kaggle attaches the data for you automatically, free GPU included. Alternative: use a Kaggle Notebook or Google Colab and pull the data in with the Kaggle API (below).',
          },
          {
            title: 'Load it and take a first look',
            body: 'In Python: `import pandas as pd; df = pd.read_csv(‘/kaggle/input/<dataset>/<file>.csv’)` then `df.head()` and `df.info()` to sanity-check it before doing anything else.',
          },
        ],
      },
      {
        kind: 'cards',
        heading: 'Using the Kaggle API from Google Colab',
        cards: [
          {
            title: '1. Get an API token',
            body: 'On Kaggle: Account settings → "Create New Token". This downloads a kaggle.json file.',
          },
          {
            title: '2. Upload it in Colab',
            body: 'Run `from google.colab import files; files.upload()` and select kaggle.json, then move it to `~/.kaggle/` with the right permissions.',
          },
          {
            title: '3. Download the dataset',
            body: 'Run `!pip install kaggle` then `!kaggle datasets download -d <owner>/<dataset-name>` (the slug is in the dataset’s URL), then unzip it.',
          },
        ],
      },
      {
        kind: 'glossary',
        heading: 'Terms you’ll see',
        terms: [
          { term: 'Dataset', def: 'A collection of files (usually CSVs) someone published for others to use.' },
          { term: 'Notebook / Kernel', def: 'A free, ready-to-run coding environment (Python) attached to a dataset — no install needed.' },
          { term: 'Data Card', def: 'The dataset’s description page — what’s in it, column meanings, license, and known issues.' },
          { term: 'Usability score', def: 'Kaggle’s 0–10 rating of how well-documented and clean a dataset is.' },
          { term: 'kaggle.json (API token)', def: 'Your personal key for downloading datasets by code instead of clicking through the site.' },
          { term: 'Competition', def: 'A structured challenge with a fixed dataset, task, and leaderboard — good for practice, not required for the hackathon.' },
        ],
      },
      {
        kind: 'checklist',
        heading: 'Before you start modeling, check…',
        items: [
          'You’ve read the license — can this data actually be used for this purpose?',
          'You know what each column means and its units (the data dictionary)',
          'You’ve checked for missing values, duplicates, or obviously broken rows',
          'If the data is sensitive or internal, it stays out of public tools — use synthetic data instead',
          'You’ve noted the dataset’s size limits so your notebook doesn’t run out of memory',
        ],
      },
    ],
  },
];

export const TOTAL_GUIDE_CHAPTERS = GUIDE_CHAPTERS.length;
