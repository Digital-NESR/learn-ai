/**
 * AI Learning Series — beginner content.
 *
 * Two tracks (Business + Technical), three modules ("parts") each, and a
 * short quiz after every module. Content is adapted from the two beginner
 * decks: "AI Basics for Business" and "AI Foundations: A Technical Primer".
 *
 * This is static, data-driven content — no database. The landing page and
 * the module pages both render straight from the TRACKS array below, and
 * per-user progress is kept in localStorage (see lib/progress.ts).
 */

/* ─── Lesson content blocks ──────────────────────────────────────────── */

export type ContentBlock =
  | { kind: 'lead'; text: string; body: string }
  | { kind: 'cards'; heading?: string; cards: { title: string; body: string }[] }
  | {
      kind: 'compare';
      heading?: string;
      left: { title: string; items: string[] };
      right: { title: string; items: string[] };
    }
  | { kind: 'steps'; heading?: string; numbered?: boolean; steps: { title: string; body?: string }[] }
  | { kind: 'flow'; heading?: string; body?: string; nodes: string[] }
  | { kind: 'glossary'; heading?: string; terms: { term: string; def: string }[] }
  | { kind: 'list'; heading?: string; items: { title: string; body: string }[] }
  | { kind: 'checklist'; heading?: string; items: string[] }
  | { kind: 'video'; youtubeId: string; heading?: string; caption?: string };

/* ─── Quiz ───────────────────────────────────────────────────────────── */

export interface QuizQuestion {
  prompt: string;
  options: string[];
  /** index into `options` */
  answer: number;
  explanation: string;
}

/* ─── Module + track ─────────────────────────────────────────────────── */

export interface Module {
  /** url slug, e.g. "business-1" */
  id: string;
  /** "Part 1 of 3" */
  partLabel: string;
  part: number;
  title: string;
  tagline: string;
  /** rough time to read + quiz */
  minutes: number;
  sections: ContentBlock[];
  quiz: QuizQuestion[];
}

export type TrackId = 'business' | 'technical';

export interface Track {
  id: TrackId;
  eyebrow: string;
  title: string;
  subtitle: string;
  /** hex accent used across cards, badges, and the module header */
  accent: string;
  /** faint tint background for accent surfaces */
  accentSoft: string;
  modules: Module[];
}

/* ══════════════════════════════════════════════════════════════════════
   BUSINESS TRACK
   ══════════════════════════════════════════════════════════════════════ */

const businessModules: Module[] = [
  {
    id: 'business-1',
    partLabel: 'Part 1 of 3',
    part: 1,
    title: 'What Is AI?',
    tagline: 'A five-minute primer on what artificial intelligence really means.',
    minutes: 5,
    sections: [
      {
        kind: 'lead',
        text: 'AI is machines doing things that normally need human intelligence.',
        body: 'This quick Simplilearn primer defines artificial intelligence, shows everyday examples you already use, and lays out the three broad types of AI.',
      },
      {
        kind: 'video',
        youtubeId: 'ad79nYk2keg',
        heading: 'Watch: What is AI? (in 5 minutes)',
        caption: 'Simplilearn (~5 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'AI, defined', body: 'Machines that simulate human intelligence — learning, reasoning, and problem-solving.' },
          { title: 'You already use it', body: 'Virtual assistants, recommendations, spam filters, and self-driving cars.' },
          { title: 'Three types', body: 'Narrow AI (one task), General AI (human-level), and Super AI (beyond human). Today’s AI is Narrow.' },
          { title: 'Powered by data', body: 'AI systems learn patterns from large amounts of data.' },
        ],
      },
    ],
    quiz: [
      {
        prompt: 'Which is the best short definition of AI?',
        options: [
          'Machines performing tasks that normally require human intelligence',
          'Any computer program at all',
          'A faster internet connection',
          'A type of spreadsheet',
        ],
        answer: 0,
        explanation: 'AI is about machines simulating human intelligence — learning, reasoning, and solving problems.',
      },
      {
        prompt: 'Which is an everyday example of AI in action?',
        options: [
          'A virtual assistant like Siri or Alexa',
          'A paper calculator',
          'A light switch',
          'A printed book',
        ],
        answer: 0,
        explanation: 'Virtual assistants, recommendations, and spam filters are common examples the video highlights.',
      },
      {
        prompt: 'Today’s AI systems are mostly which type?',
        options: [
          'Narrow AI — built for a specific task',
          'General AI — human-level at everything',
          'Super AI — beyond human ability',
          'None — AI has no types',
        ],
        answer: 0,
        explanation: 'Current AI is Narrow (or “weak”) AI, designed for specific tasks. General and Super AI are still hypothetical.',
      },
      {
        prompt: 'What do AI systems mainly learn from?',
        options: [
          'Large amounts of data',
          'Hand-written rules only',
          'Random guessing',
          'The weather',
        ],
        answer: 0,
        explanation: 'AI learns patterns from large amounts of data rather than being programmed rule by rule.',
      },
    ],
  },
  {
    id: 'business-2',
    partLabel: 'Part 2 of 3',
    part: 2,
    title: 'Generative AI at Work',
    tagline: 'What generative AI is, how it works, and how to actually use it well.',
    minutes: 18,
    sections: [
      {
        kind: 'lead',
        text: 'Generative AI creates new content — text, images, and code.',
        body: 'Henrik Kniberg’s popular explainer walks through what generative AI is, why it differs from traditional software, and practical ways to use it as a drafting and thinking partner.',
      },
      {
        kind: 'video',
        youtubeId: '2IK3DFHRFfw',
        heading: 'Watch: Generative AI in a Nutshell',
        caption: 'Henrik Kniberg (~18 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'It generates new content', body: 'Unlike a search engine, it produces new text, images, or code on request.' },
          { title: 'It learns patterns from data', body: 'Trained on huge amounts of data, it predicts likely, useful output.' },
          { title: 'Capable but fallible', body: 'It can be confidently wrong — treat its output as a draft to review, not a final answer.' },
          { title: 'You steer it with prompts', body: 'Clear instructions and good context lead to much better results.' },
        ],
      },
    ],
    quiz: [
      {
        prompt: 'What does generative AI mainly do?',
        options: [
          'Creates new content such as text, images, or code',
          'Only searches existing web pages',
          'Only stores files',
          'Only fixes spelling mistakes',
        ],
        answer: 0,
        explanation: 'Generative AI produces new content on request, rather than just retrieving what already exists.',
      },
      {
        prompt: 'Where does a generative AI model get its abilities?',
        options: [
          'From patterns learned in large amounts of training data',
          'From a fixed list of hand-written answers',
          'From the user’s typing speed',
          'From the device’s battery level',
        ],
        answer: 0,
        explanation: 'It learns patterns from vast training data and uses them to predict useful output.',
      },
      {
        prompt: 'What is a smart way to work with generative AI?',
        options: [
          'Treat its output as a draft, review it, and keep a human in the loop',
          'Publish whatever it produces without checking',
          'Never give it any instructions',
          'Assume it is always correct',
        ],
        answer: 0,
        explanation: 'Because it can be confidently wrong, review its output and keep a person accountable.',
      },
      {
        prompt: 'What most affects the quality of what you get back?',
        options: [
          'How clear your prompt and context are',
          'The color of your screen',
          'The time of day',
          'How fast you type',
        ],
        answer: 0,
        explanation: 'Clear instructions and relevant context are the biggest lever on output quality.',
      },
    ],
  },
  {
    id: 'business-3',
    partLabel: 'Part 3 of 3',
    part: 3,
    title: 'Using AI Responsibly',
    tagline: 'The ethics questions every team should ask before leaning on AI.',
    minutes: 7,
    sections: [
      {
        kind: 'lead',
        text: 'Powerful tools need guardrails.',
        body: 'This IBM explainer introduces AI ethics — the principles that help organizations capture AI’s benefits while reducing harms like bias and loss of trust.',
      },
      {
        kind: 'video',
        youtubeId: 'aGwYtUzMQUk',
        heading: 'Watch: What is AI Ethics?',
        caption: 'IBM Technology (~7 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'What AI ethics is', body: 'A set of principles for developing and using AI responsibly — maximizing benefit while reducing harm.' },
          { title: 'Bias is a core risk', body: 'AI trained on skewed data can produce unfair outcomes.' },
          { title: 'Transparency & explainability', body: 'People should be able to understand and question how AI reaches a decision.' },
          { title: 'Accountability', body: 'Organizations and people — not the AI — are responsible for outcomes.' },
        ],
      },
    ],
    quiz: [
      {
        prompt: 'What is AI ethics mainly about?',
        options: [
          'Principles for using AI responsibly — maximizing benefit and reducing harm',
          'Making AI models run faster',
          'Choosing which hardware to buy',
          'A new programming language',
        ],
        answer: 0,
        explanation: 'AI ethics is about responsible development and use — getting the benefits while limiting harm.',
      },
      {
        prompt: 'Why can an AI system produce unfair results?',
        options: [
          'It can learn bias from skewed training data',
          'It runs out of electricity',
          'It types too quickly',
          'It has too many users',
        ],
        answer: 0,
        explanation: 'Bias in the training data can lead to unfair or skewed outcomes — a central AI-ethics concern.',
      },
      {
        prompt: 'What does “transparency” or “explainability” mean for AI?',
        options: [
          'People can understand and question how the AI reached a decision',
          'The AI runs in the cloud',
          'The model is very large',
          'Responses appear quickly',
        ],
        answer: 0,
        explanation: 'Explainability means being able to see and challenge how an AI arrived at its output.',
      },
      {
        prompt: 'Who is ultimately accountable for how AI is used?',
        options: [
          'The organizations and people using it',
          'The AI system itself',
          'No one',
          'Only the end customer',
        ],
        answer: 0,
        explanation: 'Accountability stays with the people and organizations deploying AI — not the tool.',
      },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════
   TECHNICAL TRACK
   ══════════════════════════════════════════════════════════════════════ */

const technicalModules: Module[] = [
  {
    id: 'technical-1',
    partLabel: 'Part 1 of 3',
    part: 1,
    title: 'What Is a Neural Network?',
    tagline: 'The building block behind modern AI — built up from scratch, and visualized.',
    minutes: 20,
    sections: [
      {
        kind: 'lead',
        text: 'A neural network learns patterns from examples.',
        body: 'This 3Blue1Brown video uses the classic task of recognizing handwritten digits to show how a network of simple “neurons,” arranged in layers, turns raw pixels into an answer — without anyone writing the rules by hand.',
      },
      {
        kind: 'video',
        youtubeId: 'aircAruvnKk',
        heading: 'Watch: But what is a neural network?',
        caption: '3Blue1Brown · Deep learning, chapter 1 (~19 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Neurons hold a number', body: 'Each neuron carries an “activation” — a value between 0 and 1.' },
          { title: 'Organized in layers', body: 'An input layer, one or more hidden layers, and an output layer.' },
          { title: 'The digit example', body: 'A 28×28 image feeds 784 input neurons; 10 output neurons score the digits 0–9.' },
          { title: 'Weights and biases', body: 'Connections have weights and each neuron a bias — the values the network tunes to “learn.”' },
        ],
      },
    ],
    quiz: [
      {
        prompt: 'What example task does the video use to explain neural networks?',
        options: [
          'Recognizing handwritten digits (0–9)',
          'Translating between languages',
          'Playing chess',
          'Generating images',
        ],
        answer: 0,
        explanation: 'The whole video is framed around recognizing a handwritten digit from a 28×28 grayscale image.',
      },
      {
        prompt: 'What does a single neuron hold?',
        options: [
          'A number (its “activation”) between 0 and 1',
          'A whole word',
          'A full image',
          'Only a yes/no flag',
        ],
        answer: 0,
        explanation: 'A neuron holds an activation — a number between 0 and 1 representing how “lit up” it is.',
      },
      {
        prompt: 'What are the layers between the input and output layers called?',
        options: ['Hidden layers', 'Buffer layers', 'Memory layers', 'Token layers'],
        answer: 0,
        explanation: 'The layers between input and output are the “hidden layers,” where intermediate patterns form.',
      },
      {
        prompt: 'What does the network actually adjust in order to “learn”?',
        options: [
          'Its weights and biases',
          'The size of the image',
          'The number of digits',
          'The screen resolution',
        ],
        answer: 0,
        explanation: 'Learning means finding good values for the weights (on connections) and biases (on neurons).',
      },
    ],
  },
  {
    id: 'technical-2',
    partLabel: 'Part 2 of 3',
    part: 2,
    title: 'Large Language Models, Briefly',
    tagline: 'What an LLM actually does, and how it gets trained — in plain terms.',
    minutes: 8,
    sections: [
      {
        kind: 'lead',
        text: 'At its core, an LLM predicts the next word.',
        body: 'This short overview explains what large language models are, how they produce text one word at a time, and the two big training steps that turn raw prediction into a helpful assistant.',
      },
      {
        kind: 'video',
        youtubeId: 'LPZh9BOjkQs',
        heading: 'Watch: Large Language Models explained briefly',
        caption: '3Blue1Brown (~8 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Next-word prediction', body: 'An LLM takes text and predicts how likely each possible next word is.' },
          { title: 'Text, one word at a time', body: 'To write a passage it predicts a word, adds it, and repeats.' },
          { title: '“Large” = many parameters', body: 'Modern models have hundreds of billions of parameters (weights) tuned during training.' },
          { title: 'Pretraining, then human feedback', body: 'It first learns from enormous amounts of text, then is refined with reinforcement learning from human feedback (RLHF).' },
        ],
      },
    ],
    quiz: [
      {
        prompt: 'Fundamentally, what is a large language model trained to do?',
        options: [
          'Predict the next word, given the text so far',
          'Look answers up in a fixed database',
          'Store documents word-for-word',
          'Sort words alphabetically',
        ],
        answer: 0,
        explanation: 'An LLM is, at heart, a next-word predictor — it outputs how likely each possible next word is.',
      },
      {
        prompt: 'How does an LLM produce a whole passage of text?',
        options: [
          'By predicting one word at a time and repeating',
          'By writing the last word first',
          'By copying a stored paragraph',
          'All words at once, then editing',
        ],
        answer: 0,
        explanation: 'It predicts a word, appends it to the text, and repeats the process over and over.',
      },
      {
        prompt: 'What does the “large” in “large language model” mainly refer to?',
        options: [
          'The huge number of parameters (weights)',
          'The physical size of the computer',
          'The length of your prompt',
          'The number of languages it speaks',
        ],
        answer: 0,
        explanation: '“Large” refers to the enormous number of tunable parameters — often hundreds of billions.',
      },
      {
        prompt: 'After learning from huge amounts of text, what extra step helps make the model a helpful assistant?',
        options: [
          'Reinforcement learning with human feedback',
          'Deleting most of its parameters',
          'Turning off the internet',
          'Sorting its training data',
        ],
        answer: 0,
        explanation: 'Pretraining is followed by reinforcement learning with human feedback (RLHF) to shape helpful behavior.',
      },
    ],
  },
  {
    id: 'technical-3',
    partLabel: 'Part 3 of 3',
    part: 3,
    title: 'Transformers: The Tech Behind LLMs',
    tagline: 'A look under the hood at the architecture powering tools like ChatGPT.',
    minutes: 27,
    sections: [
      {
        kind: 'lead',
        text: 'The “T” in GPT stands for Transformer.',
        body: 'This chapter visualizes how a transformer turns text into a prediction: breaking it into tokens, representing each token as a vector, and letting those vectors share context through “attention.”',
      },
      {
        kind: 'video',
        youtubeId: 'wjZofJX0v4M',
        heading: 'Watch: Transformers, the tech behind LLMs',
        caption: '3Blue1Brown · Deep learning, chapter 5 (~27 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Text becomes tokens', body: 'Input is broken into small chunks called tokens.' },
          { title: 'Tokens become vectors', body: 'Each token maps to a list of numbers (an embedding); similar meanings land near each other.' },
          { title: 'Attention shares context', body: 'The attention step lets tokens pass information to each other, so meaning depends on the surrounding words.' },
          { title: 'Out comes a prediction', body: 'The model ends by producing a probability distribution over the possible next tokens.' },
        ],
      },
    ],
    quiz: [
      {
        prompt: 'What does “GPT” stand for?',
        options: [
          'Generative Pretrained Transformer',
          'General Purpose Translator',
          'Graphical Prediction Tool',
          'Global Pattern Tracker',
        ],
        answer: 0,
        explanation: 'GPT = Generative Pretrained Transformer — the transformer is the core architecture.',
      },
      {
        prompt: 'Before a transformer processes text, the text is first broken into…',
        options: ['Tokens', 'Pixels', 'Folders', 'Whole sentences only'],
        answer: 0,
        explanation: 'Text is split into tokens — small chunks such as words or word-pieces.',
      },
      {
        prompt: 'How does a transformer represent each token?',
        options: [
          'As a vector (list of numbers) where similar meanings are close together',
          'As a single letter',
          'As an image',
          'As a row in a spreadsheet',
        ],
        answer: 0,
        explanation: 'Each token becomes an embedding — a vector — and vectors with similar meanings sit near each other.',
      },
      {
        prompt: 'What does the “attention” mechanism let the model do?',
        options: [
          'Let tokens share context with each other',
          'Delete unimportant words',
          'Translate to another language',
          'Compress the text to save space',
        ],
        answer: 0,
        explanation: 'Attention lets each token pull in information from other tokens, so meaning reflects the surrounding context.',
      },
    ],
  },
];

/* ─── Tracks ─────────────────────────────────────────────────────────── */

export const TRACKS: Track[] = [
  {
    id: 'business',
    eyebrow: 'Business Track',
    title: 'AI for Business: Watch & Learn',
    subtitle:
      'A three-part video series — what AI is, using generative AI at work, and using it responsibly — with a short quiz after each.',
    accent: '#307c4c',
    accentSoft: '#f0f9f4',
    modules: businessModules,
  },
  {
    id: 'technical',
    eyebrow: 'Technical Track',
    title: 'AI Foundations: Watch & Learn',
    subtitle:
      'A three-part video series — neural networks, large language models, and transformers — with a short quiz after each. Videos by 3Blue1Brown.',
    accent: '#4f46e5',
    accentSoft: '#eef2ff',
    modules: technicalModules,
  },
];

/* ─── Lookup helpers ─────────────────────────────────────────────────── */

export const ALL_MODULES: { module: Module; track: Track }[] = TRACKS.flatMap(track =>
  track.modules.map(module => ({ module, track })),
);

export function findModule(moduleId: string): { module: Module; track: Track } | undefined {
  return ALL_MODULES.find(m => m.module.id === moduleId);
}

/** The next module in learning order, if any (continues into the next track). */
export function nextModule(moduleId: string): { module: Module; track: Track } | undefined {
  const idx = ALL_MODULES.findIndex(m => m.module.id === moduleId);
  if (idx === -1 || idx + 1 >= ALL_MODULES.length) return undefined;
  return ALL_MODULES[idx + 1];
}

export const TOTAL_MODULES = ALL_MODULES.length;
