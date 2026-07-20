/**
 * NESR AI Verse — course content.
 *
 * Three parts:
 *  - General Track: Beginner / Intermediate / Advanced tiers, ~10 short
 *    videos each, with a quiz after every video.
 *  - Technical Track: a deeper, more technical curriculum — neural
 *    networks, LLMs, transformers, RAG, feature engineering, and agents.
 *  - Productivity Track: hands-on tool usage — Claude Pro and Microsoft
 *    Copilot.
 *
 * This is static, data-driven content — no database for the content itself
 * (admin-authored edits/creations/deletions layer on top at render time, see
 * src/lib/content-resolver.ts). The landing page and module pages render
 * straight from the TRACKS array below; per-user progress lives in aiverse_db.
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

/**
 * How a module counts toward the certificate (see src/lib/certificate.ts):
 *  - "required" — must be completed, no exceptions.
 *  - "half"     — completing roughly half of this bucket (across all tracks) is enough.
 *  - "optional" — completing a small fixed number of these (across all tracks) is enough.
 */
export type ModuleRequirement = 'required' | 'half' | 'optional';

export interface Module {
  /** url slug, e.g. "general-beginner-1" */
  id: string;
  /** "Part 1 of 10" */
  partLabel: string;
  part: number;
  title: string;
  tagline: string;
  requirement: ModuleRequirement;
  /** rough time to read + quiz */
  minutes: number;
  sections: ContentBlock[];
  quiz: QuizQuestion[];
}

export type TrackId =
  | 'general-beginner'
  | 'general-intermediate'
  | 'general-advanced'
  | 'technical-beginner'
  | 'technical-intermediate'
  | 'technical-advanced'
  | 'productivity';

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
   GENERAL TRACK — BEGINNER
   ══════════════════════════════════════════════════════════════════════ */

const generalBeginnerModules: Module[] = [
  {
    id: 'general-beginner-1',
    partLabel: 'Part 1 of 10',
    part: 1,
    title: 'What Is AI?',
    tagline: 'A five-minute primer on what artificial intelligence really means.',
    requirement: 'required',
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
    id: 'general-beginner-2',
    partLabel: 'Part 2 of 10',
    part: 2,
    title: 'Generative AI at Work',
    tagline: 'What generative AI is, how it works, and how to actually use it well.',
    requirement: 'required',
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
    id: 'general-beginner-3',
    partLabel: 'Part 3 of 10',
    part: 3,
    title: 'Using AI Responsibly',
    tagline: 'The ethics questions every team should ask before leaning on AI.',
    requirement: 'required',
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
  {
    id: 'general-beginner-4',
    partLabel: 'Part 4 of 10',
    part: 4,
    title: 'AI vs. Machine Learning vs. Deep Learning',
    tagline: 'The three terms people mix up constantly — and how they actually nest inside each other.',
    requirement: 'required',
    minutes: 9,
    sections: [
      {
        kind: 'lead',
        text: 'AI, machine learning, and deep learning are not three separate things — they are three circles inside each other.',
        body: 'People use "AI," "machine learning," and "deep learning" interchangeably, but they mean different things. This video breaks down how each concept relates to the others using plain-language definitions and simple examples, no math required.',
      },
      {
        kind: 'video',
        youtubeId: 'TnPTW1g7Xn0',
        heading: 'Watch: AI vs Machine Learning vs Deep Learning: EXPLAINED SIMPLY (~7 min)',
        caption: 'Ram N Java (~7 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'AI is the big umbrella', body: 'Artificial Intelligence is the broad idea of machines performing tasks that normally require human intelligence — it includes far more than just learning from data.' },
          { title: 'Machine learning is a subset of AI', body: 'Machine learning is a specific approach to AI where a system improves its performance by learning patterns from data, rather than following hand-written rules.' },
          { title: 'Deep learning is a subset of machine learning', body: 'Deep learning uses layered, brain-inspired structures called neural networks to find much more complex patterns, especially in images, audio, and language.' },
          { title: 'Nested circles, not separate boxes', body: 'The clearest way to remember the relationship: AI is the outer circle, machine learning is inside it, and deep learning is inside machine learning.' },
          { title: 'Why the distinction matters at work', body: 'Knowing which term applies helps you understand what a tool can realistically do — a "deep learning" claim implies data-hungry pattern recognition, not general reasoning.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'According to the video, which best describes the relationship between AI, machine learning, and deep learning?', options: ['They are three unrelated fields', 'Deep learning contains machine learning, which contains AI', 'AI contains machine learning, which contains deep learning', 'They are three names for the same thing'], answer: 2, explanation: 'AI is the broadest category; machine learning is one approach within AI; deep learning is a more specialized technique within machine learning.' },
      { prompt: 'What is machine learning, as explained in the video?', options: ['A robot that can move on its own', 'A system that improves by learning patterns from data instead of fixed rules', 'Any computer program that runs automatically', 'A type of computer hardware'], answer: 1, explanation: 'Machine learning systems get better at a task by learning from data rather than being explicitly programmed with every rule.' },
      { prompt: 'What makes deep learning different from other machine learning approaches?', options: ['It never needs any data', 'It uses layered, brain-inspired neural networks to find complex patterns', 'It only works on numbers, never images or text', 'It is a completely different field from machine learning'], answer: 1, explanation: 'Deep learning relies on multi-layered neural networks, which allow it to handle especially complex patterns like those found in images or language.' },
      { prompt: 'True or false: All artificial intelligence is powered by deep learning.', options: ['True', 'False', 'Only in recent years', 'Only for image tasks'], answer: 1, explanation: 'AI is a broad field; many AI systems use simple rules or basic machine learning, not deep learning at all.' },
      { prompt: 'Why does the video use the "nested circles" image to explain these terms?', options: ['To show they are all equally sized', 'To show each term is a smaller, more specific piece inside a bigger one', 'To show they compete with each other', 'To show they were invented in the same year'], answer: 1, explanation: 'The nested-circle image communicates that each term is a specific subset of the one before it, not a separate or competing category.' },
      { prompt: 'Why does it matter, at work, whether a tool is described as "AI" versus specifically "deep learning"?', options: ['It doesn’t matter at all', 'It tells you roughly what kind of data and pattern-recognition the tool depends on', 'Deep learning tools never need data', 'AI tools are always more advanced than deep learning tools'], answer: 1, explanation: 'The specific term hints at how the tool works — a deep learning claim implies it depends on learning patterns from large amounts of data.' },
    ],
  },
  {
    id: 'general-beginner-5',
    partLabel: 'Part 5 of 10',
    part: 5,
    title: 'How Chatbots Actually Work',
    tagline: 'What is happening behind that little chat window when you type a message.',
    requirement: 'half',
    minutes: 7,
    sections: [
      {
        kind: 'lead',
        text: 'That chat window on a website or app is not magic — it is a program designed to understand and respond to what you type.',
        body: 'This video gives a beginner-friendly explanation of what chatbots are, how they process what you type, and why businesses use them for support, sales, and answering common questions.',
      },
      {
        kind: 'video',
        youtubeId: 'IOByB-eow3E',
        heading: 'Watch: What Are Chatbots? Beginner-Friendly Explanation (~5 min)',
        caption: 'LearnFree (~5 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'A chatbot is software that simulates conversation', body: 'It is a program built to understand a message you type and generate a relevant reply, standing in for a live human.' },
          { title: 'Businesses use chatbots to save time', body: 'Companies deploy chatbots to answer common questions, handle support requests, and free up human staff for harder problems.' },
          { title: 'Older chatbots followed scripts', body: 'Early chatbots matched your words to a fixed list of pre-written responses, which is why they sometimes felt robotic or missed the point.' },
          { title: 'Newer chatbots understand context better', body: 'Modern AI-powered chatbots can follow the thread of a conversation and respond more naturally, not just react to single keywords.' },
          { title: 'A chatbot is still a tool, not a person', body: 'It has no independent understanding of you — it only responds based on patterns it was trained or programmed to recognize.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'In simple terms, what is a chatbot?', options: ['A physical robot', 'A program designed to simulate a conversation with you', 'A type of computer virus', 'A search engine'], answer: 1, explanation: 'A chatbot is software built to hold a text (or voice) conversation, standing in for a human.' },
      { prompt: 'Why do many businesses use chatbots?', options: ['To make their website slower', 'To answer common questions and support requests without a human every time', 'Because customers dislike talking to real people', 'To replace their entire website'], answer: 1, explanation: 'Chatbots handle routine, repetitive questions so human staff can focus on more complex issues.' },
      { prompt: 'How did older, script-based chatbots typically work?', options: ['They understood full context perfectly', 'They matched your words against a fixed set of pre-written responses', 'They wrote brand-new sentences no one had ever seen', 'They connected directly to a human every time'], answer: 1, explanation: 'Early chatbots relied on rigid scripts and keyword matching, which is why they often gave off-topic or repetitive answers.' },
      { prompt: 'What is a key advantage of newer, AI-powered chatbots over older script-based ones?', options: ['They never make mistakes', 'They can better follow the context of an ongoing conversation', 'They require no data at all', 'They are always free to use'], answer: 1, explanation: 'AI-powered chatbots can track the flow of a conversation, making responses feel more natural than rigid script-matching.' },
      { prompt: 'True or false: A chatbot has genuine personal understanding of the user it is talking to.', options: ['True', 'False', 'Only premium chatbots do', 'Only chatbots on phones do'], answer: 1, explanation: 'A chatbot responds based on patterns and training, not genuine personal understanding of who you are.' },
      { prompt: 'Which of these is a realistic everyday use for a chatbot, per the video?', options: ['Physically delivering a package', 'Answering a customer’s question about store hours', 'Repairing hardware', 'Driving a car'], answer: 1, explanation: 'Chatbots are commonly used for simple, common questions like hours, order status, or basic troubleshooting.' },
    ],
  },
  {
    id: 'general-beginner-6',
    partLabel: 'Part 6 of 10',
    part: 6,
    title: 'AI in Your Everyday Apps',
    tagline: 'The AI you are already using without noticing — from streaming recommendations to maps.',
    requirement: 'optional',
    minutes: 5,
    sections: [
      {
        kind: 'lead',
        text: 'You probably use AI a dozen times a day without ever calling it "AI."',
        body: 'This short video from Google walks through familiar, everyday examples of AI at work — from what shows up on your streaming home screen to how your phone recognizes your face and how a map app finds the fastest route.',
      },
      {
        kind: 'video',
        youtubeId: 'oJC8VIDSx_Q',
        heading: 'Watch: How AI Works in Everyday Life (~3 min)',
        caption: 'Google (~3 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Streaming recommendations run on AI', body: 'Services like music and video streaming apps use AI to learn what you watch or listen to and suggest what you might like next.' },
          { title: 'Smart home devices learn your habits', body: 'Thermostats and lighting systems can use AI to notice patterns in how you use them and adjust automatically.' },
          { title: 'Face recognition uses AI to build a 3D model', body: 'Features like face-unlock work by having AI construct and compare a model of your face rather than just a flat photo.' },
          { title: 'Maps apps use AI for real-time routing', body: 'Navigation apps process live traffic data with AI to suggest the fastest route as conditions change.' },
          { title: 'The common thread: learning from data to make a prediction', body: 'In every example, the AI is looking at data (your habits, traffic, your face) and predicting what will best serve you next.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What is the main point of this video?', options: ['AI is rare and only used by scientists', 'AI already shows up in many ordinary apps people use daily', 'AI is only used for entertainment', 'AI cannot be used on phones'], answer: 1, explanation: 'The video’s point is that AI is already embedded in common, everyday technology most people use without thinking about it.' },
      { prompt: 'How do streaming services typically use AI, per the video?', options: ['To physically produce shows', 'To learn your habits and recommend what to watch or listen to next', 'To slow down playback', 'To delete your history'], answer: 1, explanation: 'Streaming platforms use AI to analyze viewing/listening habits and generate personalized recommendations.' },
      { prompt: 'How does AI help with face-unlock features, as described?', options: ['It stores a photo and compares pixels only', 'It builds and compares a 3D model of your face', 'It uses your fingerprint instead', 'It asks you security questions'], answer: 1, explanation: 'The video explains that face-recognition features use AI to construct a 3D model of your face for comparison, not just a flat image.' },
      { prompt: 'How do smart home devices like thermostats use AI?', options: ['They require you to manually set every option every day', 'They learn usage patterns and adjust automatically', 'They only work with a written schedule', 'They cannot be controlled remotely'], answer: 1, explanation: 'Smart home devices use AI to recognize patterns in how they are used and adjust settings automatically over time.' },
      { prompt: 'What common thread runs through all the AI examples in this video?', options: ['They all require a technical degree to use', 'They all use data about you or your surroundings to predict something useful', 'They only work once a year', 'They all replace human jobs entirely'], answer: 1, explanation: 'Every example — recommendations, smart homes, face-unlock, maps — relies on AI learning from data to make a helpful prediction.' },
      { prompt: 'Which of the following is given as an example of AI in everyday life in the video?', options: ['A real-time traffic-aware navigation route', 'A calculator app', 'A basic alarm clock with no learning features', 'A printed paper map'], answer: 0, explanation: 'The video specifically calls out navigation apps using AI to process real-time traffic and suggest routes.' },
    ],
  },
  {
    id: 'general-beginner-7',
    partLabel: 'Part 7 of 10',
    part: 7,
    title: 'A Brief History of AI',
    tagline: 'From wartime code-breaking to today’s chatbots, in about six minutes.',
    requirement: 'optional',
    minutes: 8,
    sections: [
      {
        kind: 'lead',
        text: 'AI is not a brand-new idea — it has been decades in the making, with big leaps and long quiet stretches in between.',
        body: 'This fast-paced overview traces the milestones of artificial intelligence, from its early theoretical roots through periods of slow progress to the recent explosion of tools like AI chatbots, giving you a sense of how we got here.',
      },
      {
        kind: 'video',
        youtubeId: 'lomIbAbdqzk',
        heading: 'Watch: Complete History of AI in 6 minutes (~6 min)',
        caption: 'The Cloud Girl (~6 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'AI has roots going back decades', body: 'Foundational ideas about machine intelligence trace back to early computing pioneers working on problems like code-breaking and computation theory.' },
          { title: 'Progress has not been a straight line', body: 'AI research has gone through cycles of excitement followed by periods of reduced funding and interest, often called "AI winters," when progress slowed.' },
          { title: 'Earlier systems relied on hand-written rules', body: 'Before modern machine learning, many AI systems worked from explicit, hand-coded rules rather than learning from data.' },
          { title: 'Machine learning and deep learning fueled a resurgence', body: 'Advances in learning from data, plus much more computing power, drove a major renewed wave of AI progress in recent decades.' },
          { title: 'The current moment is defined by generative AI', body: 'Recent years have brought widely-used AI tools that can generate text, images, and conversation, bringing AI into daily public use.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'According to the video, does AI research history move in a straight, steady line of progress?', options: ['Yes, it has always improved steadily', 'No, it has included slow periods sometimes called "AI winters"', 'AI research only started in the last five years', 'AI research has only ever declined'], answer: 1, explanation: 'The video covers cycles of hype and slowdown in AI history, including periods known as "AI winters."' },
      { prompt: 'How did many earlier AI systems operate, before modern machine learning became common?', options: ['They learned entirely from massive datasets', 'They followed hand-written, explicit rules', 'They used quantum computers', 'They had no computer involved at all'], answer: 1, explanation: 'Earlier AI approaches often relied on rules explicitly written by programmers, rather than learning patterns from data.' },
      { prompt: 'What helped drive the more recent resurgence in AI capability, per the video?', options: ['A ban on computers', 'Advances in machine learning and deep learning plus more computing power', 'The invention of the telephone', 'A decrease in available data'], answer: 1, explanation: 'The video credits improvements in learning-from-data techniques and increased computing power for AI’s recent acceleration.' },
      { prompt: 'What characterizes the most recent chapter of AI history described in the video?', options: ['AI became less available to the public', 'The rise of generative AI tools that produce text, images, and conversation', 'AI research stopped entirely', 'AI was banned from business use'], answer: 1, explanation: 'The video ends on the current era, marked by generative AI tools becoming widely available and used.' },
      { prompt: 'True or false: The video suggests AI is an entirely new field that only emerged in the last few years.', options: ['True', 'False', 'It started exactly 6 years ago', 'It has no clear origin'], answer: 1, explanation: 'The video traces AI’s roots back decades, showing it is a much older field than many assume.' },
      { prompt: 'What is an "AI winter," as referenced in the history covered by the video?', options: ['A season when AI conferences are held', 'A period of reduced interest, funding, or progress in AI research', 'A type of cold-weather robot', 'A yearly AI awards show'], answer: 1, explanation: 'An "AI winter" refers to a historical period when enthusiasm, funding, and progress in AI slowed significantly.' },
    ],
  },
  {
    id: 'general-beginner-8',
    partLabel: 'Part 8 of 10',
    part: 8,
    title: 'Common AI Myths — Debunked',
    tagline: 'Separating what AI actually does from what movies and headlines make you think it does.',
    requirement: 'half',
    minutes: 6,
    sections: [
      {
        kind: 'lead',
        text: 'A lot of what people believe about AI comes from science fiction, not from how the technology actually works.',
        body: 'This video unpacks some of the most common misconceptions about artificial intelligence — clearing up confusion about what AI actually is, and is not, capable of.',
      },
      {
        kind: 'video',
        youtubeId: 'RNzqQG4q18A',
        heading: 'Watch: Misconceptions About AI (~4 min)',
        caption: 'Mental Floss (~4 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'AI is not the same as humanoid robots', body: 'Most AI runs quietly in the background of software and services — it rarely looks like the human-like robots portrayed in movies.' },
          { title: 'AI does not have feelings or consciousness', body: 'Even conversational AI that sounds personable does not genuinely feel emotions — it generates responses based on patterns, not inner experience.' },
          { title: 'AI is not one single, uniform technology', body: 'The term "AI" covers a wide range of different techniques and tools, not one single system that does everything.' },
          { title: 'AI is not a total mystery or "black box"', body: 'While complex, AI systems are built on understandable methods and can be explained, tested, and evaluated by the people who build them.' },
          { title: 'Everyday familiarity does not equal deep understanding', body: 'Many people use AI daily without fully understanding what it is doing behind the scenes, which is exactly why misconceptions spread easily.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What common myth does the video address about AI’s appearance?', options: ['That AI is always invisible', 'That AI is basically the same as human-like robots from movies', 'That AI only exists on phones', 'That AI cannot be used by companies'], answer: 1, explanation: 'The video challenges the popular image of AI as humanoid robots, noting most AI runs unseen in the background.' },
      { prompt: 'Does AI, including chatbots that sound friendly, actually have feelings?', options: ['Yes, all AI has emotions', 'No, it generates responses based on patterns, not genuine emotion', 'Only expensive AI has feelings', 'Only AI used in games has feelings'], answer: 1, explanation: 'The video clarifies that AI does not genuinely feel emotions, even when its output sounds personable or empathetic.' },
      { prompt: 'According to the video, is "AI" one single, uniform technology?', options: ['Yes, all AI works exactly the same way', 'No, "AI" covers a wide range of different techniques and tools', 'AI is just another word for the internet', 'AI refers only to chatbots'], answer: 1, explanation: 'The term "AI" is an umbrella that covers many distinct techniques and applications, not one uniform system.' },
      { prompt: 'Is AI a complete, unexplainable mystery even to the people who build it?', options: ['Yes, no one understands it at all', 'No, it is complex but built on methods that can be explained and evaluated', 'Only some AI can be explained', 'AI explains itself automatically to everyone'], answer: 1, explanation: 'The video pushes back on the "black box" myth, noting AI systems can be understood and explained by their developers.' },
      { prompt: 'Why does the video suggest AI misconceptions spread so easily?', options: ['Because AI is banned in most countries', 'Because many people use AI daily without understanding what it is doing behind the scenes', 'Because AI is too expensive for most people', 'Because there is no media coverage of AI'], answer: 1, explanation: 'Frequent, casual use without deeper understanding creates fertile ground for myths and misconceptions to take hold.' },
      { prompt: 'Which of these is presented in the video as a myth rather than a fact?', options: ['AI can process large amounts of data', 'AI is essentially the same thing as a conscious, feeling robot', 'AI is used in many everyday apps', 'AI techniques vary widely'], answer: 1, explanation: 'The idea that AI is a conscious, feeling, robot-like being is called out specifically as a misconception, not a fact.' },
    ],
  },
  {
    id: 'general-beginner-9',
    partLabel: 'Part 9 of 10',
    part: 9,
    title: 'Prompt Basics: How to Talk to an AI Chatbot',
    tagline: 'The simple habits that turn a vague question into a genuinely useful AI answer.',
    requirement: 'required',
    minutes: 8,
    sections: [
      {
        kind: 'lead',
        text: 'What you type into an AI chatbot has a big effect on what you get back — and getting better answers is a learnable skill.',
        body: 'This step-by-step walkthrough shows what it actually looks like to have a conversation with an AI chatbot: how to phrase your first message, how to follow up, and how to refine a question that did not get you what you needed the first time.',
      },
      {
        kind: 'video',
        youtubeId: 'eSjtzw9HLR4',
        heading: 'Watch: How To Have a Conversation With ChatGPT (Step By Step) (~6 min)',
        caption: 'KnowledgeBase (~6 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Starting is as simple as typing a question', body: 'There is no special syntax required to begin — you can start by typing a plain question or request, just like texting a person.' },
          { title: 'It is a back-and-forth conversation, not a single search', body: 'Unlike a search engine, an AI chatbot remembers what you already discussed, so you can ask follow-up questions naturally.' },
          { title: 'Being specific gets you a more useful answer', body: 'Vague requests get vague answers — adding detail about your goal, audience, or format helps the chatbot respond usefully.' },
          { title: 'You can refine an answer instead of starting over', body: 'If a response is not quite right, you can ask the chatbot to adjust it (shorter, simpler, different tone) rather than rewriting your whole question.' },
          { title: 'Treat the first answer as a draft', body: 'The step-by-step approach shown treats the first response as a starting point to be improved through follow-up, not a final answer.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'How do you start a conversation with an AI chatbot, according to the video?', options: ['You need to write special code', 'You simply type a plain question or request', 'You must upload a document first', 'You need a technical account only IT can create'], answer: 1, explanation: 'The video shows that starting a chatbot conversation is as simple as typing a plain-language question or request.' },
      { prompt: 'How is chatting with an AI chatbot different from using a search engine, per the video?', options: ['There is no difference at all', 'The chatbot remembers earlier parts of the conversation, so you can ask natural follow-up questions', 'A chatbot only accepts one question ever', 'A chatbot cannot answer questions'], answer: 1, explanation: 'Unlike a one-shot search query, a chatbot conversation carries context forward, allowing natural follow-ups.' },
      { prompt: 'What does the video suggest happens when you give the chatbot a vague request?', options: ['It always gives the perfect answer anyway', 'You tend to get a vague or generic answer back', 'The chatbot refuses to respond', 'It automatically asks you ten clarifying questions'], answer: 1, explanation: 'Vague input tends to produce vague or generic output; adding specifics helps focus the response.' },
      { prompt: 'If a chatbot’s first answer is not quite right, what does the video recommend?', options: ['Give up and use a different tool entirely', 'Ask the chatbot to adjust the response, like making it shorter or simpler', 'Close the app and never try again', 'Report a bug to the chatbot maker'], answer: 1, explanation: 'The video shows that you can refine an answer through follow-up requests rather than starting the whole conversation over.' },
      { prompt: 'What mindset does the video encourage toward a chatbot’s first response?', options: ['Treat it as final and unchangeable', 'Treat it as a draft that can be improved through follow-up', 'Treat it as always wrong', 'Treat it as something to memorize word for word'], answer: 1, explanation: 'The video frames the first answer as a starting point you can iterate on, not a fixed final result.' },
      { prompt: 'Which of these best reflects the step-by-step approach shown in the video?', options: ['Ask one question and never follow up', 'Ask, review the answer, then refine with a follow-up if needed', 'Only use single words as prompts', 'Avoid giving any context ever'], answer: 1, explanation: 'The video walks through asking, reviewing the response, and refining it with follow-up messages as needed.' },
    ],
  },
  {
    id: 'general-beginner-10',
    partLabel: 'Part 10 of 10',
    part: 10,
    title: 'What Is a Large Language Model?',
    tagline: 'The plain-language explanation behind the tech powering tools like ChatGPT and Claude.',
    requirement: 'required',
    minutes: 15,
    sections: [
      {
        kind: 'lead',
        text: 'Every time you chat with a tool like ChatGPT or Claude, you are talking to something called a "large language model" — but what is that, really?',
        body: 'This video breaks down large language models in plain terms: what they are trained on, how they generate text, and why they can feel so conversational despite not actually "understanding" the way a person does.',
      },
      {
        kind: 'video',
        youtubeId: 'UgvrrHc5BRY',
        heading: 'Watch: Large Language Models Explained Simply (~13 min)',
        caption: 'The Gradient Descent (~13 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'An LLM is trained on huge amounts of text', body: 'Large language models learn patterns of language by processing enormous collections of text data during training.' },
          { title: 'At its core, an LLM predicts the next piece of text', body: 'The fundamental mechanism is predicting the most likely next word (or word-piece) given everything written so far.' },
          { title: '"Large" refers to scale', body: 'The "large" in large language model refers to the huge number of parameters and the massive amount of training data involved, not the size of any single file you download.' },
          { title: 'Fluency is not the same as true understanding', body: 'An LLM can produce fluent, confident-sounding text without genuinely "knowing" facts the way a person does — this is part of why it can sometimes state incorrect things confidently.' },
          { title: 'LLMs power many tools people use today', body: 'Chat assistants like ChatGPT and Claude are built on top of large language models, using this next-word-prediction ability to hold conversations.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What is a large language model trained on, according to the video?', options: ['A small handwritten rulebook', 'Enormous amounts of text data', 'Only numerical data', 'Video footage only'], answer: 1, explanation: 'LLMs learn language patterns by processing massive collections of text during training.' },
      { prompt: 'What is the core mechanism an LLM uses to generate a response?', options: ['Searching a fixed database of pre-written answers', 'Predicting the most likely next word given everything written so far', 'Randomly picking words with no pattern', 'Copying answers directly from a single source'], answer: 1, explanation: 'At its core, an LLM works by predicting the next piece of text based on the preceding context.' },
      { prompt: 'What does the "large" in "large language model" refer to?', options: ['The physical size of the computer running it', 'The huge scale of parameters and training data involved', 'The number of buttons in the chat interface', 'How long each response takes to generate'], answer: 1, explanation: '"Large" describes the massive scale of the model’s parameters and the training data used, not any physical hardware size.' },
      { prompt: 'Does producing fluent, confident-sounding text mean an LLM truly "understands" facts the way a person does?', options: ['Yes, fluency always means true understanding', 'No, an LLM can sound confident while still being factually wrong', 'LLMs never make mistakes', 'Fluency is impossible for LLMs'], answer: 1, explanation: 'The video explains that fluent output is not the same as genuine understanding, which is part of why LLMs can confidently state incorrect information.' },
      { prompt: 'Which well-known AI tools are described as being built on top of large language models?', options: ['Spreadsheet software', 'Chat assistants like ChatGPT and Claude', 'Basic calculators', 'Traditional search engines from the 1990s'], answer: 1, explanation: 'Conversational AI assistants such as ChatGPT and Claude are built using large language models as their core technology.' },
      { prompt: 'True or false: An LLM generates a whole response at once by looking up a complete pre-written answer.', options: ['True', 'False', 'Only for short questions', 'Only in older versions'], answer: 1, explanation: 'An LLM generates text incrementally by predicting the next likely word/piece repeatedly, not by looking up a full pre-written answer.' },
      { prompt: 'Why might an LLM occasionally give an incorrect answer while sounding very confident?', options: ['It is intentionally trying to deceive the user', 'It generates fluent-sounding text from patterns, which is not the same as verified factual knowledge', 'It always double-checks facts before responding', 'It only happens with old versions of the software'], answer: 1, explanation: 'Because an LLM works by predicting plausible-sounding text rather than verifying facts, it can state incorrect information with apparent confidence.' },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════
   GENERAL TRACK — INTERMEDIATE
   ══════════════════════════════════════════════════════════════════════ */

const generalIntermediateModules: Module[] = [
  {
    id: 'general-intermediate-1',
    partLabel: 'Part 1 of 10',
    part: 1,
    title: 'Prompt Engineering: Four Ways to Talk to an AI',
    tagline: 'Beyond "write a good prompt" — the actual named techniques that make LLMs more accurate.',
    requirement: 'required',
    minutes: 9,
    sections: [
      {
        kind: 'lead',
        text: 'Good prompting is not one trick — it is a toolbox.',
        body: 'You already know that clear prompts get better answers. This module goes one level deeper: four named prompt-engineering methods that professionals use to get more accurate, less "made up" answers out of large language models, and when to reach for each one.',
      },
      {
        kind: 'video',
        youtubeId: '1c9iyoVIwDs',
        heading: 'Watch: 4 Methods of Prompt Engineering (~7 min)',
        caption: 'IBM Technology (~7 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Retrieval Augmented Generation (RAG)', body: 'Ground the model’s answer in real external documents or data instead of relying only on what it memorized during training.' },
          { title: 'Chain-of-Thought (CoT)', body: 'Ask the model to reason step by step before giving a final answer, which improves accuracy on multi-step problems.' },
          { title: 'ReAct (Reason + Act)', body: 'The model alternates between reasoning and taking an action (like a tool call), then observes the result and iterates.' },
          { title: 'Directional Stimulus Prompting (DSP)', body: 'Give the model small hints or cues that steer it toward the kind of output you want, without writing the whole answer for it.' },
          { title: 'Methods can be combined', body: 'These are not mutually exclusive — real systems often stack several of these techniques together for better, more reliable results.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'According to the video, how many distinct prompt engineering methods are explained?', options: ['Two', 'Three', 'Four', 'Six'], answer: 2, explanation: 'The video walks through four methods: RAG, Chain-of-Thought, ReAct, and Directional Stimulus Prompting.' },
      { prompt: 'What does "RAG" stand for in this context?', options: ['Rapid AI Generation', 'Retrieval Augmented Generation', 'Reasoning and Guidance', 'Response Adjustment Grid'], answer: 1, explanation: 'RAG grounds a model’s response in retrieved external documents or data rather than relying purely on memorized training data.' },
      { prompt: 'Chain-of-Thought prompting primarily helps with which kind of task?', options: ['Image generation', 'Multi-step reasoning problems', 'Formatting emails', 'Translating languages faster'], answer: 1, explanation: 'By asking the model to reason step by step, Chain-of-Thought improves performance on problems that require multiple logical steps.' },
      { prompt: 'What is distinctive about the ReAct method?', options: ['It only works on images', 'It combines reasoning with taking an action, then observing the result', 'It requires no prompt at all', 'It is exclusive to coding tasks'], answer: 1, explanation: 'ReAct (Reason + Act) has the model alternate between reasoning and acting (e.g., calling a tool), then use the observed result to continue.' },
      { prompt: 'Directional Stimulus Prompting works by:', options: ['Deleting parts of the prompt', 'Giving the model small steering hints toward a desired output', 'Forcing the model to answer in one word', 'Disabling the model’s reasoning'], answer: 1, explanation: 'DSP nudges the model with small cues or hints rather than writing out the full desired answer.' },
      { prompt: 'Can these four methods be used together in the same system?', options: ['No, only one can be used at a time', 'Yes, the video notes they can be combined', 'Only RAG and CoT are compatible', 'Only in image-generation models'], answer: 1, explanation: 'The video explicitly notes that these techniques can be combined for stronger results.' },
      { prompt: 'One motivation behind using structured prompting methods like these is to:', options: ['Make the model slower on purpose', 'Reduce hallucinated or inaccurate answers', 'Remove the need for any human review', 'Make prompts longer for no reason'], answer: 1, explanation: 'These methods exist largely to improve accuracy and reduce the chance of the model confidently stating something false.' },
    ],
  },
  {
    id: 'general-intermediate-2',
    partLabel: 'Part 2 of 10',
    part: 2,
    title: 'Why AI Chatbots Sometimes Make Things Up',
    tagline: 'Hallucinations explained: why a confident-sounding AI answer can still be wrong.',
    requirement: 'required',
    minutes: 7,
    sections: [
      {
        kind: 'lead',
        text: 'Confident is not the same as correct.',
        body: 'One of the most important things to understand about AI chatbots is that they can state false information with total confidence. This is called a "hallucination." This module explains why it happens and how to spot it.',
      },
      {
        kind: 'video',
        youtubeId: '005JLRt3gXI',
        heading: 'Watch: Why do AI models hallucinate? (~5 min)',
        caption: 'Claude (Anthropic) (~5 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'What a hallucination is', body: 'A response that contains false or fabricated information, presented as if it were fact.' },
          { title: 'Filling in the gaps', body: 'Models can generate plausible-sounding content based on similar patterns in training data, even when they don’t actually "know" the answer.' },
          { title: 'Guessing is rewarded', body: 'Standard training and evaluation can reward a confident guess over an honest "I don’t know," which encourages hallucination.' },
          { title: 'Tactics to spot it', body: 'The video gives practical signs to watch for that suggest an answer may be fabricated rather than grounded.' },
          { title: 'Not unique to one product', body: 'Hallucination is a general property of how today’s large language models work, not a bug limited to a single chatbot.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'How does the video define an AI "hallucination"?', options: ['A visual glitch in an image generator', 'A response containing false or fabricated information presented as fact', 'A crash of the AI system', 'A slow response time'], answer: 1, explanation: 'A hallucination is fabricated or false content that the model presents confidently as if it were true.' },
      { prompt: 'Why do models sometimes "fill in the gaps" incorrectly?', options: ['They intentionally lie to users', 'They generate plausible content based on patterns in training data even without certain knowledge', 'They are programmed with false facts on purpose', 'They only hallucinate when the internet is down'], answer: 1, explanation: 'Models can produce text that sounds right based on similar contexts seen during training, even when it isn’t factually grounded.' },
      { prompt: 'What training dynamic does the video point to as a contributor to hallucination?', options: ['Training rewards guessing over acknowledging uncertainty', 'Training only uses images, never text', 'Models are never evaluated after training', 'Hallucination is caused by slow internet speeds'], answer: 0, explanation: 'Standard training and evaluation can reward confident guesses more than honest expressions of uncertainty, nudging models toward hallucination.' },
      { prompt: 'What does the video offer to help viewers deal with hallucinations in practice?', options: ['A way to permanently delete hallucinations from a model', 'Tactics to help spot hallucinations in conversation', 'A guarantee that hallucinations never happen again', 'A list of banned words'], answer: 1, explanation: 'The video gives practical tactics for noticing when an AI answer may be fabricated.' },
      { prompt: 'Is hallucination something specific to one particular chatbot product?', options: ['Yes, only one specific app hallucinates', 'No, it is a general behavior of how large language models currently work', 'Only image generators hallucinate', 'Only models trained before 2020 hallucinate'], answer: 1, explanation: 'Hallucination is a general characteristic of current large language model behavior, not isolated to a single product.' },
      { prompt: 'Why is a confident tone from an AI not a reliable sign that its answer is accurate?', options: ['Confidence always means accuracy', 'Models can generate fabricated content with the same fluent, confident tone as accurate content', 'AI systems never sound confident', 'Confidence is measured and shown as a percentage on screen'], answer: 1, explanation: 'Because hallucinated text is generated the same fluent way as accurate text, tone alone can’t tell you whether something is true.' },
    ],
  },
  {
    id: 'general-intermediate-3',
    partLabel: 'Part 3 of 10',
    part: 3,
    title: 'Multimodal AI: One Model, Many Kinds of Input',
    tagline: 'How modern AI systems handle text, images, and audio together, not separately.',
    requirement: 'half',
    minutes: 10,
    sections: [
      {
        kind: 'lead',
        text: 'Text, pictures, sound — the same underlying "language."',
        body: 'Early AI tools were built for one type of input at a time. Multimodal AI can take in and reason across text, images, and audio together. This module explains, at a conceptual level, how that is possible.',
      },
      {
        kind: 'video',
        youtubeId: 'J51oZYcNvP8',
        heading: 'Watch: What is Multimodal AI? How LLMs Process Text, Images, and More (~8 min)',
        caption: 'IBM Technology (~8 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'A shared representation', body: 'Text, images, and audio are all converted into the same kind of mathematical representation — embedding vectors — so a model can reason about them together.' },
          { title: 'Modular feature-fusion approach', body: 'One approach uses a separate encoder to extract features from, say, an image, then passes those features to the language model. It’s cheaper but can lose some information.' },
          { title: 'Native multimodality', body: 'A more advanced approach processes all data types together within one system from the start, rather than bolting modalities together.' },
          { title: 'Any-to-any generation', body: 'Native multimodal systems can potentially take in one type of input (e.g., text) and generate a different type of output (e.g., an image or audio).' },
          { title: 'Why it matters', body: 'Multimodal AI lets a single system "see," "read," and "hear," enabling richer real-world use cases than text-only models.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'According to the video, how do multimodal models handle different input types like text, images, and audio?', options: ['They use entirely separate, unconnected models for each', 'They convert all input types into a shared mathematical representation called embedding vectors', 'They only accept text and ignore the rest', 'They require the user to translate everything to text first'], answer: 1, explanation: 'The video explains that inputs of different types are converted into the same kind of embedding vector representation.' },
      { prompt: 'What is a tradeoff of the "modular feature-fusion" approach described in the video?', options: ['It is always more expensive than native multimodality', 'It is cheaper but can lose some information compared to native multimodality', 'It cannot process images at all', 'It only works for audio'], answer: 1, explanation: 'A separate encoder extracts features and hands them to the language model — cheaper, but potentially lossy compared to native multimodality.' },
      { prompt: 'What distinguishes "native multimodality" from the modular approach?', options: ['It processes all data types together within one unified system from the start', 'It refuses to process images', 'It is identical to the modular approach', 'It only works offline'], answer: 0, explanation: 'Native multimodal systems integrate all modalities together from the start, rather than combining separately processed features.' },
      { prompt: 'What does "any-to-any generation" refer to in the video?', options: ['Generating the exact same input back unchanged', 'Taking in one type of input and producing a different type of output, like text-to-image', 'Only generating text from text', 'A synonym for hallucination'], answer: 1, explanation: 'Any-to-any generation means a system can take input in one modality and produce output in another, such as generating an image from a text prompt.' },
      { prompt: 'Who presents this IBM Technology explainer, per the video?', options: ['Martin Keen', 'Sam Altman', 'Grant Sanderson', 'Jeff Bezos'], answer: 0, explanation: 'Martin Keen presents this IBM Technology video on multimodal AI.' },
      { prompt: 'Why is multimodal capability useful in real-world applications, per the video’s framing?', options: ['It has no practical benefit', 'It lets one system reason across text, images, and audio instead of needing separate single-purpose tools', 'It only matters for entertainment apps', 'It makes models slower with no upside'], answer: 1, explanation: 'A single multimodal system that can handle several input/output types together supports richer, more flexible use cases.' },
    ],
  },
  {
    id: 'general-intermediate-4',
    partLabel: 'Part 4 of 10',
    part: 4,
    title: 'AI in the Supply Chain',
    tagline: 'How AI is being applied to real supply chain and procurement operations.',
    requirement: 'half',
    minutes: 7,
    sections: [
      {
        kind: 'lead',
        text: 'Supply chains are leaving the spreadsheet.',
        body: 'For a company like ours that lives and dies by procurement and logistics, this is one of the most directly relevant applications of AI. This module looks at how organizations are applying AI to demand forecasting and supply chain visibility.',
      },
      {
        kind: 'video',
        youtubeId: 'dUWd2IFPQrM',
        heading: 'Watch: Put AI to work in supply chains (~5 min)',
        caption: 'IBM Technology (~5 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Out of spreadsheets, into the digital world', body: 'A major theme is moving supply chain management off legacy spreadsheets and disconnected applications and into connected digital systems.' },
          { title: 'Demand sensing', body: 'AI-driven demand sensing continuously "pulses" the market for changes in demand, aiming to predict shifts rather than just react to them.' },
          { title: 'Hybrid cloud + data + AI', body: 'The combination of hybrid cloud infrastructure, good data, and AI is presented as the foundation for new visibility and predictive insight.' },
          { title: 'Resilience against disruption', body: 'The goal is fortifying production and supply networks so organizations can better withstand and respond to disruptions.' },
          { title: 'Jumpstarting innovation', body: 'The video frames AI adoption in supply chain as a way to jumpstart innovation, not just cut costs.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What major shift does the video describe for supply chain management?', options: ['Moving away from all digital tools back to paper', 'Moving supply chain management out of spreadsheets and legacy applications into connected digital systems', 'Eliminating human involvement entirely', 'Replacing all suppliers with robots'], answer: 1, explanation: 'The video frames modern AI-driven supply chain management as a move away from spreadsheets and legacy tools toward connected digital systems.' },
      { prompt: 'What is "demand sensing," as described in the video?', options: ['A hardware sensor installed on trucks', 'An AI capability that continuously monitors the market to predict changes in demand', 'A method for detecting counterfeit goods', 'A way to measure warehouse temperature'], answer: 1, explanation: 'Demand sensing uses AI to continuously "pulse" the market for shifts in demand, aiming to predict rather than only react.' },
      { prompt: 'What combination does the video present as the foundation for new supply chain visibility and predictive insight?', options: ['Hybrid cloud, data, and AI', 'Spreadsheets and email alone', 'Manual audits only', 'Social media monitoring'], answer: 0, explanation: 'The video presents hybrid cloud infrastructure, quality data, and AI together as the foundation for improved visibility and prediction.' },
      { prompt: 'What business goal does the video associate with applying AI to supply chains?', options: ['Making supply chains less resilient on purpose', 'Fortifying production networks and improving resilience to disruption', 'Removing all forecasting from the process', 'Increasing reliance on spreadsheets'], answer: 1, explanation: 'A key goal described is strengthening (fortifying) production and supply networks to better withstand disruptions.' },
      { prompt: 'Beyond cost-cutting, how does the video frame the purpose of AI adoption in supply chains?', options: ['As purely a compliance requirement', 'As a way to jumpstart innovation', 'As irrelevant to business strategy', 'As only useful for marketing purposes'], answer: 1, explanation: 'The video frames AI in supply chains as a driver of innovation, not just an efficiency or cost play.' },
      { prompt: 'Which of these is most directly relevant to a company that manages procurement and expediting for oil-and-gas or energy-services clients?', options: ['AI-driven demand sensing and supply chain visibility', 'AI image generation for marketing art', 'Neural network internals for its own sake', 'Consumer chatbot design'], answer: 0, explanation: 'Demand forecasting and supply chain visibility apply directly to procurement, expediting, and logistics operations.' },
    ],
  },
  {
    id: 'general-intermediate-5',
    partLabel: 'Part 5 of 10',
    part: 5,
    title: 'AI, Machine Learning, Deep Learning, and Generative AI: What’s the Difference?',
    tagline: 'How models actually learn from data, and where each buzzword fits.',
    requirement: 'half',
    minutes: 12,
    sections: [
      {
        kind: 'lead',
        text: 'These terms are nested, not interchangeable.',
        body: 'AI, machine learning, deep learning, and generative AI get used almost interchangeably in casual conversation, but they describe nested layers of technology. This module untangles the terms and explains, intuitively, how models learn from data.',
      },
      {
        kind: 'video',
        youtubeId: 'qYNweeDHiyU',
        heading: 'Watch: AI, Machine Learning, Deep Learning and Generative AI Explained (~10 min)',
        caption: 'IBM Technology (~10 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'AI is the broadest category', body: 'Artificial intelligence is the overall field; machine learning, deep learning, and generative AI are all subsets within it.' },
          { title: 'Machine learning learns patterns from data', body: 'Instead of being explicitly programmed with rules, ML systems learn patterns from training data and use them to make predictions on new data.' },
          { title: 'Deep learning uses layered neural networks', body: 'Deep learning is a subset of machine learning that uses many-layered neural networks to learn more complex patterns.' },
          { title: 'Foundation models and generative AI', body: 'Foundation models are large, broadly-trained models that can be adapted to many tasks, and generative AI builds on them to create new content.' },
          { title: 'How this evolved over time', body: 'The video traces how these approaches built on one another historically, rather than appearing all at once.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'Per the video, what is the relationship between AI, machine learning, deep learning, and generative AI?', options: ['They are four unrelated, competing technologies', 'They are nested: AI is the broad field, with ML, deep learning, and generative AI as subsets within it', 'Generative AI came before machine learning', 'They are just different marketing names for the same exact thing'], answer: 1, explanation: 'The video presents these as nested categories, with each term describing a narrower slice within the broader field of AI.' },
      { prompt: 'How does the video describe machine learning’s core approach?', options: ['Systems are given explicit rules for every case by a programmer', 'Systems learn patterns from training data and apply them to new data', 'Systems only memorize exact past examples with no generalization', 'Systems require no data whatsoever'], answer: 1, explanation: 'Machine learning is described as learning patterns from data, rather than following hand-written rules for every scenario.' },
      { prompt: 'What makes deep learning different from machine learning in general?', options: ['Deep learning uses many-layered neural networks to learn more complex patterns', 'Deep learning never uses neural networks', 'Deep learning is unrelated to machine learning', 'Deep learning only works on numbers, never on data'], answer: 0, explanation: 'Deep learning is a subset of machine learning that specifically uses multi-layered neural networks.' },
      { prompt: 'What is a "foundation model," as discussed in the video?', options: ['A model trained on a single, narrow task only', 'A large, broadly-trained model that can be adapted to many different tasks', 'A model that cannot generate any new content', 'A purely rule-based expert system'], answer: 1, explanation: 'Foundation models are large models trained broadly enough to be adapted across many downstream tasks, including generative ones.' },
      { prompt: 'Who presents this IBM Technology video, per the video?', options: ['Jeff Crume', 'Sam Altman', 'Grant Sanderson', 'Rob Cushman'], answer: 0, explanation: 'Jeff Crume presents this IBM Technology explainer distinguishing AI, ML, deep learning, and generative AI.' },
      { prompt: 'Did these technologies appear all at once, according to the video?', options: ['Yes, they all emerged simultaneously with no relationship', 'No, the video traces how each approach built on the ones before it over time', 'The video does not mention any history', 'Generative AI predates machine learning entirely'], answer: 1, explanation: 'The video traces an evolution, showing how later approaches (like deep learning and generative AI) built on earlier ones.' },
    ],
  },
  {
    id: 'general-intermediate-6',
    partLabel: 'Part 6 of 10',
    part: 6,
    title: 'Five AI Risks That Can Get You Fired',
    tagline: 'The real security and governance pitfalls of using AI carelessly at work.',
    requirement: 'required',
    minutes: 11,
    sections: [
      {
        kind: 'lead',
        text: 'Using AI at work carries real risk if you don’t know the rules.',
        body: 'AI tools can make you more productive — or get you into serious trouble at work if used carelessly. This module covers five concrete, named risks that come up when employees use AI without governance in mind.',
      },
      {
        kind: 'video',
        youtubeId: '1m55T8xST9s',
        heading: 'Watch: Five AI Risks That Can Get You Fired—And How to Avoid Them (~9 min)',
        caption: 'IBM Technology (~9 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Shadow AI', body: 'Employees using AI tools for work without IT’s knowledge or approval, creating unmanaged risk.' },
          { title: 'Data leakage', body: 'A consequence of shadow AI: putting confidential company information into unvetted tools, where it can be stored insecurely or even absorbed into training data.' },
          { title: 'Hallucination laundering', body: 'Presenting AI-generated content that turns out to be false or fabricated as if it were verified, original work.' },
          { title: 'Prompt injection', body: 'A malicious technique where crafted input tricks an AI system into bypassing its intended safety instructions.' },
          { title: 'Unauthorized agentic AI', body: 'Employees deploying AI agents that autonomously interact with company systems, databases, or APIs without proper oversight.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What is "shadow AI," according to the video?', options: ['An AI model that only works at night', 'Employees using AI tools for work without their company’s knowledge or approval', 'A type of malware', 'A backup AI system used only in emergencies'], answer: 1, explanation: 'Shadow AI refers to unsanctioned use of AI tools by employees, outside IT’s visibility or approval.' },
      { prompt: 'How does the video connect shadow AI to data leakage?', options: ['They are unrelated risks', 'Shadow AI use can lead employees to input confidential data into unvetted tools, risking leakage', 'Data leakage only happens through email', 'Shadow AI prevents all data leakage'], answer: 1, explanation: 'When employees use unapproved AI tools, confidential information can end up stored insecurely or absorbed into a tool’s data, creating leakage risk.' },
      { prompt: 'What does the video call "hallucination laundering"?', options: ['A technical fix that removes hallucinations from a model', 'Presenting unverified, possibly fabricated AI content as one’s own verified work', 'A method for detecting hallucinations automatically', 'A type of data encryption'], answer: 1, explanation: 'Hallucination laundering is presenting AI-generated (and possibly false) content as verified original work without checking it.' },
      { prompt: 'What is "prompt injection," per the video?', options: ['A vaccine-style safety feature for AI', 'A malicious technique that crafts input to trick an AI into bypassing its safety instructions', 'A method for writing longer prompts', 'A tool for translating prompts into other languages'], answer: 1, explanation: 'Prompt injection is an attack where crafted input manipulates an AI system into ignoring its intended constraints.' },
      { prompt: 'What risk does "unauthorized agentic AI" describe?', options: ['Employees deploying AI agents that interact with company systems or APIs without proper oversight', 'A ban on all AI agent usage everywhere', 'AI agents that only draft emails', 'A risk that only applies to image generation'], answer: 0, explanation: 'This risk involves agents autonomously touching company systems, databases, or APIs without appropriate governance or approval.' },
      { prompt: 'What does the video recommend as a way organizations should manage these risks?', options: ['Ban all discussion of AI', 'Establish AI governance policies covering approved tools, usage rules, and permissible data', 'Ignore the risks since they are rare', 'Let every employee decide policy individually'], answer: 1, explanation: 'The video stresses the importance of governance policies that define approved tools, usage rules, and what data can be input.' },
      { prompt: 'Who presents this IBM Technology video, per the video?', options: ['Martin Keen', 'Grant Sanderson', 'Maya Murad', 'Chris Anderson'], answer: 0, explanation: 'Martin Keen, an IBM Master Inventor, presents this explainer on AI risks in the workplace.' },
    ],
  },
  {
    id: 'general-intermediate-7',
    partLabel: 'Part 7 of 10',
    part: 7,
    title: 'The Future of AI: A Conversation With Sam Altman',
    tagline: 'A live, unscripted look at where one of AI’s most influential leaders thinks the field is headed.',
    requirement: 'optional',
    minutes: 49,
    sections: [
      {
        kind: 'lead',
        text: 'Where is this all going?',
        body: 'Hear directly from OpenAI CEO Sam Altman in a live, probing conversation with TED’s Chris Anderson about the pace of AI progress, what tools like ChatGPT could become, and the open questions around safety, power, and control.',
      },
      {
        kind: 'video',
        youtubeId: '5MWT_doo68k',
        heading: 'Watch: OpenAI’s Sam Altman Talks ChatGPT, AI Agents and Superintelligence — Live at TED2025 (~47 min)',
        caption: 'TED (~47 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Rapid, ongoing growth', body: 'Altman discusses the scale and pace of growth in AI tools like ChatGPT since their public release.' },
          { title: 'AI as an "extension of ourselves"', body: 'He describes a vision where AI models become deeply integrated into how people think and work, rather than remaining a separate tool.' },
          { title: 'Safety, power, and moral authority', body: 'Chris Anderson presses Altman directly on accountability, safety practices, and who should hold power over increasingly capable AI systems.' },
          { title: 'The possibility of AI outpacing human intelligence', body: 'Altman reflects on a future where AI systems could exceed human intelligence in many domains, and what that could mean.' },
          { title: 'An unscripted, challenging interview', body: 'Unlike a polished keynote, this is a live back-and-forth where Altman is pushed on hard, specific questions in real time.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'Who interviews Sam Altman in this TED2025 conversation?', options: ['Chris Anderson, head of TED', 'Grant Sanderson', 'Martin Keen', 'Yoshua Bengio'], answer: 0, explanation: 'Chris Anderson, TED’s head, conducts a live, probing interview with Sam Altman.' },
      { prompt: 'What vision does Altman describe for how AI tools like ChatGPT could evolve?', options: ['Becoming extensions of ourselves, deeply integrated into how people think and work', 'Being discontinued entirely', 'Remaining unchanged forever', 'Becoming exclusively a hardware product'], answer: 0, explanation: 'Altman describes a future where AI models become deeply woven into daily thinking and work, not just a separate app.' },
      { prompt: 'What topics does Chris Anderson press Altman on during the interview?', options: ['Only Altman’s personal hobbies', 'Safety, power, and moral authority around increasingly capable AI', 'Exclusively OpenAI’s stock price', 'Only questions about image generation'], answer: 1, explanation: 'The conversation directly addresses accountability, safety, and who should hold power over advanced AI systems.' },
      { prompt: 'What future possibility does Altman reflect on regarding AI capability?', options: ['AI capabilities plateauing permanently at current levels', 'AI systems potentially outpacing human intelligence in many domains', 'AI being banned worldwide', 'AI models shrinking to run only on paper'], answer: 1, explanation: 'Altman discusses a future where AI could exceed human intelligence, and the implications of that trajectory.' },
      { prompt: 'What format is this talk, compared to a typical rehearsed keynote?', options: ['A pre-recorded, scripted monologue with no questions', 'A live, unscripted interview with direct, challenging questions', 'A silent video with only text captions', 'A panel of five unrelated speakers'], answer: 1, explanation: 'This is a live conversation format, not a scripted keynote, with Altman fielding direct and sometimes uncomfortable questions in real time.' },
      { prompt: 'What organization does Sam Altman lead, as referenced in the video title?', options: ['OpenAI', 'IBM', 'Google DeepMind', 'Anthropic'], answer: 0, explanation: 'The video title identifies Altman as OpenAI’s CEO.' },
    ],
  },
  {
    id: 'general-intermediate-8',
    partLabel: 'Part 8 of 10',
    part: 8,
    title: 'The Rise of Generative AI for Business',
    tagline: 'Zooming out: why generative AI is being called a defining, industrial-revolution-scale moment for business.',
    requirement: 'half',
    minutes: 13,
    sections: [
      {
        kind: 'lead',
        text: 'How did we get here, and what comes next for business?',
        body: 'This closing module zooms out from any one technique or risk to the bigger picture: how generative AI emerged, how enterprises are approaching adoption, and why getting the right platform and use cases in place matters so much right now.',
      },
      {
        kind: 'video',
        youtubeId: 's4r5gXdSVPM',
        heading: 'Watch: The Rise of Generative AI for Business (~11 min)',
        caption: 'IBM Technology (~11 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: '"Advanced technology" is math and science, not magic', body: 'The video opens by reframing AI as the product of math and science rather than something mysterious, before tracing its history.' },
          { title: 'How we got here', body: 'It walks through the history of AI leading up to today’s generative AI moment.' },
          { title: 'Different approaches to applying generative AI', body: 'The video presents multiple approaches enterprises can take when adopting generative AI, rather than one single path.' },
          { title: 'The right platform jumpstarts value', body: 'An AI platform matched to your specific use cases is presented as key to getting real business value quickly.' },
          { title: 'A "defining moment"', body: 'The video frames this period as comparable to a new industrial revolution, where the right investments can create a multiplier effect for a business.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'How does the video initially reframe "advanced technology" like AI?', options: ['As indistinguishable from magic, with no explanation possible', 'As the product of math and science, not magic', 'As something that cannot be understood by anyone', 'As purely a marketing term with no substance'], answer: 1, explanation: 'The video opens by asserting that AI is grounded in math and science rather than being unexplainable magic.' },
      { prompt: 'What historical approach does the video take before discussing generative AI’s future?', options: ['It ignores history entirely', 'It walks through the history of AI leading up to the current generative AI moment', 'It only discusses events from the last week', 'It focuses solely on hardware manufacturing history'], answer: 1, explanation: 'The video traces AI’s history to build context for understanding generative AI’s current moment.' },
      { prompt: 'Does the video present a single fixed path for enterprises adopting generative AI?', options: ['Yes, there is exactly one correct approach for every company', 'No, it presents different approaches to applying generative AI', 'It says enterprises should not adopt generative AI at all', 'It only discusses adoption for individuals, not enterprises'], answer: 1, explanation: 'The video discusses multiple possible approaches to generative AI adoption rather than a single mandated path.' },
      { prompt: 'What does the video say helps an enterprise get faster business value from generative AI?', options: ['Avoiding any AI platform entirely', 'An AI platform targeted to the organization’s specific use cases', 'Using the most expensive tool regardless of fit', 'Waiting several years before starting'], answer: 1, explanation: 'The video argues that a platform matched to specific use cases can jumpstart business value.' },
      { prompt: 'How does the video characterize the current generative AI moment for business?', options: ['As an unimportant, passing trend', 'As a defining moment comparable to a new industrial revolution', 'As something only relevant to hobbyists', 'As already over and irrelevant now'], answer: 1, explanation: 'The video frames generative AI as a defining, industrial-revolution-scale shift for business, where the right investment can multiply value.' },
      { prompt: 'What kind of effect does the video associate with making the right generative AI investments?', options: ['A multiplier effect for the business', 'A guaranteed reduction to zero cost', 'No measurable effect at all', 'An effect limited only to the IT department'], answer: 0, explanation: 'The video describes the right investments in generative AI as capable of creating a multiplier effect for a business.' },
    ],
  },
  {
    id: 'general-intermediate-9',
    partLabel: 'Part 9 of 10',
    part: 9,
    title: 'Can You Trust Synthetic Data?',
    tagline: 'AI-generated "fake" data is quietly becoming a real training tool — here is where it helps and where it can bite you.',
    requirement: 'optional',
    minutes: 9,
    sections: [
      {
        kind: 'lead',
        text: 'Not all AI training data comes from the real world.',
        body: 'Synthetic data — information generated by a computer rather than collected from real events — is increasingly used to train and test AI models. It promises speed and privacy protection, but it raises a fair question: can you actually trust it?',
      },
      {
        kind: 'video',
        youtubeId: 'QQtSa9ngqQk',
        heading: 'Watch: Can you trust synthetic data? (~7 min)',
        caption: 'IBM Technology (~7 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'What synthetic data actually is', body: 'Computer-generated data built to mimic the statistical properties of real-world data, rather than data collected from real people or events.' },
          { title: 'It is not automatically "safe"', body: 'Even though it is artificially generated, synthetic data can still leak personally identifiable information if it too closely mirrors the real data it was modeled on.' },
          { title: 'It can test AI models, not just train them', body: 'Synthetic data can be used as adversarial examples to probe where a model is likely to make mistakes or produce unfair outcomes.' },
          { title: 'Speed and cost advantages', body: 'It sidesteps the slow, expensive process of collecting and manually labeling real-world data.' },
          { title: 'Trust requires validation', body: 'Building confidence in synthetic data means validating it against multiple quality and accuracy metrics, not just assuming it is good because a model produced it.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'According to the video, what is synthetic data?', options: ['Data collected from real users but anonymized after the fact', 'Computer-generated data designed to mimic real-world data', 'Any data stored in a cloud database', 'Data that has been deleted and cannot be recovered'], answer: 1, explanation: 'Synthetic data is artificially generated rather than collected from real-world events, but it is built to preserve realistic statistical patterns.' },
      { prompt: 'Why might synthetic data still pose a privacy risk, even though it is "fake"?', options: ['It is always stored on public servers', 'It can closely mirror real data patterns and inadvertently reveal personally identifiable information', 'It cannot be encrypted', 'Regulators ban all synthetic data outright'], answer: 1, explanation: 'If synthetic data is generated to be highly accurate, it can end up reflecting identifiable traits from the real data it was modeled on.' },
      { prompt: 'Besides training models, what other use for synthetic data does the video highlight?', options: ['Replacing all human employees', 'Testing models with adversarial examples to expose bias or errors', 'Encrypting company emails', 'Speeding up internet connections'], answer: 1, explanation: 'Synthetic data can be crafted as adversarial test cases to reveal where a model behaves unfairly or inaccurately.' },
      { prompt: 'What is one practical advantage of synthetic data over real-world data collection?', options: ['It requires more manual labeling effort', 'It eliminates the need for computers entirely', 'It is faster and cheaper to produce, and often comes pre-labeled', 'It guarantees a model will never be biased'], answer: 2, explanation: 'A major appeal of synthetic data is that it avoids the time and cost of gathering and labeling real-world data.' },
      { prompt: 'What does the video suggest is necessary before an organization should fully trust its synthetic data?', options: ['Nothing — synthetic data is trustworthy by definition', 'Validating it against quality, accuracy, and relevance metrics', 'Getting sign-off from a government agency', 'Converting it back into real data'], answer: 1, explanation: 'Trust in synthetic data comes from rigorous validation and documentation, not from assuming it is inherently reliable.' },
      { prompt: 'In an internal AI-literacy sense, why does synthetic data matter to a non-technical employee?', options: ['It has no relevance to business decisions', 'It only matters to data scientists writing code', 'It shapes the AI tools an organization trains and tests, so understanding its limits helps you sanity-check AI outputs', 'It replaces the need for any human review of AI systems'], answer: 2, explanation: 'Even non-technical staff benefit from knowing that AI tools may be trained or tested on synthetic data, which has its own risks and limits.' },
    ],
  },
  {
    id: 'general-intermediate-10',
    partLabel: 'Part 10 of 10',
    part: 10,
    title: 'Can Technology Catch a Deepfake Before You Do?',
    tagline: 'AI-generated video and images are now good enough to fool most people — a look at the detection arms race trying to keep up.',
    requirement: 'optional',
    minutes: 9,
    sections: [
      {
        kind: 'lead',
        text: 'The old tells for spotting a deepfake — extra fingers, weird blinking — are disappearing fast.',
        body: 'As generative AI improves, telling real footage from AI-fabricated footage gets harder for the human eye alone. This video looks at the emerging toolkit — detection, labeling, and prevention — being built to catch deepfakes before they mislead people.',
      },
      {
        kind: 'video',
        youtubeId: '-wmZsL_rY_I',
        heading: 'Watch: Can Technology Detect Deepfakes Better Than Humans Can? (~7 min)',
        caption: 'NOVA PBS Official (~7 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Old visual tells are vanishing', body: 'Early giveaways like extra fingers, strange blinking, or glitchy motion are increasingly absent as generative models improve, making human judgment alone unreliable.' },
          { title: 'Three categories of anti-deepfake tools', body: 'The video groups defenses into: tools that embed markers showing content is real or fake, tools that spot deepfakes already circulating, and tools that try to prevent fakes from being made in the first place.' },
          { title: 'Preventative "shields" on real images', body: 'Some tools add an invisible protective layer to an image, making it harder for AI models to recognize and manipulate it in the first place.' },
          { title: 'Poisoning tools for artists', body: 'A University of Chicago team built a tool called Nightshade that adds an invisible "poison" to image pixels so the artwork resists being scraped and used to train AI models without permission.' },
          { title: 'Detection experts and their limits', body: 'Digital forensics researchers, including those focused on media authentication, describe detection as a constantly shifting cat-and-mouse process rather than a solved problem.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'Why does the video say human detection of deepfakes is becoming less reliable?', options: ['Humans have stopped watching videos altogether', 'Classic visual tells like extra fingers or odd blinking are disappearing as AI models improve', 'Deepfakes are now illegal to produce', 'Video resolution has decreased industry-wide'], answer: 1, explanation: 'As generative AI has improved, the old visual glitches people used to spot fakes have largely been eliminated.' },
      { prompt: 'The video groups anti-deepfake tools into three categories. Which of these is one of them?', options: ['Tools that spot deepfakes already circulating online', 'Tools that ban all AI-generated content from the internet', 'Tools that only work on audio, never video', 'Tools that require a government license to use'], answer: 0, explanation: 'The three categories described are: embedding authenticity markers, spotting deepfakes in the wild, and preventing fakes from being created.' },
      { prompt: 'What does a "shield" tool do, as described in the video?', options: ['Deletes AI-generated content automatically', 'Adds an invisible protective layer to an image to make it harder for AI models to manipulate', 'Blocks a device from accessing the internet', 'Converts video files into audio files'], answer: 1, explanation: 'Shield-style tools add an invisible layer to images specifically to resist AI manipulation.' },
      { prompt: 'What is Nightshade, as mentioned in the video?', options: ['A deepfake video streaming platform', 'A tool built by a University of Chicago team that adds invisible "poison" to image pixels to protect artists\' work from unauthorized AI training', 'An AI model used to generate deepfakes', 'A government regulation on synthetic media'], answer: 1, explanation: 'Nightshade was developed to let artists protect their work from being scraped and used to train AI models without consent.' },
      { prompt: 'How does the video characterize the overall state of deepfake detection?', options: ['A solved problem with a single permanent fix', 'An ongoing, constantly shifting challenge as both fakery and detection methods keep evolving', 'Something only large governments need to worry about', 'A problem that no longer exists thanks to new laws'], answer: 1, explanation: 'Detection experts describe it as a continuously evolving cat-and-mouse dynamic rather than something permanently solved.' },
      { prompt: 'Why is this topic relevant to employees who are not in IT or security roles?', options: ['It is not relevant outside of specialized security teams', 'Deepfakes can be used to impersonate people in scams or misinformation, so everyone benefits from a basic awareness of detection challenges', 'Only video editors need to understand deepfakes', 'This technology cannot affect a corporate environment'], answer: 1, explanation: 'Deepfakes are increasingly used in fraud and misinformation, making general awareness valuable across all roles, not just technical or security teams.' },
      { prompt: 'What best characterizes the "prevention" category of anti-deepfake tools from the video?', options: ['Tools that try to stop deepfakes from being created in the first place, such as protective shields on original images', 'Tools that only work after a deepfake has gone viral', 'Tools that fine legal penalties on deepfake creators', 'Tools that improve video streaming speed'], answer: 0, explanation: 'The prevention category focuses on protecting source images/media upfront, before manipulation can even occur.' },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════
   GENERAL TRACK — ADVANCED
   ══════════════════════════════════════════════════════════════════════ */

const generalAdvancedModules: Module[] = [
  {
    id: 'general-advanced-1',
    partLabel: 'Part 1 of 10',
    part: 1,
    title: 'AI Strategy for Organizations',
    tagline: 'How companies actually move from AI pilots to enterprise-wide impact.',
    requirement: 'half',
    minutes: 22,
    sections: [
      {
        kind: 'lead',
        text: 'Most companies do not fail at AI because the technology is bad — they fail because they never build a real strategy around it.',
        body: 'AI pioneer Andrew Ng (Google Brain, Baidu, Coursera, Landing AI) has spent years advising executives on how to move AI from isolated experiments to company-wide capability. In this CXOTalk conversation, he lays out a practical playbook for enterprise AI strategy.',
      },
      { kind: 'video', youtubeId: 'Y7fH2iT1m7Q', heading: 'Watch: Andrew Ng: Enterprise AI Strategy (with Landing AI) (~20 min)', caption: 'CXOTalk (~20 min)' },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Start with pilot projects', body: 'Early AI wins should be chosen for feasibility and internal momentum, not just for the biggest possible business impact.' },
          { title: 'Build an in-house AI team', body: 'Long-term capability requires a centralized team that can support multiple business units rather than one-off vendor engagements.' },
          { title: 'Provide broad AI training', body: 'Executives, business leaders, and frontline staff all need different, role-appropriate AI literacy — not just the engineering team.' },
          { title: 'Formalize an AI strategy', body: 'Once early projects prove value, companies need an explicit strategy for where AI creates a defensible advantage.' },
          { title: 'Communicate internally and externally', body: 'Clear communication about AI initiatives builds trust with employees, customers, and investors alike.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'Who is the guest featured in this CXOTalk episode?', options: ['Andrew Ng', 'Fei-Fei Li', 'Sam Altman', 'Yann LeCun'], answer: 0, explanation: 'The episode features Andrew Ng of Landing AI discussing enterprise AI strategy.' },
      { prompt: 'According to the framework discussed, what should companies typically do first when adopting AI?', options: ['Hire a Chief AI Officer', 'Run small pilot projects to build momentum', 'Rewrite the company mission statement', 'Acquire an AI startup'], answer: 1, explanation: 'The playbook recommends starting with focused pilot projects rather than a massive company-wide rollout.' },
      { prompt: 'Why does the video argue for building an in-house AI team rather than relying solely on outside vendors?', options: ['Vendors are always more expensive', 'In-house teams create durable capability across the organization', 'Regulations require it', 'It is faster to hire externally every time'], answer: 1, explanation: 'An internal team lets the AI capability compound across projects instead of resetting with every vendor engagement.' },
      { prompt: 'What role does training play in the strategy described?', options: ['Only engineers need AI training', 'Broad training across roles is a deliberate step in the playbook', 'Training is optional once pilots succeed', 'Training should happen only after full-scale deployment'], answer: 1, explanation: 'Broad, role-appropriate training is treated as a core step, not an afterthought.' },
      { prompt: 'What is emphasized as necessary once early AI projects show results?', options: ['Immediately shutting down the pilot team', 'Formalizing a company-wide AI strategy', 'Outsourcing all future AI work', 'Avoiding further AI investment'], answer: 1, explanation: 'Early wins are meant to inform a broader, formal AI strategy for the company.' },
      { prompt: 'What audience is this video primarily aimed at?', options: ['Machine learning engineers building models', 'Business executives and leaders shaping AI adoption', 'High school students', 'Hardware engineers'], answer: 1, explanation: 'CXOTalk is a business/executive-focused interview series, and this episode targets leaders responsible for AI strategy.' },
      { prompt: 'Which of the following is NOT one of the ideas discussed in the video?', options: ['Running pilot projects', 'Building an in-house team', 'Training the transformer architecture from scratch', 'Communicating AI initiatives internally and externally'], answer: 2, explanation: 'This is a business-strategy conversation, not a technical deep dive into model architecture.' },
    ],
  },
  {
    id: 'general-advanced-2',
    partLabel: 'Part 2 of 10',
    part: 2,
    title: 'The AI Regulation Landscape',
    tagline: 'What the EU AI Act actually requires, explained without the legal jargon.',
    requirement: 'half',
    minutes: 17,
    sections: [
      {
        kind: 'lead',
        text: 'The EU AI Act is the world’s first comprehensive AI law — and it affects any company doing business in Europe, not just European firms.',
        body: 'This WSJ Tech News Briefing episode breaks down what the EU AI Act actually covers: its risk-based categories, what counts as a "high-risk" AI system, and what it means for businesses building or using AI tools.',
      },
      { kind: 'video', youtubeId: 'i5iZNH2lCGU', heading: 'Watch: The EU’s AI Act, Explained (~15 min)', caption: 'WSJ Podcasts — Tech News Briefing (~15 min)' },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'First comprehensive AI law', body: 'The EU AI Act (Regulation 2024/1689) is described as the first broad, binding legal framework governing AI worldwide.' },
          { title: 'Risk-based categories', body: 'The law sorts AI systems into risk tiers, with stricter obligations for systems judged "high-risk" (e.g., in hiring, credit, or law enforcement).' },
          { title: 'Applies beyond EU borders', body: 'Companies outside Europe that sell AI products or services into the EU market are still subject to the Act’s requirements.' },
          { title: 'Phased rollout', body: 'The Act entered into force in August 2024 with provisions phasing in over roughly two years, giving companies a runway to comply.' },
          { title: 'Business implications', body: 'Compliance requirements touch documentation, transparency, and risk assessment — not just a one-time certification.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What does the episode describe the EU AI Act as?', options: ['A voluntary industry guideline', 'The first comprehensive legal framework on AI worldwide', 'A trade agreement', 'An update to GDPR only'], answer: 1, explanation: 'The EU AI Act is presented as the first broad, binding AI regulation of its kind globally.' },
      { prompt: 'How does the EU AI Act primarily classify AI systems?', options: ['By programming language used', 'By company size', 'By risk level', 'By country of origin only'], answer: 2, explanation: 'The Act uses a risk-based approach, applying stricter rules to higher-risk AI uses.' },
      { prompt: 'Does the EU AI Act only apply to companies headquartered in the EU?', options: ['Yes, only EU-based companies', 'No — companies outside the EU selling into the EU market are also covered', 'It applies only to government agencies', 'It applies only to open-source AI models'], answer: 1, explanation: 'Non-EU companies offering AI products or services in the EU market must still comply.' },
      { prompt: 'What kind of AI uses face the strictest obligations under the Act?', options: ['Low-risk uses like spam filters', 'High-risk uses such as hiring or credit decisions', 'Entertainment chatbots', 'Video game AI'], answer: 1, explanation: 'High-risk categories, such as employment and credit-scoring systems, carry the most stringent requirements.' },
      { prompt: 'When did the EU AI Act enter into force?', options: ['2020', 'August 2024', '2030', 'It has not yet passed'], answer: 1, explanation: 'The regulation entered into force on August 1, 2024, with obligations phasing in afterward.' },
      { prompt: 'What is this episode’s general approach to the topic?', options: ['A deep legal analysis for lawyers only', 'A plain-language business news briefing', 'A coding tutorial', 'A product demo'], answer: 1, explanation: 'It is a short news-briefing format aimed at a general business audience, not a legal treatise.' },
    ],
  },
  {
    id: 'general-advanced-3',
    partLabel: 'Part 3 of 10',
    part: 3,
    title: 'AI and the Future of Work',
    tagline: 'What credible research says about AI, jobs, and how work is changing.',
    requirement: 'optional',
    minutes: 6,
    sections: [
      {
        kind: 'lead',
        text: 'Will AI take your job, change it, or create a new one entirely? The honest answer is: all three, depending on the role.',
        body: 'The World Economic Forum — the organization behind the widely-cited "Future of Jobs" research — produced this short explainer on how AI and automation are reshaping the workplace, and what skills will matter most in the years ahead.',
      },
      { kind: 'video', youtubeId: 'EuDnSqAo784', heading: 'Watch: What is the Future of Work? (~4 min)', caption: 'World Economic Forum (~4 min)' },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Displacement and creation both happen', body: 'AI and automation eliminate some tasks and roles while creating new ones — the net effect varies widely by industry.' },
          { title: 'Skills matter more than job titles', body: 'The shift in demand is toward adaptable skills (critical thinking, digital literacy) rather than any single fixed job description.' },
          { title: 'Reskilling is a shared responsibility', body: 'Governments, employers, and individuals all have a role to play in preparing the workforce for AI-driven change.' },
          { title: 'Timeframes matter', body: 'Workforce shifts play out over years, not overnight — giving organizations a window to adapt if they start early.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'Which organization produced this video?', options: ['World Economic Forum', 'United Nations', 'OECD', 'World Bank'], answer: 0, explanation: 'The video is published by the World Economic Forum, known for its "Future of Jobs" research.' },
      { prompt: 'According to the video, what is the overall effect of AI on jobs?', options: ['It only destroys jobs', 'It only creates jobs', 'It both displaces some roles and creates new ones', 'It has no measurable effect'], answer: 2, explanation: 'The video frames AI’s labor impact as a mix of displacement and creation, varying by sector.' },
      { prompt: 'What does the video emphasize as more important than specific job titles?', options: ['Company size', 'Adaptable skills like critical thinking and digital literacy', 'Years of tenure', 'Office location'], answer: 1, explanation: 'Transferable skills are highlighted as the more durable currency in a changing job market.' },
      { prompt: 'Who does the video say is responsible for workforce reskilling?', options: ['Only individual workers', 'Only national governments', 'A shared responsibility across governments, employers, and individuals', 'Only universities'], answer: 2, explanation: 'The video frames reskilling as a collective effort, not any single actor’s job alone.' },
      { prompt: 'Over what kind of timeframe does the video suggest workforce change unfolds?', options: ['Overnight', 'Over years, giving time to adapt', 'Only after a full century', 'It has already fully happened'], answer: 1, explanation: 'The video presents workforce shifts as a gradual, multi-year process rather than an instant event.' },
      { prompt: 'What is the general tone/format of this video?', options: ['A short, accessible explainer', 'A 3-hour academic lecture', 'A technical machine learning tutorial', 'A legal filing summary'], answer: 0, explanation: 'It is a brief, general-audience explainer video, consistent with WEF’s short-form content style.' },
    ],
  },
  {
    id: 'general-advanced-4',
    partLabel: 'Part 4 of 10',
    part: 4,
    title: 'Advanced Prompt Engineering for Business Users',
    tagline: 'Zero-shot, few-shot, and chain-of-thought prompting — explained without the math.',
    requirement: 'required',
    minutes: 14,
    sections: [
      {
        kind: 'lead',
        text: 'The difference between a mediocre AI answer and a genuinely useful one often comes down to how you ask the question.',
        body: 'This video walks through three advanced prompting techniques — zero-shot, few-shot, and chain-of-thought — and shows how each one changes the quality and reliability of an AI model’s output, using clear, non-technical examples.',
      },
      { kind: 'video', youtubeId: 'sZIV7em3JA8', heading: 'Watch: Master AI Prompting: Zero-Shot, Few-Shot & Chain of Thought Explained (~12 min)', caption: 'Prof. Ryan Ahmed (~12 min)' },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Zero-shot prompting', body: 'Asking the model to complete a task with no examples at all — fast, but sometimes less reliable for complex tasks.' },
          { title: 'Few-shot prompting', body: 'Providing a handful of example input/output pairs in the prompt so the model can pattern-match the desired style and format.' },
          { title: 'Chain-of-thought prompting', body: 'Asking the model to reason step-by-step before giving a final answer, which improves accuracy on multi-step problems.' },
          { title: 'Combining techniques', body: 'Few-shot examples that themselves demonstrate step-by-step reasoning ("few-shot CoT") often outperform either technique alone.' },
          { title: 'Business payoff', body: 'Better prompting is a near-zero-cost lever — it improves output quality without touching the underlying model.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What is zero-shot prompting?', options: ['Giving the model dozens of examples', 'Asking the model to perform a task with no examples provided', 'Fine-tuning the model weights', 'Disabling the model entirely'], answer: 1, explanation: 'Zero-shot means the prompt contains no worked examples — just the instruction.' },
      { prompt: 'What is few-shot prompting?', options: ['Providing a few example input/output pairs in the prompt', 'Training a brand-new model from scratch', 'Only asking yes/no questions', 'Removing all context from the prompt'], answer: 0, explanation: 'Few-shot prompting includes a small number of demonstrations to guide the model’s response.' },
      { prompt: 'What does chain-of-thought prompting ask the model to do?', options: ['Skip straight to the final answer', 'Reason through intermediate steps before answering', 'Ignore the question', 'Only output single words'], answer: 1, explanation: 'Chain-of-thought prompting elicits step-by-step reasoning, which tends to improve accuracy on complex tasks.' },
      { prompt: 'According to the video, what happens when you combine few-shot examples with chain-of-thought reasoning?', options: ['Performance gets worse', 'It often performs better than either technique alone on complex tasks', 'It has no effect', 'It only works for images'], answer: 1, explanation: 'Few-shot chain-of-thought combines demonstration and reasoning steps for stronger results on harder tasks.' },
      { prompt: 'Why does the video frame prompting as valuable for business users specifically?', options: ['It requires buying new hardware', 'It is a low-cost way to significantly improve AI output without modifying the model', 'It replaces the need for any AI tool', 'It only matters for software engineers'], answer: 1, explanation: 'Better prompts are presented as a cheap, fast lever available to any user of an AI tool.' },
      { prompt: 'Which technique is generally best suited to a straightforward, simple task?', options: ['Chain-of-thought prompting', 'Zero-shot prompting', 'Multi-agent orchestration', 'Fine-tuning a foundation model'], answer: 1, explanation: 'Zero-shot works well for simple, well-understood tasks that don’t need demonstrations or step-by-step reasoning.' },
      { prompt: 'Is this video primarily about how transformer neural networks are built internally?', options: ['Yes, it covers attention mechanisms in depth', 'No, it focuses on practical prompting techniques for users', 'Yes, it explains backpropagation', 'Yes, it is a coding tutorial for building an LLM'], answer: 1, explanation: 'The video stays at the practical, user-facing level of prompting rather than model internals.' },
    ],
  },
  {
    id: 'general-advanced-5',
    partLabel: 'Part 5 of 10',
    part: 5,
    title: 'Evaluating AI Vendors and Tools',
    tagline: 'The questions a smart buyer asks before adopting any AI product.',
    requirement: 'half',
    minutes: 8,
    sections: [
      {
        kind: 'lead',
        text: 'Every vendor claims their tool is "powered by AI" — so how do you actually tell a serious solution from a marketing wrapper?',
        body: 'G2, the software review platform, lays out four concrete questions business buyers should ask before purchasing an AI tool, covering data handling, accuracy claims, integration, and vendor transparency.',
      },
      { kind: 'video', youtubeId: 'PRhC0lRSf14', heading: 'Watch: How to Evaluate AI Tools Before You Buy: 4 Questions Every Smart Buyer Asks (~6 min)', caption: 'G2 (~6 min)' },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Ask what data trains and powers the tool', body: 'Understanding data sources and handling practices is essential before trusting a tool with company information.' },
          { title: 'Demand evidence, not marketing claims', body: 'Buyers should ask vendors to substantiate accuracy and performance claims rather than accepting them at face value.' },
          { title: 'Check integration with existing systems', body: 'A powerful AI feature is far less useful if it cannot plug into the tools your team already relies on.' },
          { title: 'Look for transparency on limitations', body: 'Vendors who are upfront about what their tool cannot do are generally more trustworthy than those who overpromise.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'Which company published this video?', options: ['Gartner', 'G2', 'Forrester', 'IDC'], answer: 1, explanation: 'The video is produced by G2, the software review and comparison platform.' },
      { prompt: 'How many key questions does the video frame for evaluating AI tools?', options: ['Two', 'Four', 'Ten', 'One'], answer: 1, explanation: 'The video is structured around four questions every smart AI buyer should ask.' },
      { prompt: 'Why does the video recommend asking about the data that powers a tool?', options: ['Data questions are irrelevant to AI tools', 'Understanding data sources and handling is critical before trusting the tool with company information', 'It is required by law in every country', 'Only engineers care about this'], answer: 1, explanation: 'Knowing how a tool sources and handles data affects both trust and risk.' },
      { prompt: 'What does the video suggest doing with a vendor’s accuracy or performance claims?', options: ['Accept them without question', 'Ask for supporting evidence rather than taking marketing claims at face value', 'Ignore accuracy entirely', 'Assume all vendors lie'], answer: 1, explanation: 'The video encourages buyers to push vendors for evidence behind their claims.' },
      { prompt: 'Why does integration with existing systems matter when evaluating an AI tool?', options: ['It doesn’t matter at all', 'A tool that can’t connect to existing workflows delivers less real value', 'Integration is only relevant for free tools', 'Integration is guaranteed for every AI product'], answer: 1, explanation: 'Even a strong AI feature loses much of its value if it can’t fit into how the team already works.' },
      { prompt: 'What kind of vendor behavior does the video suggest builds more trust?', options: ['Refusing to discuss limitations', 'Being transparent about what the tool cannot do', 'Promising the tool can do everything', 'Avoiding all customer questions'], answer: 1, explanation: 'Vendors who are candid about limitations are framed as more credible than those who overpromise.' },
    ],
  },
  {
    id: 'general-advanced-6',
    partLabel: 'Part 6 of 10',
    part: 6,
    title: 'Responsible AI and Governance Frameworks',
    tagline: 'Why "legal" and "ethical" are not the same thing when it comes to AI.',
    requirement: 'half',
    minutes: 11,
    sections: [
      {
        kind: 'lead',
        text: 'An AI system can fully comply with the law and still cause real harm — that gap is exactly what AI governance is meant to close.',
        body: 'IBM Technology breaks down what responsible AI governance actually means in practice: the guardrails, oversight structures, and accountability mechanisms organizations put in place to keep AI systems safe, fair, and aligned with company values.',
      },
      { kind: 'video', youtubeId: 'yh-3WU1FKrk', heading: 'Watch: What is Responsible AI? A Guide to AI Governance (~9 min)', caption: 'IBM Technology (~9 min)' },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: '"Lawful but awful"', body: 'A system can technically comply with regulations while still producing unethical or harmful outcomes — governance has to go beyond legal minimums.' },
          { title: 'Governance is operational, not just principles', body: 'Effective AI governance translates high-level principles into concrete practices: defined ownership, monitoring, and standards.' },
          { title: 'Accountability structures matter', body: 'Clear ownership of AI decisions and outcomes is a core pillar — someone has to be answerable when things go wrong.' },
          { title: 'Governance spans the whole AI lifecycle', body: 'From data quality to deployment monitoring, responsible AI requires oversight at every stage, not just at launch.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'Which company produced this video?', options: ['Microsoft', 'IBM Technology', 'Amazon', 'Salesforce'], answer: 1, explanation: 'The video is part of the IBM Technology YouTube channel.' },
      { prompt: 'What does the phrase "lawful but awful" refer to in the video?', options: ['An AI system that breaks the law but works well', 'An AI system that complies with regulations yet still causes ethical harm', 'A system that is both illegal and ineffective', 'A marketing slogan for a competitor'], answer: 1, explanation: 'The phrase captures the gap between legal compliance and genuine ethical soundness.' },
      { prompt: 'According to the video, what should AI governance do beyond following the law?', options: ['Nothing — legal compliance is sufficient', 'Address ethical considerations and unintended consequences', 'Focus only on cost reduction', 'Avoid any oversight structures'], answer: 1, explanation: 'The video argues governance must extend past bare legal compliance to real ethical accountability.' },
      { prompt: 'How does the video describe effective AI governance?', options: ['As a single one-time certificate', 'As an operational backbone that turns principles into concrete practice', 'As purely a marketing exercise', 'As something only regulators handle'], answer: 1, explanation: 'Governance is presented as the practical machinery that operationalizes stated AI principles.' },
      { prompt: 'Why does accountability matter in the governance framework described?', options: ['It doesn’t — no one needs to own AI outcomes', 'Clear ownership ensures someone is answerable when AI systems cause harm', 'Accountability slows down innovation with no benefit', 'It is only relevant for government agencies'], answer: 1, explanation: 'Assigning clear ownership is presented as essential to responsible AI practice.' },
      { prompt: 'At what point in an AI system’s life does the video say governance should apply?', options: ['Only at the initial design phase', 'Across the full lifecycle, including deployment and monitoring', 'Only after a public failure occurs', 'Only during marketing launch'], answer: 1, explanation: 'The video frames governance as continuous oversight spanning data quality through deployment monitoring.' },
    ],
  },
  {
    id: 'general-advanced-7',
    partLabel: 'Part 7 of 10',
    part: 7,
    title: 'The Limits of Current AI — A Critical View',
    tagline: 'Meta’s chief AI scientist explains what today’s AI still cannot do.',
    requirement: 'half',
    minutes: 61,
    sections: [
      {
        kind: 'lead',
        text: 'Not everyone in AI believes today’s systems are close to human-level intelligence — and some of the field’s most credentialed skeptics have a very specific list of what is missing.',
        body: 'Yann LeCun — Turing Award winner and Meta’s Chief AI Scientist — gives a keynote arguing that today’s AI systems lack persistent memory, real-world understanding, and genuine reasoning and planning, and explains why he believes scaling current approaches alone won’t close that gap.',
      },
      { kind: 'video', youtubeId: '4DsCtgtQlZU', heading: 'Watch: Keynote: Yann LeCun, "Human-Level AI" (~59 min)', caption: 'Hudson Forum (~59 min)' },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Four missing capabilities', body: 'LeCun argues human-level AI requires understanding the physical world, persistent memory, reasoning, and hierarchical planning — capabilities current systems largely lack.' },
          { title: 'Scaling has limits', body: 'He contends that simply making today’s dominant AI approaches bigger is unlikely, by itself, to produce the next leap in capability.' },
          { title: 'Language is a thin slice of intelligence', body: 'Much of human understanding of the world comes from non-linguistic experience, which text-only training does not capture.' },
          { title: 'A credible, informed critique', body: 'The talk is a useful counterweight to hype: even leading AI researchers disagree sharply about how close we are to general intelligence.' },
          { title: 'Even if achieved, adoption takes time', body: 'LeCun notes that even once systems have these capabilities, it will still take time before they reach genuinely human-level performance in practice.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'Who delivers this keynote?', options: ['Geoffrey Hinton', 'Yann LeCun', 'Andrew Ng', 'Demis Hassabis'], answer: 1, explanation: 'The keynote is delivered by Yann LeCun, Meta’s Chief AI Scientist.' },
      { prompt: 'Which event does this keynote come from?', options: ['Hudson Forum', 'Davos', 'TED', 'Google I/O'], answer: 0, explanation: 'This is LeCun’s keynote at the Hudson Forum.' },
      { prompt: 'Which capability does LeCun NOT list as missing from current AI systems?', options: ['Persistent memory', 'Understanding the physical world', 'Reasoning and planning', 'Generating grammatically correct text'], answer: 3, explanation: 'Current models are already fluent at generating grammatical text — that is not among the missing capabilities LeCun highlights.' },
      { prompt: 'What is LeCun’s view on scaling current AI approaches?', options: ['Scaling alone will definitely reach human-level AI', 'Scaling alone is unlikely to be sufficient for the next leap in capability', 'Scaling is irrelevant to AI progress', 'Scaling has already achieved human-level AI'], answer: 1, explanation: 'LeCun argues that simply scaling up today’s dominant approach is unlikely to be enough.' },
      { prompt: 'What does LeCun say about language as a basis for intelligence?', options: ['Language captures the full richness of human understanding', 'Language is just one thin slice of how humans understand the world', 'Language is irrelevant to any form of intelligence', 'Text is a perfect substitute for physical experience'], answer: 1, explanation: 'LeCun compares learning from text alone to trying to learn to swim by reading about water.' },
      { prompt: 'Why is this talk useful for a business audience specifically?', options: ['It teaches how to code a neural network', 'It offers a credible, expert-level check against AI hype and overpromising', 'It is a sales pitch for Meta products', 'It focuses solely on stock market predictions'], answer: 1, explanation: 'The value for a business audience is calibrating expectations using a leading researcher’s informed skepticism.' },
      { prompt: 'Does LeCun claim these missing capabilities will be solved instantly?', options: ['Yes, within a year', 'No — he notes it will take time even once such systems exist', 'Yes, they are already solved', 'He does not address timeline at all'], answer: 1, explanation: 'LeCun explicitly notes that even once systems have these capabilities, reaching truly human-level performance will still take time.' },
    ],
  },
  {
    id: 'general-advanced-8',
    partLabel: 'Part 8 of 10',
    part: 8,
    title: 'Case Study: AI Transformation at Scale',
    tagline: 'How Bank of America turned a chatbot into a company-wide AI transformation.',
    requirement: 'optional',
    minutes: 42,
    sections: [
      {
        kind: 'lead',
        text: 'Erica started as a simple virtual assistant for navigating a mobile banking app — it has since handled billions of client interactions and reshaped how the bank operates.',
        body: 'This Banking Transformed Podcast episode digs into Bank of America’s real, documented AI journey: from Erica’s 2018 launch to becoming a cornerstone of a multi-billion-dollar enterprise AI strategy, and what other large organizations can learn from that path.',
      },
      { kind: 'video', youtubeId: 'KibFqG47KzQ', heading: 'Watch: Inside Erica: How Bank of America Is Building the Agentic Bank (~40 min)', caption: 'Banking Transformed Podcast (~40 min)' },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Started small and specific', body: 'Erica began as a narrowly scoped assistant for a specific customer need, not an attempt to automate everything at once.' },
          { title: 'Scaled with trust and adoption', body: 'Client trust grew alongside usage, with the assistant eventually handling billions of interactions for tens of millions of clients.' },
          { title: 'Became a platform, not just a feature', body: 'What started as a single chatbot evolved into a foundation for broader enterprise AI investment.' },
          { title: 'Long-term, sustained investment', body: 'The transformation took years of continuous investment and iteration, not a single flashy launch.' },
          { title: 'Real, verifiable case study', body: 'Unlike many AI success stories, Erica’s growth and impact are documented through the bank’s own public disclosures.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'Which company’s AI transformation is the focus of this episode?', options: ['Bank of America', 'JPMorgan Chase', 'Wells Fargo', 'Citibank'], answer: 0, explanation: 'The episode focuses on Bank of America’s virtual assistant Erica.' },
      { prompt: 'What was Erica originally launched to do?', options: ['Replace all bank tellers immediately', 'Help customers navigate mobile banking features', 'Trade stocks automatically', 'Approve business loans'], answer: 1, explanation: 'Erica launched as a virtual assistant focused on mobile app navigation, a deliberately narrow starting point.' },
      { prompt: 'What does the case study suggest about how large-scale AI transformations typically start?', options: ['With a single massive company-wide rollout', 'With a narrowly scoped project that expands over time', 'By skipping pilots entirely', 'By outsourcing everything from day one'], answer: 1, explanation: 'Erica’s growth from a narrow assistant into an enterprise-wide capability illustrates gradual scaling.' },
      { prompt: 'What happened to Erica’s role over time, according to the episode?', options: ['It was discontinued after launch', 'It evolved from a single feature into a foundation for broader enterprise AI', 'It stayed exactly the same for years', 'It was replaced by a competitor’s tool'], answer: 1, explanation: 'Erica grew from a chatbot into a platform underpinning wider AI investment at the bank.' },
      { prompt: 'What kind of investment does the episode describe behind this transformation?', options: ['A single one-time expense', 'Sustained, multi-year investment and iteration', 'No investment — it happened automatically', 'A one-week sprint'], answer: 1, explanation: 'The case study frames the transformation as the result of continuous, long-term investment.' },
      { prompt: 'Why is this considered a strong example for a case-study module?', options: ['It is a hypothetical scenario', 'It is a real, publicly documented transformation at a large company', 'It only exists as a rumor', 'It has no measurable outcomes'], answer: 1, explanation: 'Bank of America has publicly disclosed Erica’s usage figures, making this a verifiable, real-world case study.' },
    ],
  },
  {
    id: 'general-advanced-9',
    partLabel: 'Part 9 of 10',
    part: 9,
    title: 'Building an AI-Literate Culture',
    tagline: 'Why adapting to AI is a leadership and culture challenge, not just a technology rollout.',
    requirement: 'optional',
    minutes: 12,
    sections: [
      {
        kind: 'lead',
        text: 'The hardest part of adopting AI is rarely the technology — it is getting people to actually change how they work.',
        body: 'In this Microsoft-produced conversation, a Harvard Business School professor explains how AI is changing the fundamental rules of business competition, and what leaders need to do differently to help their organizations and people genuinely adapt.',
      },
      { kind: 'video', youtubeId: 'Gol8PECt-To', heading: 'Watch: AI is changing the rules of business, see how to adapt from a Harvard Business School professor (~10 min)', caption: 'Microsoft (~10 min)' },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'AI changes competitive rules, not just tasks', body: 'The conversation frames AI as reshaping the basis of competitive advantage, not just automating individual tasks.' },
          { title: 'Leadership modeling matters', body: 'Leaders who visibly use and champion AI tools set the tone for adoption across the rest of the organization.' },
          { title: 'Adaptation is an ongoing process', body: 'Becoming an AI-literate organization is presented as a continuous capability, not a one-time training event.' },
          { title: 'Business-school framing, not engineering framing', body: 'The discussion focuses on strategic and organizational adaptation, deliberately avoiding deep technical detail.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What is the professional background of the featured expert?', options: ['A Harvard Business School professor', 'A machine learning engineer', 'A government regulator', 'A hardware designer'], answer: 0, explanation: 'The video features insight from a Harvard Business School professor on adapting to AI.' },
      { prompt: 'What company produced this video?', options: ['Google', 'Microsoft', 'Amazon', 'Meta'], answer: 1, explanation: 'The video is published on Microsoft’s YouTube channel.' },
      { prompt: 'According to the video, what does AI change at a fundamental level?', options: ['Only individual employee tasks', 'The basic rules of business competition', 'Nothing meaningful for most companies', 'Only the IT department’s workflows'], answer: 1, explanation: 'The framing is that AI reshapes competitive dynamics, not just discrete tasks.' },
      { prompt: 'Why does leadership behavior matter for AI-literate culture, according to the video?', options: ['It doesn’t matter at all', 'Leaders who model AI use set the tone for adoption across the organization', 'Leaders should avoid using AI themselves', 'Only junior staff need to use AI'], answer: 1, explanation: 'Visible leadership engagement with AI tools is presented as a driver of broader adoption.' },
      { prompt: 'How is building an AI-literate culture characterized in the video?', options: ['A single mandatory training session', 'An ongoing, continuous process', 'Something that finishes after one workshop', 'Irrelevant to most organizations'], answer: 1, explanation: 'The video frames cultural adaptation to AI as continuous rather than a one-off event.' },
      { prompt: 'What kind of framing does this video use?', options: ['Deep technical machine-learning framing', 'Business/organizational strategy framing', 'A legal compliance checklist', 'A hardware specification review'], answer: 1, explanation: 'The discussion stays at the strategic and cultural level appropriate for business leaders.' },
    ],
  },
  {
    id: 'general-advanced-10',
    partLabel: 'Part 10 of 10',
    part: 10,
    title: 'Advanced Generative AI Use Cases: Agentic AI in Business',
    tagline: 'How AI agents chain multiple steps together to create real business value.',
    requirement: 'half',
    minutes: 22,
    sections: [
      {
        kind: 'lead',
        text: 'The next wave of generative AI isn’t a single chatbot answer — it’s a chain of AI-driven steps that plan, act, and adjust with minimal human intervention.',
        body: 'In this CXOTalk conversation, McKinsey experts discuss agentic AI from a business-value perspective: what makes it different from earlier generative AI, where it is already creating measurable impact, and how leaders should think about deploying it responsibly.',
      },
      { kind: 'video', youtubeId: 'rwK3kOjyCXM', heading: 'Watch: McKinsey on Agentic AI: How to Create Business Value (~20 min)', caption: 'CXOTalk (~20 min)' },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'From single answers to multi-step workflows', body: 'Agentic AI chains together planning, tool use, and decision-making across multiple steps, rather than producing one static response.' },
          { title: 'Value comes from workflow redesign', body: 'The biggest business impact comes not from bolting AI onto old processes, but from redesigning workflows around what agentic AI can do.' },
          { title: 'Adoption is still early but accelerating', body: 'Many organizations are experimenting with agentic AI, while a smaller but growing share are scaling it into production.' },
          { title: 'Oversight remains essential', body: 'Even as agents take on more autonomous steps, human oversight and clear guardrails remain critical to managing risk.' },
          { title: 'Measurable KPIs drive impact', body: 'Organizations that track well-defined KPIs for their agentic AI deployments see a clearer bottom-line impact than those that don’t.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What organization’s perspective is featured in this CXOTalk episode?', options: ['McKinsey', 'Deloitte', 'Bain', 'BCG'], answer: 0, explanation: 'The episode features McKinsey’s perspective on agentic AI and business value.' },
      { prompt: 'What distinguishes agentic AI from earlier generative AI, according to the discussion?', options: ['It only ever gives single, static answers', 'It chains together planning, tool use, and decisions across multiple steps', 'It cannot use any external tools', 'It requires no oversight whatsoever'], answer: 1, explanation: 'Agentic AI is defined by its ability to execute multi-step, tool-using workflows rather than one-off responses.' },
      { prompt: 'Where does the discussion say the biggest business value comes from?', options: ['Simply bolting AI onto unchanged processes', 'Redesigning workflows around what agentic AI enables', 'Avoiding any process changes', 'Reducing headcount immediately'], answer: 1, explanation: 'Genuine workflow redesign is presented as the source of the largest gains, not superficial AI add-ons.' },
      { prompt: 'How does the video characterize current adoption of agentic AI across organizations?', options: ['Fully scaled everywhere already', 'Still largely experimental, with a smaller share scaling to production', 'Nonexistent in practice', 'Banned by regulation'], answer: 1, explanation: 'Adoption is framed as early-stage and accelerating, with many organizations still experimenting.' },
      { prompt: 'What does the conversation say remains essential even as AI agents act more autonomously?', options: ['Removing all human oversight', 'Maintaining human oversight and clear guardrails', 'Eliminating KPIs', 'Avoiding any monitoring'], answer: 1, explanation: 'Oversight and guardrails are described as critical even as agents take on more autonomous tasks.' },
      { prompt: 'What organizational practice is linked to stronger bottom-line impact from agentic AI?', options: ['Avoiding all measurement', 'Tracking well-defined KPIs for AI initiatives', 'Ignoring workflow redesign', 'Keeping agentic AI projects secret from leadership'], answer: 1, explanation: 'Tracking clear KPIs is linked to more measurable, positive financial impact from AI deployments.' },
      { prompt: 'Is this video primarily a tutorial on how to code an AI agent from scratch?', options: ['Yes, it walks through Python implementation', 'No, it is a business-value discussion aimed at leaders', 'Yes, it covers API integration code', 'Yes, it is a framework comparison for developers'], answer: 1, explanation: 'The discussion stays at the strategic/business level rather than technical agent-building details.' },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════
   TECHNICAL TRACK
   ══════════════════════════════════════════════════════════════════════ */

const technicalBeginnerModules: Module[] = [
  {
    id: 'technical-beginner-1',
    partLabel: 'Part 1 of 10',
    part: 1,
    title: 'What Is a Neural Network?',
    tagline: 'The building block behind modern AI — built up from scratch, and visualized.',
    requirement: 'required',
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
    id: 'technical-beginner-2',
    partLabel: 'Part 2 of 10',
    part: 2,
    title: 'Large Language Models, Briefly',
    tagline: 'What an LLM actually does, and how it gets trained — in plain terms.',
    requirement: 'required',
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
    id: 'technical-beginner-3',
    partLabel: 'Part 3 of 10',
    part: 3,
    title: 'Transformers: The Tech Behind LLMs',
    tagline: 'A look under the hood at the architecture powering tools like ChatGPT.',
    requirement: 'required',
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
  {
    id: 'technical-beginner-4',
    partLabel: 'Part 4 of 10',
    part: 4,
    title: 'Retrieval-Augmented Generation (RAG)',
    tagline: 'How to ground an AI’s answers in your own real, up-to-date data.',
    requirement: 'required',
    minutes: 8,
    sections: [
      {
        kind: 'lead',
        text: 'RAG lets an AI look things up before it answers.',
        body: 'Retrieval-Augmented Generation (RAG) connects a language model to an external knowledge base — your documents, policies, or databases — so it can pull in relevant, current information before generating a response, instead of relying only on what it learned during training.',
      },
      {
        kind: 'video',
        youtubeId: '9jKwz7JOwEo',
        heading: 'Watch: How does Retrieval Augmented Generation (RAG) work?',
        caption: 'IBM Technology (~9 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Two steps: retrieve, then generate', body: 'First search a knowledge base for relevant content, then hand that content to the model along with the question.' },
          { title: 'Grounds answers in real data', body: 'The model answers using retrieved facts instead of guessing from memory alone.' },
          { title: 'Reduces hallucinations', body: 'Because the answer is backed by retrieved documents, it’s far less likely to be confidently wrong.' },
          { title: 'No retraining needed', body: 'Update the knowledge base and the model’s answers update too — no expensive retraining required.' },
        ],
      },
      {
        kind: 'list',
        heading: 'Where this shows up in business',
        items: [
          { title: 'Internal policy chatbots', body: 'Answering employee questions by retrieving from company handbooks and policies.' },
          { title: 'Customer support', body: 'Grounding responses in product manuals and support tickets instead of generic web knowledge.' },
          { title: 'Research assistants', body: 'Summarizing and citing specific internal reports or documents on request.' },
        ],
      },
    ],
    quiz: [
      {
        prompt: 'What does RAG add to a language model?',
        options: [
          'The ability to retrieve relevant external information before answering',
          'A faster internet connection',
          'The ability to generate images instead of text',
          'A bigger screen for the chat window',
        ],
        answer: 0,
        explanation: 'RAG connects the model to a knowledge base so it can retrieve relevant information before generating its answer.',
      },
      {
        prompt: 'What are the two steps in a RAG pipeline, in order?',
        options: [
          'Generate, then retrieve',
          'Retrieve relevant information, then generate an answer using it',
          'Translate, then summarize',
          'Train, then deploy',
        ],
        answer: 1,
        explanation: 'RAG first retrieves relevant content from a knowledge base, then generates an answer grounded in what it found.',
      },
      {
        prompt: 'Why does RAG help reduce hallucinations?',
        options: [
          'The answer is grounded in retrieved, real documents instead of memory alone',
          'It makes the model respond faster',
          'It removes the need for a user prompt',
          'It deletes the model’s training data',
        ],
        answer: 0,
        explanation: 'Because the model bases its answer on retrieved facts, it’s far less likely to confidently make something up.',
      },
      {
        prompt: 'How do you update what a RAG system "knows" about new information?',
        options: [
          'Update the knowledge base it retrieves from — no retraining needed',
          'Retrain the entire model from scratch every time',
          'Buy a bigger computer',
          'It can never be updated',
        ],
        answer: 0,
        explanation: 'Since RAG retrieves from an external knowledge base, updating that source updates the answers — no costly retraining required.',
      },
    ],
  },
  {
    id: 'technical-beginner-5',
    partLabel: 'Part 5 of 10',
    part: 5,
    title: 'Feature Engineering',
    tagline: 'Turning raw data into the inputs a model can actually learn from.',
    requirement: 'half',
    minutes: 10,
    sections: [
      {
        kind: 'lead',
        text: 'Good features make a good model.',
        body: 'Feature engineering is the process of selecting, transforming, and creating the input variables (“features”) that a machine learning model learns from. Raw data is rarely ready to use as-is — this is the step that shapes it into something a model can work with well.',
      },
      {
        kind: 'video',
        youtubeId: 'DkLQtGqQedo',
        heading: 'Watch: Introduction to Feature Engineering in Machine Learning',
        caption: '(~10 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Raw data isn’t ready-made', body: 'Real-world data usually needs cleaning and reshaping before a model can learn from it well.' },
          { title: 'Encoding categories', body: 'Turning categories like "country" or "product type" into numbers a model can use.' },
          { title: 'Scaling values', body: 'Putting numeric features on a similar scale so no single feature unfairly dominates.' },
          { title: 'Creating new features', body: 'Combining or deriving new variables (e.g. "days since last order") that reveal patterns the raw data hides.' },
        ],
      },
      {
        kind: 'list',
        heading: 'Why it matters for business AI projects',
        items: [
          { title: 'Better features, better accuracy', body: 'A well-engineered feature set often improves a model more than switching algorithms does.' },
          { title: 'Comes before training', body: 'Feature engineering happens early in the pipeline, right after collecting and cleaning data.' },
          { title: 'Domain knowledge matters', body: 'The best features often come from someone who understands the business problem, not just the data.' },
        ],
      },
    ],
    quiz: [
      {
        prompt: 'What is feature engineering?',
        options: [
          'Selecting, transforming, and creating the input variables a model learns from',
          'Writing the model’s code from scratch',
          'Designing the user interface for an app',
          'Choosing which cloud provider to use',
        ],
        answer: 0,
        explanation: 'Feature engineering shapes raw data into the input variables ("features") a model actually learns from.',
      },
      {
        prompt: 'Why would you "encode" a category like "country" into numbers?',
        options: [
          'Because most models need numeric input to learn from',
          'To make the data file smaller',
          'To hide the data from users',
          'Because text is not allowed in computers',
        ],
        answer: 0,
        explanation: 'Categorical data like country names needs to be converted into a numeric form most models can process.',
      },
      {
        prompt: 'Where does feature engineering typically happen in a project?',
        options: [
          'Early on, after collecting and cleaning the data, before training',
          'After the model is already deployed to users',
          'Only after the project is cancelled',
          'It never really happens — models use raw data directly',
        ],
        answer: 0,
        explanation: 'Feature engineering happens early in the pipeline, shaping the data before it’s used to train a model.',
      },
      {
        prompt: 'Why can good feature engineering improve a model more than switching algorithms?',
        options: [
          'Because the quality of the input data has a huge effect on what a model can learn',
          'Because algorithms don’t actually matter at all',
          'Because it makes the code shorter',
          'Because it’s required by law',
        ],
        answer: 0,
        explanation: 'A model can only learn as well as the data it’s given — strong features often matter more than the choice of algorithm.',
      },
    ],
  },
  {
    id: 'technical-beginner-6',
    partLabel: 'Part 6 of 10',
    part: 6,
    title: 'Building AI Agents',
    tagline: 'The difference between an AI that answers and an AI that acts.',
    requirement: 'required',
    minutes: 10,
    sections: [
      {
        kind: 'lead',
        text: 'An agent doesn’t just answer — it acts.',
        body: 'An AI agent extends a language model with the ability to make decisions, call tools or APIs, and carry out multi-step tasks toward a goal — rather than simply generating a single reply to a question.',
      },
      {
        kind: 'video',
        youtubeId: 'F8NKVhkZZWI',
        heading: 'Watch: What are AI Agents?',
        caption: 'IBM Technology (~9 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Beyond a single reply', body: 'An agent can plan a sequence of steps to reach a goal, not just answer one question.' },
          { title: 'Calling tools and APIs', body: 'Agents can look things up, run calculations, or trigger actions in other systems.' },
          { title: 'Reasoning and adapting', body: 'An agent can check the result of one step and adjust its next step based on what it finds.' },
          { title: 'A spectrum of autonomy', body: 'Agents range from simple rule-followers to more autonomous systems that plan multiple steps ahead.' },
        ],
      },
      {
        kind: 'list',
        heading: 'Business examples',
        items: [
          { title: 'Order processing agent', body: 'Checks inventory, confirms pricing, and places an order — across multiple systems.' },
          { title: 'IT helpdesk agent', body: 'Diagnoses an issue, checks a knowledge base, and resets an account if appropriate — without a human doing each step.' },
          { title: 'Research agent', body: 'Searches multiple sources, compares findings, and compiles a summary report.' },
        ],
      },
    ],
    quiz: [
      {
        prompt: 'What makes something an "AI agent" rather than a simple chatbot?',
        options: [
          'It can take actions and complete multi-step tasks toward a goal, not just reply once',
          'It uses a bigger font',
          'It only works on weekends',
          'It cannot be a language model',
        ],
        answer: 0,
        explanation: 'Agents go beyond a single reply — they can plan steps, call tools, and act toward completing a goal.',
      },
      {
        prompt: 'What can an AI agent do that a plain chatbot typically can’t?',
        options: [
          'Call tools or APIs to take real actions',
          'Understand any language instantly',
          'Run without any instructions at all',
          'Avoid ever making mistakes',
        ],
        answer: 0,
        explanation: 'A key feature of agents is the ability to call external tools or APIs to actually do something, not just describe it.',
      },
      {
        prompt: 'What does it mean for an agent to "adapt" during a task?',
        options: [
          'It checks the result of one step and adjusts its next step accordingly',
          'It changes its name',
          'It stops working after one step no matter what',
          'It ignores all previous steps',
        ],
        answer: 0,
        explanation: 'Agents can reason over intermediate results and adjust their plan as they go, rather than following one fixed script.',
      },
      {
        prompt: 'Which is a realistic business example of an AI agent?',
        options: [
          'An agent that checks inventory, confirms pricing, and places an order across systems',
          'A calculator that only adds two numbers',
          'A printed instruction manual',
          'A static webpage with no interactivity',
        ],
        answer: 0,
        explanation: 'A multi-step task like checking inventory, confirming pricing, and placing an order is a classic example of an agent acting across systems.',
      },
    ],
  },
  {
    id: 'technical-beginner-7',
    partLabel: 'Part 7 of 10',
    part: 7,
    title: 'Tokenization: How Text Becomes Tokens',
    tagline: 'Before a model can "read" anything, your text gets chopped into tokens — this is that process, explained.',
    requirement: 'half',
    minutes: 14,
    sections: [
      {
        kind: 'lead',
        text: 'Models never see words. They see tokens.',
        body: 'Every prompt you type gets broken into small chunks called tokens before a model ever processes it — and the way that chopping happens explains a surprising number of AI quirks, from mangled arithmetic to weird behavior on rare words. This video walks through what tokens actually are and how text-to-token conversion works in practice.',
      },
      {
        kind: 'video',
        youtubeId: 'iuSBUGghYjk',
        heading: 'Watch: Tokenization Explained (~12 min)',
        caption: 'Unfold Data Science (~12 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Tokens are not words', body: 'A token can be a whole word, part of a word (a subword), or even a single character — common words often become one token, longer or rarer words get split into pieces.' },
          { title: 'Tokenization is the first step', body: 'Before any model can process text, it must convert raw text into a sequence of tokens using a fixed vocabulary the model was trained with.' },
          { title: 'Vocabulary size is a design tradeoff', body: 'A bigger token vocabulary can represent more text in fewer tokens, but makes the model larger and training slower — tokenizer design balances these costs.' },
          { title: 'Tokens, not characters, are the unit of cost and context', body: 'Model context windows and API pricing are measured in tokens, not words or characters, which is why token counts matter practically.' },
          { title: 'Same text, different tokenizers', body: 'Different models use different tokenizers, so the same sentence can be split into a different number and shape of tokens depending on the model.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What is a "token" in the context of an LLM?', options: ['Always exactly one word', 'A unit of text — a word, part of a word, or a character — that the model actually processes', 'A password used to access the model API', 'A unit of GPU memory'], answer: 1, explanation: 'Tokens are the basic text units models operate on, and they can be whole words, subwords, or characters depending on the tokenizer.' },
      { prompt: 'Why are longer or rarer words often split into multiple tokens?', options: ['To make the text harder to read', 'Because the tokenizer\'s fixed vocabulary only has entries for common pieces of text, so uncommon words get broken into smaller known chunks', 'Because models can only read 5 letters at a time', 'It happens randomly'], answer: 1, explanation: 'Tokenizers build a fixed vocabulary of common chunks; anything not in that vocabulary as a whole word gets decomposed into smaller pieces that are.' },
      { prompt: 'What happens before a language model can process any input text?', options: ['The text is translated to English', 'The text is converted into a sequence of tokens using the model\'s tokenizer', 'The text is compressed into an image', 'Nothing — models read raw text directly'], answer: 1, explanation: 'Tokenization is the mandatory first preprocessing step that converts raw text into tokens the model can consume.' },
      { prompt: 'Why does token vocabulary size matter as a design choice?', options: ['It has no real effect', 'Bigger vocabularies can represent text more compactly but increase model size and training cost', 'Bigger vocabularies always make training faster', 'Vocabulary size only affects image models'], answer: 1, explanation: 'There\'s a tradeoff: more vocabulary entries mean fewer tokens per piece of text, but a larger, more expensive model.' },
      { prompt: 'What are LLM context windows and API costs typically measured in?', options: ['Words', 'Characters', 'Tokens', 'Sentences'], answer: 2, explanation: 'Both context window limits and usage-based pricing are counted in tokens, not words or characters.' },
      { prompt: 'If you feed the same sentence to two different LLMs, will it always produce the exact same tokens?', options: ['Yes, tokenization is universal across all models', 'No — different models use different tokenizers, so the split can differ', 'Only if the sentence is in English', 'Only if the sentence has no punctuation'], answer: 1, explanation: 'Tokenizers are model-specific, so the same text can be tokenized differently depending on which model\'s tokenizer is used.' },
      { prompt: 'What is a practical reason tokenization matters to someone using an AI tool day-to-day?', options: ['It determines the color of the chat interface', 'It affects how much text fits in a prompt and how usage cost is calculated', 'It has no practical effect on users', 'It only matters for image generation'], answer: 1, explanation: 'Since context limits and billing are token-based, understanding tokenization helps explain why long inputs get cut off or cost more.' },
    ],
  },
  {
    id: 'technical-beginner-8',
    partLabel: 'Part 8 of 10',
    part: 8,
    title: 'What Are Embeddings? Turning Meaning Into Vectors',
    tagline: 'How AI represents the meaning of words as points in space — and why nearby points mean similar things.',
    requirement: 'required',
    minutes: 17,
    sections: [
      {
        kind: 'lead',
        text: 'A word, turned into a list of numbers, that somehow captures its meaning.',
        body: 'Embeddings are how models turn words (and other content) into vectors — lists of numbers — positioned so that similar meanings end up close together in that space. This video shows how word vectors are built and demonstrates some surprisingly intuitive, and sometimes surprising, things they can do.',
      },
      {
        kind: 'video',
        youtubeId: 'gQddtTdmG_8',
        heading: 'Watch: Vectoring Words (Word Embeddings) (~15 min)',
        caption: 'Computerphile (~15 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Words become vectors', body: 'Each word is mapped to a point (a vector of numbers) in a multi-dimensional space, learned from how words are used in huge amounts of text.' },
          { title: 'Distance encodes similarity', body: 'Words with related meanings end up positioned close together in the vector space, while unrelated words are far apart.' },
          { title: 'Direction can encode relationships', body: 'The direction and distance between two word vectors can capture a relationship — arithmetic on vectors (like the classic "king minus man plus woman") can approximate analogies.' },
          { title: 'Embeddings are learned, not designed', body: 'These vector positions are not hand-crafted by humans — a model learns them automatically by training on patterns of word co-occurrence in text.' },
          { title: 'The representation can inherit odd or biased patterns', body: 'Because embeddings are learned from real-world text, they can pick up unexpected or undesirable associations present in the training data.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What is a word embedding?', options: ['A dictionary definition of a word', 'A vector (list of numbers) representing a word\'s meaning in a multi-dimensional space', 'A compressed audio file of the word being spoken', 'A hyperlink between two documents'], answer: 1, explanation: 'Embeddings map words to numeric vectors positioned in a space that captures aspects of their meaning.' },
      { prompt: 'What does it typically mean if two word vectors are close together in embedding space?', options: ['The words are spelled similarly', 'The words tend to be used in similar contexts / have related meaning', 'The words are the same length', 'Nothing — position is random'], answer: 1, explanation: 'Proximity in embedding space generally reflects semantic or contextual similarity, not spelling.' },
      { prompt: 'How are word embeddings typically produced?', options: ['Manually assigned by linguists', 'Learned automatically by a model trained on large amounts of text', 'Randomly generated once and never changed', 'Copied directly from a dictionary'], answer: 1, explanation: 'Embeddings are learned representations, discovered by training on patterns of word usage rather than hand-designed.' },
      { prompt: 'What does "vector arithmetic" on embeddings (e.g., combining and comparing word vectors) demonstrate?', options: ['That embeddings are purely random', 'That directions/distances between vectors can sometimes capture meaningful relationships between words', 'That all words have the same vector', 'That embeddings only work for nouns'], answer: 1, explanation: 'A famous property of word embeddings is that relationships between words can sometimes be approximated with vector addition and subtraction.' },
      { prompt: 'Why can embeddings sometimes reflect biased or unexpected associations?', options: ['Because the underlying math is broken', 'Because embeddings are learned from real text, which can contain those patterns and biases', 'Because embeddings are assigned by a committee', 'This never happens'], answer: 1, explanation: 'Since embeddings learn from real-world text data, they can absorb and reproduce biases or quirks present in that data.' },
      { prompt: 'What kind of space do embeddings live in?', options: ['A single number line (1 dimension)', 'A multi-dimensional numeric space', 'A 2D image grid', 'A tree structure'], answer: 1, explanation: 'Embeddings are vectors with many numeric dimensions, not a simple single-value scale.' },
      { prompt: 'Why are embeddings useful beyond just words (e.g., for sentences, images, or documents)?', options: ['They are not — embeddings only work for single words', 'The same idea of mapping content to a vector space where similarity = proximity generalizes to other kinds of content', 'Embeddings can only be visualized in 3D', 'Embeddings require internet access to compute'], answer: 1, explanation: 'The core idea — representing content as vectors positioned by similarity — extends beyond words to sentences, documents, images, and more.' },
    ],
  },
  {
    id: 'technical-beginner-9',
    partLabel: 'Part 9 of 10',
    part: 9,
    title: 'Gradient Descent: How Models Actually Learn',
    tagline: 'The step-by-step process models use to gradually get better at their task — nudging parameters downhill toward fewer errors.',
    requirement: 'half',
    minutes: 26,
    sections: [
      {
        kind: 'lead',
        text: 'Learning, for a model, means slowly reducing how wrong it is.',
        body: 'Gradient descent is the core technique that lets machine learning models "learn": it starts with a guess, measures how wrong that guess is, and repeatedly nudges the model\'s internal numbers in the direction that reduces the error. This video walks through that process step by step with a simple, concrete example.',
      },
      {
        kind: 'video',
        youtubeId: 'sDv4f4s2SB8',
        heading: 'Watch: Gradient Descent, Step-by-Step (~24 min)',
        caption: 'StatQuest with Josh Starmer (~24 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Start with a loss function', body: 'Learning begins by defining a way to measure error — how far off the model\'s current predictions are from the correct answers.' },
          { title: 'Take small steps downhill', body: 'Gradient descent repeatedly adjusts a parameter in the direction that reduces the error, like walking downhill toward the bottom of a valley.' },
          { title: 'Step size depends on slope and learning rate', body: 'How big each adjustment is depends on how steep the error curve is at that point, scaled by a "learning rate" that controls how aggressively the model updates.' },
          { title: 'Stopping conditions', body: 'The process stops once the steps become tiny (little further improvement) or after a maximum number of iterations, landing at or near the lowest-error point.' },
          { title: 'Stochastic gradient descent scales it up', body: 'For large datasets, using random small batches of data at each step (stochastic gradient descent) makes the process much faster while still converging.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What is the basic goal of gradient descent?', options: ['To randomly guess parameters until one works', 'To iteratively adjust a model\'s parameters to reduce its error, measured by a loss function', 'To memorize the training data exactly', 'To increase the model\'s size'], answer: 1, explanation: 'Gradient descent is an iterative optimization process that reduces a defined error/loss by adjusting parameters step by step.' },
      { prompt: 'What determines the size of each step gradient descent takes?', options: ['A fixed step size that never changes regardless of the data', 'The steepness of the error curve at that point, scaled by the learning rate', 'The number of words in the training data', 'The color of the graph'], answer: 1, explanation: 'Step size is proportional to the slope (steepness) of the loss curve at the current point, adjusted by the learning rate.' },
      { prompt: 'What is a "learning rate" in gradient descent?', options: ['How fast the video plays', 'A setting that controls how large each parameter update step is', 'The number of training examples used', 'The final accuracy of the model'], answer: 1, explanation: 'The learning rate scales how big each adjustment step is during the optimization process.' },
      { prompt: 'When does gradient descent typically stop iterating?', options: ['After exactly one step, always', 'When the step sizes become very small (little further improvement) or a maximum number of iterations is reached', 'Only when the loss becomes exactly zero', 'It never stops'], answer: 1, explanation: 'Gradient descent stops when improvements become negligible or after a set number of iterations, not necessarily at a perfect zero-error point.' },
      { prompt: 'What is stochastic gradient descent?', options: ['A version that uses random small batches of data at each step instead of the whole dataset', 'A version that skips the loss function entirely', 'A method with no learning rate', 'A way to visualize embeddings'], answer: 0, explanation: 'Stochastic gradient descent speeds up training on large datasets by updating parameters using small random subsets of data rather than the full dataset each time.' },
      { prompt: 'What analogy is commonly used to describe gradient descent\'s process?', options: ['Climbing a mountain to the peak', 'Walking downhill step by step toward the lowest point in a valley (minimum error)', 'Spinning a roulette wheel', 'Sorting a deck of cards'], answer: 1, explanation: 'Gradient descent is often visualized as descending toward the bottom of an error "valley," taking steps proportional to the slope.' },
      { prompt: 'Why does a model need a loss function before gradient descent can begin?', options: ['It doesn\'t — loss functions are optional', 'Gradient descent needs a way to measure how wrong the current parameters are in order to know which direction reduces error', 'Loss functions are only used after training is complete', 'Loss functions replace the need for training data'], answer: 1, explanation: 'The loss function quantifies error, giving gradient descent the signal it needs to know which direction to adjust parameters.' },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════
   TECHNICAL TRACK — INTERMEDIATE
   ══════════════════════════════════════════════════════════════════════ */

const technicalIntermediateModules: Module[] = [
  {
    id: 'technical-intermediate-1',
    partLabel: 'Part 1 of 10',
    part: 1,
    title: 'Vector Databases Explained',
    tagline: 'How AI systems store and search meaning, not just keywords.',
    requirement: 'half',
    minutes: 11,
    sections: [
      {
        kind: 'lead',
        text: 'Search engines used to match words. AI systems match meaning.',
        body: 'A vector database stores content as high-dimensional embeddings so that "similar meaning" becomes "nearby points in space." This is the backbone of modern semantic search and retrieval-augmented generation (RAG). This video walks through what vector databases are and why they matter for AI applications.',
      },
      {
        kind: 'video',
        youtubeId: 'gl1r1XV0SLw',
        heading: 'Watch: What is a Vector Database? Powering Semantic Search & AI Applications (~9 min)',
        caption: 'IBM Technology (~9 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Vector embeddings', body: 'Text, images, or other data is converted into numeric vectors that capture semantic meaning, not just literal content.' },
          { title: 'Similarity, not exact match', body: 'Vector databases find items that are "close" in vector space, enabling search by meaning rather than by keyword.' },
          { title: 'Bridging the semantic gap', body: 'Traditional keyword search misses synonyms and context; vector search closes that gap for natural-language queries.' },
          { title: 'Foundation for RAG', body: 'Vector databases are the retrieval layer that feeds relevant context into an LLM prompt in retrieval-augmented generation pipelines.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What does a vector database primarily store and index?', options: ['Raw SQL tables', 'High-dimensional numeric embeddings representing meaning', 'Compressed video files', 'User login credentials'], answer: 1, explanation: 'Vector databases store data as embeddings — numeric vectors that capture semantic meaning.' },
      { prompt: 'How does vector search differ from traditional keyword search?', options: ['It is slower but more accurate for exact matches', 'It matches items by semantic similarity rather than literal word overlap', 'It only works on images', 'It requires no indexing'], answer: 1, explanation: 'Vector search finds items that are semantically close, even without shared keywords.' },
      { prompt: 'What AI application is a vector database most commonly paired with?', options: ['Retrieval-augmented generation (RAG)', 'Video encoding', 'Password hashing', 'Spreadsheet formulas'], answer: 0, explanation: 'Vector databases supply the retrieval step that feeds relevant context into an LLM in RAG pipelines.' },
      { prompt: 'What is the "semantic gap" the video refers to?', options: ['The delay between a query and a response', 'The mismatch between literal keyword matching and true meaning-based matching', 'A gap in GPU memory', 'A missing column in a database schema'], answer: 1, explanation: 'Keyword search can miss relevant results because it does not understand meaning — embeddings close that gap.' },
      { prompt: 'In vector space, what does it mean for two data points to be "close"?', options: ['They were uploaded at the same time', 'They are semantically or contextually similar', 'They have the same file size', 'They belong to the same user account'], answer: 1, explanation: 'Distance in vector space corresponds to similarity in meaning.' },
      { prompt: 'Which of these is NOT something a vector database is typically used for?', options: ['Semantic document search', 'Recommendation systems', 'Storing raw transaction logs for accounting compliance', 'Powering RAG context retrieval'], answer: 2, explanation: 'Vector databases are optimized for similarity search on embeddings, not general-purpose transactional record-keeping.' },
    ],
  },
  {
    id: 'technical-intermediate-2',
    partLabel: 'Part 2 of 10',
    part: 2,
    title: 'Fine-Tuning vs RAG vs Prompt Engineering',
    tagline: 'Three different levers for customizing an AI model — and when to pull each one.',
    requirement: 'required',
    minutes: 15,
    sections: [
      {
        kind: 'lead',
        text: 'Not every AI problem needs a bigger hammer — sometimes it needs a different one.',
        body: 'When teams want an LLM to behave better for their use case, they usually reach for one of three tools: prompt engineering, retrieval-augmented generation, or fine-tuning. This video breaks down what each approach actually does, and the tradeoffs between speed, cost, and customization.',
      },
      {
        kind: 'video',
        youtubeId: 'zYGDpG-pTho',
        heading: 'Watch: RAG vs Fine-Tuning vs Prompt Engineering: Optimizing AI Models (~13 min)',
        caption: 'IBM Technology (~13 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Prompt engineering', body: 'Crafting effective instructions to steer model output — fastest and cheapest, but limited by what the base model already knows.' },
          { title: 'RAG for fresh knowledge', body: 'Retrieval-augmented generation pulls in external, up-to-date data at query time so the model can answer with information it wasn\'t trained on.' },
          { title: 'Fine-tuning for deep customization', body: 'Fine-tuning adjusts the model\'s weights on domain-specific data, changing how it responds at a deeper level than prompting or retrieval.' },
          { title: 'Not mutually exclusive', body: 'Mature production systems often combine all three — a fine-tuned model, using RAG for current facts, guided by well-engineered prompts.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'Which approach is generally the fastest and cheapest way to change model behavior?', options: ['Fine-tuning', 'Prompt engineering', 'Retraining from scratch', 'Building a new vector database'], answer: 1, explanation: 'Prompt engineering requires no training and can be iterated on instantly.' },
      { prompt: 'What problem is RAG best suited to solve?', options: ['Giving the model access to current or external information it wasn\'t trained on', 'Making the model smaller', 'Reducing GPU cost', 'Changing the model\'s tone permanently'], answer: 0, explanation: 'RAG retrieves relevant external data at query time, extending the model\'s effective knowledge.' },
      { prompt: 'What does fine-tuning actually change about a model?', options: ['Only the system prompt', 'The model\'s underlying weights, based on additional training data', 'The vector database schema', 'The user interface'], answer: 1, explanation: 'Fine-tuning updates model weights so behavior changes are baked in, not just requested via prompt.' },
      { prompt: 'According to the video, are these three approaches mutually exclusive in production?', options: ['Yes, teams must pick exactly one', 'No, mature systems often combine all three', 'RAG and fine-tuning can never coexist', 'Prompt engineering is deprecated once you fine-tune'], answer: 1, explanation: 'The video notes production AI often layers prompt engineering, RAG, and fine-tuning together.' },
      { prompt: 'Which approach requires the most upfront investment in data preparation and training?', options: ['Prompt engineering', 'Fine-tuning', 'RAG', 'None of them require data preparation'], answer: 1, explanation: 'Fine-tuning requires a curated training dataset and a training run, unlike prompting or retrieval.' },
      { prompt: 'If a company needs answers based on documents updated daily, which approach is the best fit?', options: ['Fine-tuning once a year', 'RAG, so retrieval reflects the latest documents', 'Prompt engineering alone', 'None of the above'], answer: 1, explanation: 'RAG retrieves current data at query time, making it ideal for frequently changing information.' },
    ],
  },
  {
    id: 'technical-intermediate-3',
    partLabel: 'Part 3 of 10',
    part: 3,
    title: 'How Do You Know an LLM Is Actually "Good"?',
    tagline: 'Benchmarks, evaluation datasets, and why leaderboard numbers only tell part of the story.',
    requirement: 'half',
    minutes: 18,
    sections: [
      {
        kind: 'lead',
        text: 'A model that tops a leaderboard might still fail on your specific task.',
        body: 'LLM evaluation is how teams quantify whether a model is actually good — not just at general benchmarks like MMLU, but at the tasks that matter for a specific product. This video walks through how standardized benchmarks work and how to design your own evaluation for a real use case.',
      },
      {
        kind: 'video',
        youtubeId: '1JaL5eVqFq0',
        heading: 'Watch: What Do LLM Benchmarks Actually Tell Us? (~16 min)',
        caption: 'Adam Lucek (~16 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Benchmarks as standardized exams', body: 'Each benchmark is a fixed set of tasks with known correct answers, scored to produce a comparable number across models.' },
          { title: 'General benchmarks have limits', body: 'A high score on a public leaderboard benchmark does not guarantee good performance on your company\'s specific domain or task.' },
          { title: 'Building custom evaluations', body: 'Teams can create their own task-specific eval sets that better reflect real production use cases than generic benchmarks.' },
          { title: 'Quantitative comparison', body: 'Scoring against ground-truth answers lets you rank and compare models objectively, rather than relying on gut feel.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What is a standardized LLM benchmark best described as?', options: ['A random sample of user chats', 'A fixed set of tasks with known correct answers used to produce a comparable score', 'A model\'s training log', 'A GPU stress test'], answer: 1, explanation: 'Benchmarks function like exams: fixed tasks, known answers, and a scoring system.' },
      { prompt: 'Why might a model that tops a public leaderboard still perform poorly for a specific company?', options: ['Leaderboards are always fake', 'General benchmarks may not reflect that company\'s specific domain or task', 'Leaderboard models are always smaller', 'Public benchmarks are never public'], answer: 1, explanation: 'General benchmarks test broad capability, not necessarily your specific use case.' },
      { prompt: 'What does the video recommend for teams that need evaluation tailored to their product?', options: ['Only trust public leaderboards', 'Build custom, task-specific evaluation sets', 'Avoid evaluation entirely', 'Use only human intuition'], answer: 1, explanation: 'Custom evals grounded in real production tasks give a more accurate read on model fit.' },
      { prompt: 'What is MMLU, mentioned as an example benchmark type?', options: ['A GPU driver', 'A multiple-choice benchmark spanning subjects like math, history, and law', 'A vector database', 'A fine-tuning technique'], answer: 1, explanation: 'MMLU (Massive Multitask Language Understanding) tests broad subject-matter knowledge via multiple-choice questions.' },
      { prompt: 'What makes benchmark scoring "quantitative"?', options: ['It relies solely on subjective reviewer opinion', 'It compares model answers against ground-truth answers to produce a numeric score', 'It measures only response speed', 'It only counts word length'], answer: 1, explanation: 'Scoring against ground truth produces an objective, comparable number.' },
      { prompt: 'According to the video, is running your own evaluation harness feasible for a team?', options: ['No, only large labs can do it', 'Yes, the video explains how to run your own', 'It requires no benchmark design at all', 'Only possible with proprietary tools'], answer: 1, explanation: 'The video explicitly covers how to run your own evaluation, not just interpret existing leaderboards.' },
    ],
  },
  {
    id: 'technical-intermediate-4',
    partLabel: 'Part 4 of 10',
    part: 4,
    title: 'How LLM Tool Calling Works',
    tagline: 'The mechanism that lets a model reach outside itself and act on the real world.',
    requirement: 'required',
    minutes: 12,
    sections: [
      {
        kind: 'lead',
        text: 'An LLM can\'t browse the web or check a database on its own — tool calling is how it asks for help.',
        body: 'Tool calling (also called function calling) lets a model recognize when it needs external information or action, describe that need in a structured format, and hand off execution to your application code. This is the mechanism underneath most modern AI agents.',
      },
      {
        kind: 'video',
        youtubeId: 'QiRdYCNXAxk',
        heading: 'Watch: How LLM Tool Calling Works (~10 min)',
        caption: 'Tommy Eberle (~10 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Structured function descriptions', body: 'Developers describe available tools/functions to the model (name, parameters, purpose) so it knows what it can call.' },
          { title: 'The model doesn\'t execute code itself', body: 'The LLM outputs a structured request to call a tool; your application actually executes it and returns the result.' },
          { title: 'A foundational concept for agents', body: 'Tool calling is described as fundamental to how AI agents operate — it\'s the bridge between reasoning and action.' },
          { title: 'Works across major models', body: 'The video demonstrates tool calling behavior with models like GPT-4o and Claude.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'Who actually executes the function when an LLM makes a "tool call"?', options: ['The LLM executes it internally', 'The application/developer code that receives the structured call request', 'The vector database', 'It never actually executes'], answer: 1, explanation: 'The LLM only outputs a structured request; the surrounding application code performs the actual execution.' },
      { prompt: 'What does a developer need to provide for a model to use tool calling?', options: ['Nothing, it works automatically', 'A structured description of available tools, their names, and parameters', 'A fine-tuned checkpoint', 'A new vector database'], answer: 1, explanation: 'Models need structured descriptions of the tools/functions they can call in order to use them correctly.' },
      { prompt: 'Why is tool calling described as foundational to AI agents?', options: ['It has nothing to do with agents', 'It\'s the mechanism that lets a model take real actions beyond generating text', 'It only affects UI styling', 'It replaces the need for prompts entirely'], answer: 1, explanation: 'Tool calling is the bridge between model reasoning and real-world action, which is core to agent behavior.' },
      { prompt: 'Which models does the video demonstrate tool calling with?', options: ['Only open-source models', 'Models like GPT-4o and Claude', 'Only image generation models', 'Only a custom in-house model'], answer: 1, explanation: 'The video shows tool-calling behavior using GPT-4o and Claude as examples.' },
      { prompt: 'What is the main benefit of tool calling for an LLM-based application?', options: ['It makes the model smaller', 'It lets the model access external data/APIs it wasn\'t trained on', 'It removes the need for prompts', 'It eliminates hallucinations completely'], answer: 1, explanation: 'Tool calling extends what a model can do by connecting it to live external systems and data.' },
    ],
  },
  {
    id: 'technical-intermediate-5',
    partLabel: 'Part 5 of 10',
    part: 5,
    title: 'Prompt Chaining and Orchestration with LangChain',
    tagline: 'Turning one big prompt into a pipeline of smaller, composable steps.',
    requirement: 'half',
    minutes: 17,
    sections: [
      {
        kind: 'lead',
        text: 'Complex AI tasks rarely fit in a single prompt — they fit in a pipeline.',
        body: 'Prompt chaining feeds the output of one LLM call into the next step, so each prompt specializes in one task while together they form a larger workflow. This video looks at prompt templating and chaining patterns using LangChain, a widely used orchestration framework.',
      },
      {
        kind: 'video',
        youtubeId: 'jPeOAOvKFHE',
        heading: 'Watch: Prompt Templating and Techniques in LangChain (~15 min)',
        caption: 'James Briggs (~15 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Prompt templates', body: 'Reusable prompt structures with dynamic placeholders let you generate consistent prompts without hand-writing each one.' },
          { title: 'Chaining outputs', body: 'The output of one prompt/LLM call becomes the input to the next, building a multi-step pipeline instead of one giant prompt.' },
          { title: 'Before fine-tuning became flexible', body: 'The video notes that historically, adapting a model to a use case meant fine-tuning weights — templating and chaining offer a lighter-weight alternative.' },
          { title: 'Composable building blocks', body: 'LangChain\'s abstractions let developers combine templates, retrieval, and parsing steps declaratively.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What is a "prompt template" primarily used for?', options: ['Storing model weights', 'Creating reusable prompt structures with dynamic placeholders', 'Compressing a model for deployment', 'Indexing vectors'], answer: 1, explanation: 'Templates let you plug variables into a consistent prompt structure instead of rewriting prompts each time.' },
      { prompt: 'In prompt chaining, what becomes the input to the next step?', options: ['The original user query only, unchanged', 'The output of the previous prompt/LLM call', 'A random sample from the training set', 'The vector database schema'], answer: 1, explanation: 'Chaining feeds one step\'s output into the next step\'s input, forming a pipeline.' },
      { prompt: 'What alternative to fine-tuning does the video frame prompt templating as?', options: ['A more expensive way to adapt models', 'A lighter-weight way to adapt a model\'s use case without changing its weights', 'A replacement for tool calling', 'A type of vector database'], answer: 1, explanation: 'The video contrasts templating/chaining with the older, heavier approach of fine-tuning weights.' },
      { prompt: 'Why break a complex AI task into multiple chained prompts rather than one giant prompt?', options: ['It\'s always slower and should be avoided', 'Each step can specialize in one task, making the pipeline easier to reason about', 'Chaining is only cosmetic and changes nothing', 'It removes the need for any prompt at all'], answer: 1, explanation: 'Specializing each prompt in one sub-task makes pipelines more reliable and maintainable.' },
      { prompt: 'What kind of framework is LangChain, as covered in this video?', options: ['A GPU driver', 'An orchestration framework for composing prompts and LLM workflow steps', 'A vector database product', 'A model fine-tuning service'], answer: 1, explanation: 'LangChain provides abstractions for composing prompt templates, chains, and other workflow steps.' },
      { prompt: 'What do dynamic placeholders in a prompt template allow?', options: ['Hardcoding one fixed prompt forever', 'Inserting variable content into a consistent prompt structure at runtime', 'Removing the need for an LLM', 'Directly editing model weights'], answer: 1, explanation: 'Placeholders let the same template generate many different concrete prompts by substituting variables.' },
    ],
  },
  {
    id: 'technical-intermediate-6',
    partLabel: 'Part 6 of 10',
    part: 6,
    title: 'Model Quantization: Making LLMs Smaller and Faster',
    tagline: 'How compressing model weights trades a little precision for a lot of speed and memory savings.',
    requirement: 'optional',
    minutes: 22,
    sections: [
      {
        kind: 'lead',
        text: 'Running a full-precision LLM can require far more memory than most hardware has to spare.',
        body: 'Quantization is a form of lossy compression for model weights — similar in spirit to JPEG for images — that shrinks a model so it fits in less memory, usually at a small, often unnoticeable, quality cost. This video surveys the major quantization techniques used in practice today.',
      },
      {
        kind: 'video',
        youtubeId: '0pF6GdbwMo4',
        heading: 'Watch: LLM Quantization Techniques Explained - GPTQ, AWQ, GGUF, HQQ, BitNet (~20 min)',
        caption: 'Joydeep Bhattacharjee (~20 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Quantization as lossy compression', body: 'Reducing the numeric precision of model weights (e.g., from 32-bit to 8-bit or 4-bit) shrinks model size dramatically.' },
          { title: 'Multiple competing techniques', body: 'GPTQ, AWQ, GGUF, HQQ, and BitNet represent different approaches and tradeoffs for quantizing weights.' },
          { title: 'Format vs technique', body: 'GGUF is a file format (used by tools like llama.cpp) for storing quantized weights, distinct from the quantization algorithm itself.' },
          { title: 'Small accuracy cost, big efficiency gain', body: 'Well-chosen quantization schemes (like 8-bit) can cut memory use substantially with only a small drop in output quality.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What is model quantization most similar to, as described in the video?', options: ['Encryption', 'A form of lossy compression, like JPEG for images', 'A type of fine-tuning', 'A vector database index'], answer: 1, explanation: 'Quantization compresses model weights in a lossy way, trading some precision for size and speed.' },
      { prompt: 'What is GGUF, as distinguished from a quantization algorithm like GPTQ?', options: ['A GPU chip', 'A file format for storing quantized weights, used by tools like llama.cpp', 'A benchmark dataset', 'A vector database'], answer: 1, explanation: 'GGUF is a storage format with metadata about the quantization scheme, not a quantization algorithm itself.' },
      { prompt: 'What is the general tradeoff quantization makes?', options: ['More memory for less speed', 'Reduced numeric precision in exchange for smaller size and faster inference', 'Higher cost for better accuracy only', 'No tradeoff at all'], answer: 1, explanation: 'Quantization reduces precision to save memory and increase speed, usually at a small accuracy cost.' },
      { prompt: 'Which of these is named in the video as a quantization technique?', options: ['AWQ', 'HTTP', 'JSON', 'SQL'], answer: 0, explanation: 'AWQ (Activation-aware Weight Quantization) is one of the techniques covered alongside GPTQ, GGUF, HQQ, and BitNet.' },
      { prompt: 'Why would a team choose to quantize a model before deployment?', options: ['To make the model larger', 'To fit the model into less memory/VRAM and run it faster on more affordable hardware', 'To increase training data size', 'To remove the need for prompts'], answer: 1, explanation: 'Quantization is primarily used to reduce memory footprint and improve inference speed for deployment.' },
      { prompt: 'Does quantization always produce zero loss in output quality?', options: ['Yes, it is always lossless', 'No, it typically introduces a small, often minor quality cost', 'It always destroys the model', 'It only affects training speed, never inference'], answer: 1, explanation: 'The video frames quantization as lossy compression — there is usually a small, often unnoticeable quality tradeoff.' },
    ],
  },
  {
    id: 'technical-intermediate-7',
    partLabel: 'Part 7 of 10',
    part: 7,
    title: 'MLOps Fundamentals: Getting Models into Production',
    tagline: 'Training a good model is only half the job — MLOps is how it stays good in production.',
    requirement: 'optional',
    minutes: 12,
    sections: [
      {
        kind: 'lead',
        text: 'A model that works perfectly in a notebook can still fail the moment it meets real traffic.',
        body: 'MLOps applies DevOps-style discipline — automation, monitoring, versioning, and repeatable pipelines — to machine learning systems. This beginner-friendly video breaks down how ML models actually get deployed, monitored, and maintained in real-world applications.',
      },
      {
        kind: 'video',
        youtubeId: '9bf4hDi7_jk',
        heading: 'Watch: MLOps Explained in 10 Minutes | Complete Beginner Guide (~10 min)',
        caption: 'DevOps Hint (~10 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Beyond training', body: 'MLOps covers everything after a model is trained: deployment, serving, monitoring, and retraining.' },
          { title: 'Automation and repeatability', body: 'Good MLOps practice turns deployment into a repeatable pipeline rather than a manual, one-off process.' },
          { title: 'Monitoring models in production', body: 'Once deployed, models need ongoing monitoring to catch performance degradation or data drift.' },
          { title: 'Best practices for beginners', body: 'The video frames MLOps as a set of step-by-step best practices accessible to newcomers, not just specialized ML infra teams.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What does MLOps primarily focus on, beyond just training a model?', options: ['Only writing training code', 'Deploying, monitoring, and maintaining models in production', 'Designing neural network architectures', 'Writing marketing copy for AI products'], answer: 1, explanation: 'MLOps is about the full lifecycle after training: deployment, serving, monitoring, and retraining.' },
      { prompt: 'Why does the video emphasize automation in MLOps?', options: ['Automation is optional and rarely used', 'Automation turns deployment into a repeatable, reliable pipeline instead of a manual process', 'Automation replaces the need for monitoring', 'Automation only applies to training, not deployment'], answer: 1, explanation: 'Repeatable, automated pipelines reduce manual error and make deployments consistent.' },
      { prompt: 'What happens to a model after it is deployed, according to MLOps practice?', options: ['Nothing, it runs forever unchanged', 'It should be monitored for performance issues and data drift over time', 'It is immediately deleted', 'It is only used once'], answer: 1, explanation: 'Ongoing monitoring is a core MLOps practice to catch degradation or drift after deployment.' },
      { prompt: 'Is MLOps framed in the video as accessible to beginners?', options: ['No, it requires years of infrastructure experience first', 'Yes, it is presented as a step-by-step beginner guide', 'It is only for data scientists, never engineers', 'It has nothing to do with best practices'], answer: 1, explanation: 'The video is explicitly framed as a complete beginner guide covering best practices.' },
      { prompt: 'Which of these is a typical MLOps concern?', options: ['Detecting data drift in production', 'Choosing font colors for a dashboard', 'Writing unit tests for unrelated web apps', 'Selecting a marketing slogan'], answer: 0, explanation: 'Data drift detection is a core production monitoring concern in MLOps.' },
    ],
  },
  {
    id: 'technical-intermediate-8',
    partLabel: 'Part 8 of 10',
    part: 8,
    title: 'Open-Source vs Closed AI: Choosing Your Stack',
    tagline: 'Weighing control and cost against convenience and support when picking a model.',
    requirement: 'half',
    minutes: 12,
    sections: [
      {
        kind: 'lead',
        text: 'The choice between an open-weight model and a closed API shapes everything downstream.',
        body: 'Open-source models (like Llama-family models) can be downloaded, modified, and self-hosted, while closed models (like GPT-family models) are accessed only through a provider\'s API. This video walks through the tradeoffs across LLMs, agents, and the broader AI stack.',
      },
      {
        kind: 'video',
        youtubeId: '_QfxGZGITGw',
        heading: 'Watch: Open Source vs Closed AI: LLMs, Agents & the AI Stack Explained (~10 min)',
        caption: 'IBM Technology (~10 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Control and customization', body: 'Open-source models can be self-hosted, fine-tuned, and inspected, giving teams full control over behavior and data.' },
          { title: 'Convenience and support', body: 'Closed models typically offer easier integration, managed scaling, and provider support/SLAs, at the cost of less visibility into internals.' },
          { title: 'Cost structure differs', body: 'Open models avoid per-token API fees but require infrastructure investment; closed models shift that cost into ongoing usage fees.' },
          { title: 'The stack extends past the model', body: 'The open-vs-closed choice also applies to agent frameworks and tooling built around the model, not just the LLM itself.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What is a key advantage of open-source models over closed models?', options: ['They require no infrastructure at all', 'They can be self-hosted, modified, and fully inspected', 'They are always more accurate', 'They eliminate the need for prompts'], answer: 1, explanation: 'Open-source models give teams full control, customization, and visibility, since the weights are available.' },
      { prompt: 'What is a key advantage closed models typically offer?', options: ['Full visibility into training data', 'Easier integration and managed scaling with provider support', 'Zero ongoing usage cost', 'Unlimited customization of model weights'], answer: 1, explanation: 'Closed models are often easier to integrate, with the provider handling scaling and support.' },
      { prompt: 'How does the cost structure typically differ between open and closed models?', options: ['Open models require ongoing per-token fees; closed models are free', 'Open models shift cost to self-hosted infrastructure; closed models shift cost to usage fees', 'Neither has any cost', 'Closed models are always cheaper overall'], answer: 1, explanation: 'Open models trade infrastructure investment for no per-token fees; closed models charge ongoing usage fees instead.' },
      { prompt: 'Does the open-vs-closed comparison in the video apply only to the base LLM?', options: ['Yes, only to the raw model weights', 'No, it also extends to agents and tooling built around the model', 'It only applies to vector databases', 'It only applies to hardware choices'], answer: 1, explanation: 'The video frames the tradeoff across the broader AI stack, including agents, not just the LLM itself.' },
      { prompt: 'Which model family is used in the video as a representative open-source example?', options: ['Llama-family models', 'A proprietary closed-only model', 'A vector database product', 'A quantization library'], answer: 0, explanation: 'Llama-style models are commonly cited as the representative open-weight example versus closed alternatives.' },
    ],
  },
  {
    id: 'technical-intermediate-9',
    partLabel: 'Part 9 of 10',
    part: 9,
    title: 'RLHF: Aligning Models with Human Preferences',
    tagline: 'The training step that turns a raw text predictor into an assistant that behaves the way people want.',
    requirement: 'half',
    minutes: 20,
    sections: [
      {
        kind: 'lead',
        text: 'A model trained only to predict the next word doesn\'t automatically know what a "good" answer looks like to a human.',
        body: 'Reinforcement Learning from Human Feedback (RLHF) refines a pretrained language model by using human judgments to shape a learned reward signal, then optimizing the model against that reward. This is a core part of how models like ChatGPT are aligned to be helpful and follow instructions.',
      },
      {
        kind: 'video',
        youtubeId: 'qPN_XZcJf_s',
        heading: 'Watch: Reinforcement Learning with Human Feedback (RLHF), Clearly Explained!!! (~18 min)',
        caption: 'StatQuest with Josh Starmer (~18 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Starting from a pretrained model', body: 'RLHF builds on a large language model that has already been trained on massive text datasets — it doesn\'t start from scratch.' },
          { title: 'Human preference data', body: 'Humans rank or compare model outputs, and those judgments are used to train a separate reward model.' },
          { title: 'Reward model guides optimization', body: 'The learned reward model scores new outputs, and reinforcement learning is used to nudge the LLM toward higher-reward (more preferred) responses.' },
          { title: 'Aligning behavior, not just knowledge', body: 'RLHF changes how a model behaves and what it prioritizes in its answers, rather than adding new factual knowledge.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What does RLHF start from?', options: ['A randomly initialized model', 'An already-pretrained large language model', 'A vector database', 'A quantized model only'], answer: 1, explanation: 'RLHF is applied to a model that has already been pretrained on large text datasets.' },
      { prompt: 'What is the reward model in RLHF trained on?', options: ['Raw internet text with no labels', 'Human judgments/rankings comparing different model outputs', 'GPU utilization logs', 'Vector embeddings only'], answer: 1, explanation: 'Humans compare or rank outputs, and that preference data trains the reward model.' },
      { prompt: 'What role does reinforcement learning play once the reward model exists?', options: ['It deletes the reward model', 'It optimizes the LLM to produce outputs that score higher according to the reward model', 'It only affects tokenization', 'It replaces the pretrained model entirely with a new one'], answer: 1, explanation: 'RL is used to push the LLM\'s outputs toward higher-reward, more human-preferred responses.' },
      { prompt: 'Does RLHF primarily add new factual knowledge to a model?', options: ['Yes, that is its main purpose', 'No, it primarily shapes behavior and alignment with human preferences', 'It only compresses the model', 'It only affects the vector database'], answer: 1, explanation: 'RLHF is about aligning behavior with human preferences, not injecting new facts.' },
      { prompt: 'Why is RLHF considered important for models like ChatGPT?', options: ['It makes the model run faster', 'It helps make the model more helpful and better at following instructions as humans prefer', 'It reduces the model\'s file size', 'It eliminates the need for a reward model'], answer: 1, explanation: 'RLHF is a key technique for aligning model behavior with what humans consider helpful and appropriate.' },
      { prompt: 'What two main components does the RLHF process involve?', options: ['A vector database and a tokenizer', 'A reward model trained on human preferences, and reinforcement learning to optimize against it', 'A quantization scheme and a GPU driver', 'Only prompt engineering'], answer: 1, explanation: 'RLHF combines a learned reward model (from human feedback) with RL optimization of the base model against that reward.' },
    ],
  },
  {
    id: 'technical-intermediate-10',
    partLabel: 'Part 10 of 10',
    part: 10,
    title: 'Context Windows and Their Limitations',
    tagline: 'Why an LLM seems to "forget" things — and why bigger isn\'t always simply better.',
    requirement: 'required',
    minutes: 17,
    sections: [
      {
        kind: 'lead',
        text: 'Ever notice a long chat with an AI assistant slowly losing the thread? That\'s the context window at work.',
        body: 'A context window is the maximum amount of text an LLM can consider at once, functioning like short-term memory. This video explains what happens when that limit is exceeded, why tokens aren\'t the same as words, and practical ways to work around context limitations.',
      },
      {
        kind: 'video',
        youtubeId: 'TeQDr4DkLYo',
        heading: 'Watch: Why LLMs get dumb (Context Windows Explained) (~15 min)',
        caption: 'NetworkChuck (~15 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Context window as short-term memory', body: 'The context window holds everything the model can "see" during a conversation — once it\'s exceeded, earlier content gets pushed out and forgotten.' },
          { title: 'Tokens are not words', body: 'A token might be a whole word, part of a word, punctuation, or a space — so a token limit does not map 1:1 to a word count.' },
          { title: 'Degradation near the limit', body: 'As a conversation approaches the context limit, older messages are dropped, which can lead to confused or hallucinated responses.' },
          { title: 'Practical mitigation', body: 'Starting a fresh chat when switching topics keeps context clean and helps maintain response quality, rather than letting one conversation grow indefinitely.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What is a context window best compared to?', options: ['A model\'s permanent long-term storage', 'An LLM\'s short-term memory for the current conversation', 'A vector database index', 'A GPU\'s clock speed'], answer: 1, explanation: 'The context window functions like short-term memory, holding what the model can currently reference.' },
      { prompt: 'Why doesn\'t a token limit equal a word limit?', options: ['Tokens and words are always identical', 'A token can be a whole word, part of a word, punctuation, or a space', 'Tokens only apply to images', 'Word limits do not exist in LLMs'], answer: 1, explanation: 'Tokens are sub-word units in many cases, so token count does not directly equal word count.' },
      { prompt: 'What happens when a conversation exceeds the context window limit?', options: ['The model shuts down permanently', 'Older messages get pushed out and are effectively forgotten', 'The model gains more memory automatically', 'Nothing changes at all'], answer: 1, explanation: 'Once the limit is exceeded, earlier content is dropped from what the model can reference.' },
      { prompt: 'What symptom does the video associate with running past the context limit?', options: ['Faster responses with no downsides', 'Confused outputs and increased hallucination as earlier context is lost', 'Improved accuracy', 'Larger file sizes'], answer: 1, explanation: 'Losing earlier context can lead to inconsistent or hallucinated responses.' },
      { prompt: 'What practical tip does the video suggest for keeping performance high in long conversations?', options: ['Never switch topics', 'Start a new chat when switching topics to keep context clean', 'Always maximize the context window before responding', 'Disable tokenization'], answer: 1, explanation: 'Starting fresh when switching topics avoids carrying irrelevant or excess context that could degrade responses.' },
      { prompt: 'Why does doubling the context window increase computational cost more than proportionally in transformer models?', options: ['It doesn\'t — cost stays constant', 'Self-attention causes cost to scale roughly quadratically with context length', 'Cost only depends on vocabulary size', 'Context length has no effect on compute'], answer: 1, explanation: 'Because every token attends to every other token, computational cost scales roughly quadratically with context length.' },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════
   TECHNICAL TRACK — ADVANCED
   ══════════════════════════════════════════════════════════════════════ */

const technicalAdvancedModules: Module[] = [
  {
    id: 'technical-advanced-1',
    partLabel: 'Part 1 of 10',
    part: 1,
    title: 'Mixture-of-Experts Architecture',
    tagline: 'How modern frontier models get bigger without getting proportionally slower.',
    requirement: 'optional',
    minutes: 62,
    sections: [
      {
        kind: 'lead',
        text: "Trillion-parameter models don't run a trillion parameters on every token.",
        body: 'Mixture-of-Experts (MoE) architectures split a model\'s feed-forward layers into many "expert" sub-networks and a lightweight router that decides, per token, which few experts to activate. This lecture from Stanford\'s CS25 seminar series walks through the paradigm and the Switch Transformer, the paper that made sparse MoE practical at scale.',
      },
      {
        kind: 'video',
        youtubeId: 'U8J32Z3qV8s',
        heading: 'Watch: Stanford CS25 — Mixture of Experts (MoE) Paradigm and the Switch Transformer (~60 min)',
        caption: 'Stanford Online (~60 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Sparse activation', body: 'Only a small subset of experts (often just 1-2 out of dozens) are activated per token, so compute cost stays roughly constant even as total parameter count grows enormously.' },
          { title: 'The router / gating network', body: "A learned gating function scores experts per token and picks the top-k; this routing decision is itself trained end-to-end with the rest of the model." },
          { title: 'Switch Transformer simplification', body: "The Switch Transformer showed that routing to a single expert (top-1) is enough to get MoE's efficiency benefits, simplifying earlier top-k MoE designs." },
          { title: 'Load balancing', body: 'Without an auxiliary loss encouraging even token distribution across experts, a few experts get overloaded while others go unused — a core practical challenge in MoE training.' },
          { title: 'Why it matters for frontier models', body: 'MoE is the architectural trick behind why models like Mixtral and DeepSeek can have hundreds of billions of total parameters while only activating a fraction per forward pass.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What is the core idea behind Mixture-of-Experts architectures?', options: ['Running every parameter on every token for maximum accuracy', 'Activating only a small subset of specialized sub-networks per token', 'Replacing attention with convolution', 'Training multiple full copies of the model and averaging outputs'], answer: 1, explanation: 'MoE routes each token to a small number of expert sub-networks rather than activating the whole model, decoupling parameter count from per-token compute cost.' },
      { prompt: 'What component decides which experts process a given token?', options: ['The optimizer', 'The router / gating network', 'The tokenizer', 'The embedding layer'], answer: 1, explanation: 'A learned router scores the available experts for each token and selects the top-k to activate.' },
      { prompt: 'What key simplification did the Switch Transformer introduce?', options: ['Removing the router entirely', 'Routing each token to only one expert (top-1) instead of multiple', 'Using only dense layers', 'Eliminating backpropagation for expert layers'], answer: 1, explanation: 'The Switch Transformer showed top-1 routing was sufficient, simplifying training and communication compared to earlier top-k MoE designs.' },
      { prompt: 'Why is load balancing a challenge in MoE training?', options: ['GPUs cannot run more than one expert', 'Without intervention, the router tends to favor a few experts, leaving others undertrained', 'Load balancing is only relevant for dense models', 'Experts must all receive identical numbers of parameters'], answer: 1, explanation: 'A naturally-trained router can collapse onto favoring a handful of experts; an auxiliary load-balancing loss is used to spread tokens more evenly.' },
      { prompt: 'What is the practical benefit of MoE over a same-total-size dense model?', options: ['It uses less disk space', 'It requires no training data', 'It keeps per-token compute cost roughly constant while allowing far more total parameters', 'It removes the need for GPUs entirely'], answer: 2, explanation: 'Because only a few experts fire per token, MoE models scale total capacity without a proportional increase in per-token FLOPs.' },
      { prompt: 'Which real-world models mentioned in this space use MoE architecture?', options: ['BERT and GPT-2', 'Mixtral and DeepSeek', 'ResNet and VGG', 'Word2Vec and GloVe'], answer: 1, explanation: 'Mixtral (Mistral) and DeepSeek are prominent examples of production MoE-based large language models.' },
      { prompt: 'What tradeoff does MoE primarily optimize for?', options: ['Memory bandwidth vs. disk storage', 'Total model capacity vs. per-token compute cost', 'Training data size vs. tokenizer vocabulary', 'GPU count vs. batch size only'], answer: 1, explanation: 'MoE lets you scale up total parameters (capacity) while activating only a fraction of them per token (compute).' },
    ],
  },
  {
    id: 'technical-advanced-2',
    partLabel: 'Part 2 of 10',
    part: 2,
    title: 'Diffusion Models Explained',
    tagline: 'The math behind how models like Stable Diffusion turn noise into images.',
    requirement: 'optional',
    minutes: 42,
    sections: [
      {
        kind: 'lead',
        text: "Image generators don't \"paint\" — they denoise.",
        body: 'This 3Blue1Brown video (a guest production by Welch Labs) goes well beyond the usual "the model learns to remove noise" summary, covering the actual mechanics: forward and reverse diffusion, learned vector fields, DDPM vs. DDIM sampling, CLIP-based text conditioning, and how models like DALL-E 2 combine these pieces.',
      },
      {
        kind: 'video',
        youtubeId: 'iv-5mZ_9CPY',
        heading: 'Watch: But How Do AI Images and Videos Actually Work? (~40 min)',
        caption: '3Blue1Brown, guest video by Welch Labs (~40 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Forward diffusion process', body: 'Training data is progressively corrupted with Gaussian noise over many steps until it becomes pure noise — this defines the target the model learns to reverse.' },
          { title: 'Learning a vector field', body: 'Rather than directly predicting the clean image, the model learns a vector field pointing from noisy samples back toward the data distribution at each noise level.' },
          { title: 'DDPM vs. DDIM sampling', body: 'DDPM samples step-by-step stochastically; DDIM offers a faster, more deterministic sampling path through the same learned model, trading some diversity for speed.' },
          { title: 'CLIP and text conditioning', body: 'Text prompts are embedded via CLIP-style joint image-text embeddings, which then steer the denoising process toward images matching the prompt.' },
          { title: 'Classifier-free guidance', body: 'Blending conditioned and unconditioned model predictions (guidance) lets you control how strongly the output follows the text prompt versus staying "natural."' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What does the forward diffusion process do to training images?', options: ['Compresses them into latent vectors only', 'Progressively adds Gaussian noise until they become pure noise', 'Crops them to a fixed size', 'Converts them to grayscale'], answer: 1, explanation: 'Forward diffusion incrementally corrupts data with noise over many steps, defining the process the model learns to invert.' },
      { prompt: 'What does the neural network actually learn to predict during training?', options: ['The final pixel values directly in one step', 'A vector field / noise estimate that points back toward the data distribution', 'The text prompt from the image', 'A compressed JPEG file'], answer: 1, explanation: 'The model learns to estimate the noise (equivalently, a vector field) at each step so that step can be reversed.' },
      { prompt: 'What is the main practical difference between DDPM and DDIM sampling?', options: ['DDIM requires no trained model at all', 'DDIM offers a faster, more deterministic sampling path through the same model', 'DDPM only works on video, DDIM only on images', 'DDIM cannot use text conditioning'], answer: 1, explanation: 'DDIM reformulates the sampling process to allow fewer, more deterministic steps, speeding up generation.' },
      { prompt: 'How does a diffusion model incorporate a text prompt like "a dog on a skateboard"?', options: ['It searches a database of existing images', 'Via CLIP-style embeddings that steer the denoising process toward matching images', 'By directly editing pixel values based on text length', 'It ignores text and generates randomly'], answer: 1, explanation: 'CLIP-style joint text-image embeddings condition the denoising network so the generated image aligns with the prompt.' },
      { prompt: 'What does classifier-free guidance let you control?', options: ['The image file format', 'How strongly the output follows the prompt versus looking more "natural"/diverse', 'The number of GPUs used for training', 'Whether the output is black and white'], answer: 1, explanation: 'Guidance blends conditioned and unconditioned predictions, letting users tune prompt-adherence strength.' },
      { prompt: 'Roughly how many steps does the reverse (generation) process typically start from in the naive DDPM formulation?', options: ['Exactly 1 step', 'A single large jump', 'Many steps (often hundreds), progressively removing noise', 'It never actually removes noise'], answer: 2, explanation: 'Naive DDPM sampling reverses the noising process step-by-step across many iterations, each removing a small amount of noise.' },
      { prompt: 'What is a key advantage of the vector-field framing of diffusion covered in the video?', options: ['It eliminates the need for any training data', 'It connects diffusion models to a more general, continuous view of guiding samples toward a data distribution', 'It only works for text data', 'It removes the need for a neural network'], answer: 1, explanation: 'Framing denoising as learning a vector field connects diffusion to score-based / continuous-time generative modeling more broadly.' },
    ],
  },
  {
    id: 'technical-advanced-3',
    partLabel: 'Part 3 of 10',
    part: 3,
    title: 'The Technical AI Alignment Problem',
    tagline: 'Why "just tell the AI what you want" is much harder than it sounds — the research problem, not the policy debate.',
    requirement: 'half',
    minutes: 20,
    sections: [
      {
        kind: 'lead',
        text: "Alignment isn't about AI having \"bad intentions\" — it's a specification problem.",
        body: "Robert Miles, whose channel is widely regarded as the most accessible technical introduction to AI alignment research, lays out the core technical difficulty: how do you specify a goal precisely enough that a sufficiently capable optimizer pursuing it doesn't produce catastrophic, unintended side effects? This is distinct from AI governance or ethics policy — it's about the mechanics of optimization itself.",
      },
      {
        kind: 'video',
        youtubeId: 'pYXy-A4siMw',
        heading: 'Watch: Intro to AI Safety, Remastered (~18 min)',
        caption: 'Robert Miles AI Safety (~18 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Specification gaming', body: 'Optimizers routinely find unexpected ways to maximize a specified reward that technically satisfy the objective while completely missing the intent behind it.' },
          { title: 'Instrumental convergence', body: 'Many different terminal goals lead a sufficiently capable agent to pursue similar instrumental sub-goals — like acquiring resources or resisting shutdown — regardless of what it ultimately wants.' },
          { title: 'The orthogonality thesis', body: 'Intelligence and goals are independent axes: a highly capable system is not automatically aligned with human values just by virtue of being capable.' },
          { title: 'Why capability makes this harder, not easier', body: 'As systems become more capable optimizers, small specification errors get amplified rather than smoothed out, since the system is better at finding edge cases in the objective.' },
          { title: "It's an open technical problem", body: 'The video frames alignment as unsolved research — not a solved engineering checklist — motivating why it is an active field distinct from AI policy or ethics.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What is "specification gaming" in the context of AI alignment?', options: ['An AI cheating on benchmark tests by memorizing answers', "An optimizer finding an unexpected way to maximize its stated objective that violates the designer's actual intent", 'A method for writing more precise reward functions', 'A type of adversarial attack on image classifiers'], answer: 1, explanation: 'Specification gaming happens when a system satisfies the literal objective in a way that misses what was actually intended.' },
      { prompt: 'What does "instrumental convergence" describe?', options: ['All AI systems converging on the same final answer', 'Different terminal goals leading capable agents to pursue similar sub-goals like resource acquisition or self-preservation', 'Neural networks converging during gradient descent', 'Two different models producing identical outputs'], answer: 1, explanation: "Instrumental convergence is the idea that regardless of an agent's ultimate goal, certain sub-goals (resources, self-preservation, etc.) tend to be useful and thus get pursued." },
      { prompt: 'What does the orthogonality thesis claim?', options: ['Intelligence and goals are fundamentally linked — smarter systems are automatically more ethical', "Intelligence level and goal content are independent — a highly capable system isn't automatically aligned with human values", 'All AI goals are orthogonal to human goals', 'Orthogonality only applies to image models'], answer: 1, explanation: "The orthogonality thesis says capability and values are separate axes; being smart doesn't imply having good/aligned goals." },
      { prompt: 'According to the video, why does increased capability make alignment harder rather than easier?', options: ['More capable systems require more electricity', 'More capable optimizers are better at finding edge cases and loopholes in an imperfectly specified objective', 'Capable systems refuse to run at all', 'Capability has no effect on alignment difficulty'], answer: 1, explanation: 'A more powerful optimizer is more effective at exploiting gaps between the literal objective and the intended one.' },
      { prompt: 'How does this video frame the alignment problem relative to AI ethics/policy debates?', options: ['As identical to policy debates', 'As a distinct technical/research problem about specifying objectives and optimization behavior', 'As irrelevant to AI safety', 'As a solved problem needing only regulation'], answer: 1, explanation: 'The video specifically treats alignment as a technical research challenge about optimization and specification, not primarily a policy or ethics question.' },
      { prompt: "What is the video's overall framing of alignment's current status?", options: ['A fully solved engineering problem', 'An open research problem actively being worked on', 'A problem that only matters for superintelligent AI, not current systems', 'A purely philosophical exercise with no practical relevance'], answer: 1, explanation: 'The video presents alignment as unsolved and actively researched, motivating why it deserves serious technical attention now.' },
    ],
  },
  {
    id: 'technical-advanced-4',
    partLabel: 'Part 4 of 10',
    part: 4,
    title: 'Reinforcement Learning Fundamentals',
    tagline: 'The foundational framework — MDPs, value functions, and policies — behind everything from AlphaGo to RLHF.',
    requirement: 'optional',
    minutes: 92,
    sections: [
      {
        kind: 'lead',
        text: "Before RLHF fine-tunes a chatbot, there's decades of RL theory underneath it.",
        body: "This opening lecture of David Silver's celebrated UCL/DeepMind reinforcement learning course lays the formal groundwork: Markov Decision Processes, rewards, value functions, and the distinction between the problem RL solves and the many algorithms used to solve it. It's dense but foundational for understanding modern RL-based training techniques.",
      },
      {
        kind: 'video',
        youtubeId: '2pWv7GOvuf0',
        heading: 'Watch: RL Course by David Silver — Lecture 1: Introduction to Reinforcement Learning (~90 min)',
        caption: 'Google DeepMind (~90 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Markov Decision Processes (MDPs)', body: 'RL problems are formalized as MDPs: states, actions, transition probabilities, and rewards, with the Markov property meaning the future depends only on the current state.' },
          { title: 'Reward hypothesis', body: 'All goals can be described as maximizing expected cumulative reward — a foundational (and debatable) assumption underlying the entire RL framework.' },
          { title: 'Value functions', body: 'A value function estimates expected future reward from a state (or state-action pair), giving agents a way to evaluate long-term consequences of decisions, not just immediate reward.' },
          { title: 'Policies', body: "A policy is the agent's behavior function, mapping states to actions; RL algorithms differ largely in how they derive or optimize this policy." },
          { title: 'Exploration vs. exploitation', body: 'An agent must balance exploiting known good actions against exploring uncertain ones that might yield better long-term reward — a tension central to nearly all RL algorithms.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What formal framework is used to describe RL problems?', options: ['Convolutional Neural Networks', 'Markov Decision Processes (MDPs)', 'Finite State Automata only', 'Support Vector Machines'], answer: 1, explanation: 'MDPs formalize RL problems via states, actions, transitions, and rewards under the Markov property.' },
      { prompt: 'What is the "reward hypothesis"?', options: ['Rewards must always be positive numbers', 'All goals can be described as maximizing expected cumulative reward', 'Rewards are irrelevant to agent behavior', 'Only human-provided rewards count as valid'], answer: 1, explanation: 'The reward hypothesis is the foundational RL assumption that any goal can be captured as maximizing expected cumulative reward.' },
      { prompt: 'What does a value function estimate?', options: ['The immediate reward only', 'Expected future (cumulative) reward from a state or state-action pair', 'The number of training epochs needed', 'The size of the action space'], answer: 1, explanation: 'Value functions estimate long-term expected return, letting agents reason beyond just immediate reward.' },
      { prompt: 'What is a "policy" in reinforcement learning?', options: ['A fixed reward schedule', "The agent's behavior function mapping states to actions", 'A dataset of labeled examples', 'A regularization technique'], answer: 1, explanation: "A policy defines what action the agent takes in each state — it is the agent's behavior." },
      { prompt: 'What core tradeoff must an RL agent manage during learning?', options: ['Precision vs. recall', 'Exploration vs. exploitation', 'Bias vs. variance only in supervised learning', 'Compression vs. accuracy'], answer: 1, explanation: 'Agents must balance exploiting known rewarding actions against exploring uncertain ones for potentially better long-term outcomes.' },
      { prompt: 'What does the Markov property assume about state transitions?', options: ['The entire history of past states must be considered', 'The future depends only on the current state, not the full history', 'Transitions are always deterministic', 'States must be discrete, never continuous'], answer: 1, explanation: 'The Markov property states that the current state captures all relevant information for predicting the future — history beyond it adds nothing.' },
      { prompt: 'Why is this foundational RL material relevant to modern LLM training?', options: ['It is not relevant at all', 'Techniques like RLHF and RL-based reasoning training build on these same core RL concepts (rewards, policies, value estimation)', 'LLMs never use reinforcement learning', 'MDPs are only used in robotics'], answer: 1, explanation: 'Modern techniques like RLHF and RL-driven reasoning training (e.g., GRPO) are built on the same MDP/policy/reward foundations covered here.' },
    ],
  },
  {
    id: 'technical-advanced-5',
    partLabel: 'Part 5 of 10',
    part: 5,
    title: 'Speculative Decoding for Faster Inference',
    tagline: 'How a small "draft" model can make a large model generate text faster without changing its output.',
    requirement: 'optional',
    minutes: 20,
    sections: [
      {
        kind: 'lead',
        text: 'LLM inference is sequential and memory-bound — speculative decoding exploits idle GPU compute to speed it up.',
        body: "Trelis Research breaks down speculative decoding: pairing a small, fast draft model with the large target model so multiple tokens can be proposed and verified per forward pass, cutting latency while provably preserving the target model's output distribution.",
      },
      {
        kind: 'video',
        youtubeId: 'hm7VEgxhOvk',
        heading: 'Watch: Speculative Decoding Explained (~18 min)',
        caption: 'Trelis Research (~18 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'The bottleneck: memory bandwidth, not compute', body: 'Autoregressive decoding is usually memory-bandwidth bound at low batch sizes, leaving GPU compute underutilized during each token-by-token forward pass.' },
          { title: 'Draft model proposes, target model verifies', body: 'A smaller, cheaper "draft" model generates several candidate tokens quickly; the large target model then verifies them all in a single parallel forward pass.' },
          { title: 'Accept/reject sampling preserves exact output distribution', body: "A rejection-sampling scheme accepts draft tokens that match what the target model would have produced and resamples where they diverge, guaranteeing identical output quality to standard decoding." },
          { title: 'Speedup depends on draft model quality', body: "The better the draft model approximates the target model's predictions, the more tokens get accepted per round, and the bigger the latency win." },
          { title: 'Practical use cases', body: 'Speculative decoding is especially valuable for latency-sensitive applications like interactive chat and code completion, where response time matters as much as throughput.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What is the main bottleneck that speculative decoding addresses?', options: ['Insufficient training data', 'GPU compute sitting idle due to memory-bandwidth-bound sequential decoding', 'Lack of labeled examples', 'Overfitting during fine-tuning'], answer: 1, explanation: 'Standard autoregressive decoding underutilizes GPU compute because it is bound by memory bandwidth at low concurrency; speculative decoding better utilizes that idle compute.' },
      { prompt: 'What role does the small "draft" model play?', options: ['It replaces the target model entirely', 'It quickly proposes several candidate tokens for the target model to verify', 'It only handles tokenization', 'It trains the target model from scratch'], answer: 1, explanation: 'The draft model cheaply generates candidate tokens that the larger target model then verifies in parallel.' },
      { prompt: 'How does speculative decoding guarantee output quality is unchanged?', options: ["It doesn't guarantee this — quality is always slightly worse", 'An accept/reject (rejection sampling) scheme ensures the final output distribution matches the target model exactly', 'It uses a majority vote between draft and target', 'It rounds token probabilities to the nearest integer'], answer: 1, explanation: 'A rejection-sampling procedure accepts draft tokens consistent with the target model and resamples divergent ones, preserving the exact target distribution.' },
      { prompt: "What happens to the target model's workload when verifying draft tokens?", options: ['It processes each token in a separate sequential pass, one at a time as before', 'It verifies multiple candidate tokens in a single parallel forward pass', 'It skips verification to save time', 'It retrains itself on each request'], answer: 1, explanation: 'The target model verifies the entire proposed token sequence in one parallel pass, which is what makes the technique faster.' },
      { prompt: 'What factor most affects the speedup achieved by speculative decoding?', options: ['The programming language used', "How well the draft model's predictions match the target model's", 'The number of parameters in the tokenizer', 'The dataset license'], answer: 1, explanation: 'A draft model that closely approximates the target model gets more tokens accepted per round, yielding bigger speedups.' },
      { prompt: 'Which use cases benefit most from speculative decoding, according to the video?', options: ["Offline batch processing where latency doesn't matter", 'Latency-sensitive applications like chat and code completion', 'Only image classification tasks', 'Training large models from scratch'], answer: 1, explanation: 'Because it reduces per-token latency, speculative decoding is particularly valuable for interactive, latency-sensitive use cases.' },
    ],
  },
  {
    id: 'technical-advanced-6',
    partLabel: 'Part 6 of 10',
    part: 6,
    title: 'Distributed Training at Scale',
    tagline: 'How you actually spread the training of a massive model across many GPUs and machines.',
    requirement: 'optional',
    minutes: 52,
    sections: [
      {
        kind: 'lead',
        text: "A trillion-parameter model doesn't fit on one GPU — training it is a distributed-systems problem as much as a machine-learning one.",
        body: "Umar Jamil's tutorial covers the practical mechanics of distributed training with PyTorch: data parallelism, gradient synchronization, and the collective-communication primitives (like all-reduce) that keep replicas of a model consistent across a cluster of GPUs and machines.",
      },
      {
        kind: 'video',
        youtubeId: 'toUSzwR0EV8',
        heading: 'Watch: Distributed Training with PyTorch — Complete Tutorial (~50 min)',
        caption: 'Umar Jamil (~50 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Data parallelism', body: 'The model is replicated across GPUs, with each replica processing a different shard of the batch; gradients are then synchronized across replicas before each weight update.' },
          { title: 'Gradient accumulation', body: 'Gradients computed on each GPU/replica are accumulated and averaged before being applied, a central mechanism that makes data-parallel training mathematically equivalent to training on a single large batch.' },
          { title: 'Collective communication primitives', body: 'Operations like broadcast, reduce, all-reduce, and gather (used by libraries like NCCL) are what let GPUs efficiently exchange gradients and parameters without a slow central bottleneck.' },
          { title: 'Computation-communication overlap', body: 'Overlapping gradient communication with ongoing backward-pass computation (rather than waiting for it) is a key optimization that keeps distributed training fast.' },
          { title: 'Real cluster setup', body: 'The tutorial builds out an actual multi-server, multi-GPU cloud setup, showing that distributed training is as much about networking and infrastructure as it is about the model code.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'In data parallelism, what differs across GPU replicas of the model?', options: ['Each replica has different model architecture', 'Each replica processes a different shard of the training batch', 'Each replica uses a different loss function', 'Nothing differs — all replicas are identical and redundant'], answer: 1, explanation: 'Data parallelism replicates the same model on each GPU but feeds each replica a different slice of the batch.' },
      { prompt: 'What is the purpose of gradient accumulation/synchronization across replicas?', options: ['To intentionally introduce randomness into training', 'To combine and average gradients from all replicas so the update is equivalent to training on the full batch', 'To reduce the number of GPUs needed', 'To skip backpropagation entirely'], answer: 1, explanation: 'Averaging gradients across replicas before the weight update keeps distributed training mathematically consistent with single-device training on the combined batch.' },
      { prompt: 'What is "all-reduce," as discussed in the video?', options: ['A type of activation function', 'A collective communication primitive that combines values (e.g., gradients) across all GPUs and distributes the result back to each', 'A method for reducing model size before deployment', 'A dataset augmentation technique'], answer: 1, explanation: 'All-reduce is a collective operation, used by libraries like NCCL, that aggregates values across devices and returns the combined result to all of them.' },
      { prompt: 'Why does the video emphasize overlapping computation and communication?', options: ['It has no effect on training speed', 'Overlapping lets gradient communication happen concurrently with backward-pass computation, avoiding idle waiting and speeding up training', 'It reduces GPU memory usage only', 'It removes the need for networking'], answer: 1, explanation: 'Overlapping communication with computation prevents GPUs from idling while waiting for gradient synchronization, improving throughput.' },
      { prompt: 'What does the tutorial actually build to demonstrate these concepts?', options: ['A single-GPU toy example only', 'A real multi-server, multi-GPU cloud infrastructure setup', 'A purely theoretical proof with no code', 'A mobile app'], answer: 1, explanation: 'The tutorial sets up real cloud infrastructure with multiple servers and GPUs to demonstrate distributed training in practice.' },
      { prompt: 'What is a major practical challenge in training frontier-scale models across thousands of GPUs?', options: ['Finding enough training data only', 'Coordinating memory, communication latency, and failures across a massive distributed system', 'Choosing a font for the training logs', 'Selecting a programming language'], answer: 1, explanation: 'Orchestrating memory limits, communication overhead, and hardware reliability across thousands of GPUs is one of the central engineering challenges in large-scale training.' },
    ],
  },
  {
    id: 'technical-advanced-7',
    partLabel: 'Part 7 of 10',
    part: 7,
    title: 'Multi-Agent AI Systems: Technical Architecture',
    tagline: 'How multiple specialized AI agents actually coordinate — the architecture, not just the business pitch.',
    requirement: 'half',
    minutes: 19,
    sections: [
      {
        kind: 'lead',
        text: 'A "multi-agent system" is more than several chatbots talking to each other.',
        body: 'This technical walkthrough covers how multi-agent AI systems are actually architected: orchestrators that decompose goals into subtasks, specialized agents with constrained tools and permissions, and the communication/state-tracking patterns that let them collaborate reliably.',
      },
      {
        kind: 'video',
        youtubeId: 'Mi5wOpAgixw',
        heading: 'Watch: Multi-agent Systems Explained in 17 Minutes (~17 min)',
        caption: 'Shaw Talebi (~17 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Orchestrator pattern', body: 'A central orchestrator receives a high-level goal, breaks it into discrete subtasks, assigns them to the right specialized agent, and assembles the final output — without doing execution itself.' },
          { title: 'Specialized, constrained agents', body: 'Each agent has a specific role, a specific toolset, and explicitly limited permissions, which improves reliability and makes failures easier to isolate.' },
          { title: 'State tracking and failure handling', body: "The orchestrator tracks execution state across agents and handles failures (retries, fallbacks) rather than assuming every subtask succeeds on the first try." },
          { title: 'Modularity as a design goal', body: 'Splitting a system into separate agents makes it easier to develop, test, and maintain each piece independently compared to one monolithic agent trying to do everything.' },
          { title: 'Communication protocols between agents', body: 'Agents need defined interfaces/message formats to exchange information reliably, since ad hoc communication between agents is a common source of failure.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What is the role of the orchestrator in a multi-agent system?', options: ['It performs all the actual task execution itself', 'It decomposes a high-level goal into subtasks and assigns them to specialized agents', 'It only stores logs for debugging', 'It replaces all other agents once trained'], answer: 1, explanation: 'The orchestrator breaks down goals and routes subtasks to the right agents, without performing execution itself.' },
      { prompt: 'Why are individual agents typically given constrained tools and permissions?', options: ['To make the system slower on purpose', 'To improve reliability and make it easier to isolate and control failures', 'Because agents cannot use any tools at all', 'To reduce the total number of agents needed'], answer: 1, explanation: "Constraining each agent's scope and permissions limits blast radius and makes debugging and control easier." },
      { prompt: 'What does "modularity" refer to in this context?', options: ['Compressing all agents into a single model', 'Splitting a system into separate agents, making each easier to develop, test, and maintain independently', 'Removing all communication between components', 'Using only one programming language'], answer: 1, explanation: 'Modularity is the benefit of building separate, specialized agents rather than one monolithic system, easing development and testing.' },
      { prompt: 'What must the orchestrator do when a subtask fails?', options: ['Ignore the failure and continue as if it succeeded', 'Track execution state and handle failures, e.g. via retries or fallbacks', 'Shut down the entire system permanently', "Delete the failing agent's code"], answer: 1, explanation: 'Robust orchestration includes tracking state and handling failures gracefully rather than assuming perfect execution.' },
      { prompt: 'Why do agents need defined communication protocols/message formats?', options: ['Protocols are optional and rarely used', 'Ad hoc communication between agents is a common source of failure, so defined interfaces improve reliability', 'Agents never need to exchange information', 'Only human users communicate with agents'], answer: 1, explanation: 'Clear interfaces for inter-agent communication reduce ambiguity and failure modes compared to unstructured exchanges.' },
      { prompt: 'How does this technical framing differ from a beginner "what is an AI agent" explainer?', options: ['It does not differ at all', 'It focuses on architecture: orchestration, specialization, state tracking, and failure handling rather than just defining what an agent is', 'It only covers business use cases', 'It avoids discussing tools or permissions'], answer: 1, explanation: 'This video is about system architecture and coordination mechanics, distinct from a beginner-level definition of what an agent is.' },
    ],
  },
  {
    id: 'technical-advanced-8',
    partLabel: 'Part 8 of 10',
    part: 8,
    title: 'Mechanistic Interpretability',
    tagline: 'Reverse-engineering what a trained neural network is actually computing internally.',
    requirement: 'optional',
    minutes: 37,
    sections: [
      {
        kind: 'lead',
        text: 'A trained network is a black box you can, in principle, take apart.',
        body: 'Neel Nanda, a leading mechanistic interpretability researcher (formerly at Anthropic, now at Google DeepMind), gives a whirlwind tour of the field at the Vienna Alignment Workshop: the goal of reverse-engineering the algorithms a network has learned, key phenomena like superposition, and why this connects directly to AI safety.',
      },
      {
        kind: 'video',
        youtubeId: 'veT2VI4vHyU',
        heading: 'Watch: Mechanistic Interpretability — A Whirlwind Tour (~35 min)',
        caption: 'FAR.AI, Neel Nanda talk at Vienna Alignment Workshop (~35 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Reverse-engineering learned algorithms', body: 'Mechanistic interpretability tries to take a trained network and extract the actual algorithm it has learned, rather than treating it as an opaque function.' },
          { title: 'Superposition', body: 'Networks often represent more distinct features than they have neurons by encoding multiple features in overlapping combinations of neurons, making individual neurons hard to interpret in isolation.' },
          { title: 'Circuits', body: 'Groups of connected components (attention heads, neurons, weights) can implement identifiable sub-algorithms, or "circuits," such as induction heads that support in-context learning.' },
          { title: 'Why this matters for safety', body: "Understanding a model's internal computations is framed as a route to catching deceptive or misaligned behavior that might not show up in the model's outputs alone." },
          { title: 'Open problems', body: "The talk frames interpretability as an immature but rapidly growing field, with many open questions about how to scale these techniques to today's largest models." },
        ],
      },
    ],
    quiz: [
      { prompt: 'What is the primary goal of mechanistic interpretability?', options: ['To make training faster', 'To reverse-engineer the actual algorithm a trained network has learned', 'To compress models for deployment', 'To generate more training data'], answer: 1, explanation: 'Mechanistic interpretability aims to understand and extract the specific computations/algorithms implemented inside a trained network.' },
      { prompt: 'What is "superposition" in this context?', options: ['Running two models simultaneously', 'A network encoding more distinct features than it has neurons by overlapping them across combinations of neurons', 'A type of data augmentation', 'Stacking multiple attention layers'], answer: 1, explanation: 'Superposition describes how networks pack more features than available neurons by representing them in overlapping combinations, complicating direct interpretation.' },
      { prompt: 'What is a "circuit" in mechanistic interpretability?', options: ['A physical hardware component', 'A group of connected model components (e.g., attention heads, weights) that implements an identifiable sub-algorithm', 'A type of loss function', 'A dataset preprocessing pipeline'], answer: 1, explanation: 'Circuits are identifiable sub-networks within a model that implement specific computations, such as induction heads.' },
      { prompt: 'What example of a "circuit" is commonly discussed in interpretability research?', options: ['Batch normalization layers', 'Induction heads that support in-context learning', 'The tokenizer vocabulary', "The optimizer's learning rate schedule"], answer: 1, explanation: "Induction heads are a well-studied circuit implicated in a model's ability to do in-context learning/pattern completion." },
      { prompt: 'Why does the talk connect interpretability to AI safety?', options: ["It doesn't — interpretability is unrelated to safety", 'Understanding internal computations may help catch deceptive or misaligned behavior not visible from outputs alone', 'Interpretability only matters for making models smaller', 'Safety is only about model outputs, never internals'], answer: 1, explanation: 'The talk frames interpretability as a potential tool for detecting misalignment that might not be visible from external behavior alone.' },
      { prompt: 'How does the talk characterize the current state of mechanistic interpretability as a field?', options: ['Fully solved with no remaining open questions', 'An immature but rapidly growing field with many open problems, especially around scaling', 'Irrelevant to modern large language models', 'A field that has existed unchanged since the 1990s'], answer: 1, explanation: "The talk presents interpretability as young and fast-moving, with significant open challenges in scaling techniques to today's largest models." },
    ],
  },
  {
    id: 'technical-advanced-9',
    partLabel: 'Part 9 of 10',
    part: 9,
    title: 'Scaling Laws in Deep Learning',
    tagline: 'The surprisingly predictable power-law relationship between model size, data, compute, and performance.',
    requirement: 'optional',
    minutes: 57,
    sections: [
      {
        kind: 'lead',
        text: "Model performance isn't random as you scale up — it follows remarkably consistent power laws.",
        body: 'This seminar talk, connected to the influential "Explaining Neural Scaling Laws" research, explores why test loss for well-trained neural networks tracks power-law relationships with model size, dataset size, and compute — and what theoretical explanations have been proposed for why these relationships hold across many orders of magnitude.',
      },
      {
        kind: 'video',
        youtubeId: 'V8FEFw50lg4',
        heading: 'Watch: Explaining Neural Scaling Laws (~55 min)',
        caption: 'Physics ∩ ML seminar series (~55 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Power-law loss scaling', body: 'Test loss often follows a power-law relationship with compute, parameter count, or dataset size — small changes in scale produce predictable, quantifiable changes in loss.' },
          { title: 'Four scaling regimes', body: "The talk distinguishes variance-limited and resolution-limited scaling behavior for both model size and dataset size, giving four qualitatively distinct regimes depending on what's the bottleneck." },
          { title: 'Predictive power across orders of magnitude', body: 'Scaling trends fit at small scale (e.g., millions of parameters) have proven remarkably predictive of behavior at scales orders of magnitude larger.' },
          { title: 'Why this matters practically', body: 'Scaling laws let labs forecast the performance of a not-yet-trained model and make informed compute/data allocation decisions before committing to an expensive training run.' },
          { title: 'Theoretical explanations', body: 'The talk surveys candidate theories for why these power laws emerge, connecting empirical scaling trends to underlying statistical and geometric properties of the learning problem.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What mathematical relationship do neural scaling laws typically describe?', options: ['A linear relationship between loss and compute', 'A power-law relationship between test loss and model size, dataset size, or compute', 'No relationship at all — performance is random', 'An inverse exponential decay unrelated to scale'], answer: 1, explanation: 'Scaling laws describe power-law relationships between test loss and factors like compute, parameters, or data.' },
      { prompt: 'What are the two limiting behaviors discussed as scaling regimes?', options: ['Overfitting and underfitting only', 'Variance-limited and resolution-limited scaling', 'Supervised and unsupervised scaling', 'GPU-limited and CPU-limited scaling'], answer: 1, explanation: 'The talk distinguishes variance-limited and resolution-limited regimes for both model and dataset size scaling.' },
      { prompt: 'What is notable about how well scaling laws fit at small scales predict large-scale behavior?', options: ['They fail completely once scale increases significantly', 'They remain remarkably predictive across many orders of magnitude of scale', 'They only apply to models under 1 million parameters', 'They only work for image models, not language models'], answer: 1, explanation: 'Scaling trends observed at small scale have proven surprisingly predictive even at scales orders of magnitude larger.' },
      { prompt: 'Why are scaling laws practically useful to labs training frontier models?', options: ['They eliminate the need for any training data', 'They let labs forecast performance and make compute/data allocation decisions before committing to expensive runs', 'They guarantee a model will have zero loss', 'They are purely academic with no practical use'], answer: 1, explanation: 'Scaling laws inform decisions about how to allocate compute and data efficiently before running expensive full-scale training.' },
      { prompt: 'What does the talk attempt to do beyond just describing the empirical power-law observation?', options: ['Nothing — it only reports the empirical curves', 'It surveys theoretical explanations for why these power laws emerge from underlying statistical/geometric properties', 'It disproves that scaling laws exist', 'It focuses solely on hardware specifications'], answer: 1, explanation: 'The talk goes beyond observation to explore candidate theoretical explanations for why scaling laws take the form they do.' },
      { prompt: 'Which factors are jointly considered in these scaling law analyses?', options: ['Only the programming framework used', 'Model size, dataset size, and compute', 'Only GPU brand', 'Only the choice of activation function'], answer: 1, explanation: 'Scaling laws jointly relate loss to model size, dataset size, and total compute used for training.' },
    ],
  },
  {
    id: 'technical-advanced-10',
    partLabel: 'Part 10 of 10',
    part: 10,
    title: 'Inside a State-of-the-Art Model: DeepSeek V3 and R1',
    tagline: "A recent, credible technical deep-dive into the architecture and training innovations behind DeepSeek's frontier models.",
    requirement: 'optional',
    minutes: 24,
    sections: [
      {
        kind: 'lead',
        text: "DeepSeek didn't just scale up — it changed the architecture and training recipe.",
        body: 'This breakdown covers what made DeepSeek V3 and R1 notable beyond hype: Multi-Head Latent Attention (MLA) for cheaper inference, a large-scale Mixture-of-Experts design, and a reinforcement-learning-driven training pipeline (using Group Relative Policy Optimization) for building reasoning ability.',
      },
      {
        kind: 'video',
        youtubeId: 'fTjPEE0fk-U',
        heading: 'Watch: How Did They Do It? DeepSeek V3 and R1 Explained (~22 min)',
        caption: 'No Hype AI (~22 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Multi-Head Latent Attention (MLA)', body: 'MLA compresses the key-value cache into low-rank latent vectors and reconstructs them on the fly during inference, cutting KV-cache memory overhead dramatically compared to standard attention.' },
          { title: 'Large-scale MoE with high sparsity', body: 'DeepSeek-R1 has hundreds of billions of total parameters but activates only tens of billions per token, applying MoE\'s sparse-activation principle at extreme scale.' },
          { title: 'RL-driven reasoning training', body: 'Rather than relying purely on supervised fine-tuning, DeepSeek uses large-scale reinforcement learning (via GRPO) to cultivate step-by-step reasoning behavior in the model.' },
          { title: 'Supervised fine-tuning as a "cold start"', body: 'Training begins with supervised fine-tuning on curated chain-of-thought examples before large-scale RL takes over, stabilizing early reasoning behavior.' },
          { title: 'Cost-efficiency as a design goal', body: 'A recurring theme is that these architectural choices were driven by a deliberate focus on training and inference cost-efficiency, not just raw benchmark performance.' },
        ],
      },
    ],
    quiz: [
      { prompt: 'What problem does Multi-Head Latent Attention (MLA) primarily address?', options: ['Slow tokenization', 'High memory overhead from the key-value cache during inference', 'Overfitting during pretraining', 'Lack of training data'], answer: 1, explanation: 'MLA compresses KV-cache data into low-rank latent vectors, substantially reducing memory overhead versus standard attention.' },
      { prompt: "Roughly how does DeepSeek-R1's activated parameter count compare to its total parameter count?", options: ['All parameters are activated on every token', 'Only a small fraction (tens of billions out of hundreds of billions) are activated per token', 'Exactly half are always activated', 'Activation count is unrelated to total size'], answer: 1, explanation: 'DeepSeek-R1 uses MoE sparsity, activating only a fraction of its total parameters (about 37B of 671B) per token.' },
      { prompt: 'What technique does DeepSeek use to develop reasoning behavior at scale?', options: ['Supervised fine-tuning alone, with no reinforcement learning', 'Large-scale reinforcement learning using Group Relative Policy Optimization (GRPO)', 'Manual rule-based logic systems', 'Random weight initialization only'], answer: 1, explanation: 'DeepSeek relies heavily on large-scale RL, specifically GRPO, to cultivate chain-of-thought reasoning capability.' },
      { prompt: 'What role does supervised fine-tuning play before the large-scale RL stage?', options: ['None — RL is used from a randomly initialized model', 'It acts as a "cold start" on curated chain-of-thought data to stabilize early reasoning behavior', 'It replaces RL entirely', 'It is only used after RL, never before'], answer: 1, explanation: 'A supervised fine-tuning cold start on curated reasoning examples precedes the large-scale RL phase, stabilizing training.' },
      { prompt: "What recurring design theme does the video highlight across DeepSeek's architectural choices?", options: ['Maximizing training cost regardless of efficiency', 'A deliberate focus on training/inference cost-efficiency alongside performance', 'Avoiding any use of Mixture-of-Experts', 'Ignoring memory constraints entirely'], answer: 1, explanation: 'The video frames MLA, MoE sparsity, and the RL training recipe as choices driven partly by a cost-efficiency goal, not just raw performance.' },
      { prompt: "Which two architectural/training innovations are central to the video's explanation of DeepSeek V3/R1?", options: ['Convolutional layers and batch normalization', 'Multi-Head Latent Attention and Mixture-of-Experts, combined with RL-based reasoning training', 'Word2Vec embeddings and LSTM cells', 'Manual rule-based expert systems'], answer: 1, explanation: 'MLA (efficient attention) and MoE (sparse scaling), paired with an RL-driven reasoning training pipeline, are the core innovations covered.' },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════
   PRODUCTIVITY TRACK
   ══════════════════════════════════════════════════════════════════════ */

const productivityModules: Module[] = [
  {
    id: 'productivity-1',
    partLabel: 'Part 1 of 4',
    part: 1,
    title: 'How to Use Claude Pro',
    tagline: 'Understand what the $20/month Pro tier actually buys you before you decide to upgrade.',
    requirement: 'required',
    minutes: 13,
    sections: [
      {
        kind: 'lead',
        text: 'Claude has three plans — Free, Pro, and Max — and the difference is mostly about how much you can use Claude, not a totally different product.',
        body: 'A creator who tested all three Claude plans breaks down exactly what changes as you move up in price, and — more usefully — how Claude actually measures your usage behind the scenes. That second part matters even if your company already pays for Pro or Max: knowing how limits are calculated changes how you should prompt.',
      },
      {
        kind: 'video',
        youtubeId: 'Sdewx3GpJ1Q',
        heading: "Watch: I Tested All Claude Plans So You Don't Have To (~11 min)",
        caption: 'The AI Productivity Coach (~11 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          {
            title: 'Pricing is about limits, not locked features',
            body: 'Claude\'s Free, Pro ($20/month), and Max (from $100/month) tiers are largely defined by usage limits and frequency caps, rather than each tier unlocking a completely different set of capabilities.',
          },
          {
            title: 'The free tier caps out fast',
            body: 'Testing found the free plan allows roughly 10 prompts within a rolling 5-hour window — fine for occasional, lightweight questions, but tight for any sustained daily work.',
          },
          {
            title: 'Usage is measured in tokens, not messages',
            body: 'The video\'s key insight: your limit isn\'t "X messages per day" — it\'s based on tokens consumed. A few long, complex exchanges can burn through your quota faster than many short ones.',
          },
          {
            title: 'That changes how you should prompt',
            body: 'Because longer conversations cost more of your quota, breaking work into focused new chats (rather than one sprawling thread) stretches your usage further — especially useful on Free or lower Pro allowances.',
          },
          {
            title: 'Higher tiers exist for people who hit the wall regularly',
            body: 'The video frames Pro and Max as solving the constraints free users run into — Max in particular is pitched at power users running Claude continuously throughout the workday.',
          },
        ],
      },
    ],
    quiz: [
      {
        prompt: "According to the video, what mainly separates Claude's Free, Pro, and Max plans?",
        options: [
          'Completely different products with no shared features',
          'Usage limits and frequency caps, more than distinct feature sets',
          'Only the visual theme of the interface',
          'Free and Pro are identical; only Max differs',
        ],
        answer: 1,
        explanation: 'The video\'s framing is that Claude\'s tiers are "largely defined by usage limits and frequency caps" rather than radically different capabilities.',
      },
      {
        prompt: 'Roughly how many prompts did the tester find the free tier allows within a 5-hour window?',
        options: ['About 2', 'About 10', 'About 45', 'About 100'],
        answer: 1,
        explanation: 'The video reports the free plan giving around 10 prompts within a rolling 5-hour window.',
      },
      {
        prompt: 'What is the key mechanic the video highlights for how Claude usage limits actually work?',
        options: [
          'Limits are based on the number of messages sent, full stop',
          'Limits are based on tokens consumed by the conversation, not just message count',
          'Limits reset only once a month',
          'Limits depend solely on which country you sign up from',
        ],
        answer: 1,
        explanation: 'The video stresses that usage is calculated from tokens consumed, meaning conversation length and complexity — not just message count — determines how fast you burn through your quota.',
      },
      {
        prompt: 'Practically, what does the "tokens, not messages" point mean for how you should work?',
        options: [
          "It doesn't matter how you prompt — usage is identical either way",
          'Short, frequent messages always cost more than one long thread',
          'Long, complex conversations can eat your usage quota faster than several short, focused ones',
          'Only image uploads count against your limit',
        ],
        answer: 2,
        explanation: 'Because token consumption drives the limit, a single long or complex thread can use up quota faster than multiple short, targeted conversations.',
      },
      {
        prompt: 'What starting monthly price does the video give for the Claude Max plan?',
        options: ['$20', '$50', '$100', '$200'],
        answer: 2,
        explanation: 'The video places Max starting at $100/month, above the $20/month Pro tier.',
      },
      {
        prompt: 'What was the central question the video set out to answer?',
        options: [
          'How to install Claude on a phone',
          'Whether Claude Pro is worth $20/month or if the free plan is enough, after testing all three tiers',
          'How Claude compares to a specific competitor product feature-by-feature',
          'How to build a custom Claude API integration',
        ],
        answer: 1,
        explanation: 'The video is framed around testing every plan to answer whether upgrading past the free tier is worth it.',
      },
      {
        prompt: "Based on the video's framing, who is the free tier realistically suited for?",
        options: [
          'Teams running Claude constantly all day',
          'Occasional, lightweight use rather than sustained daily work',
          'Enterprise-scale automated workflows',
          'Nobody — the video says free is unusable',
        ],
        answer: 1,
        explanation: 'Given the tight ~10-prompt/5-hour cap, the video positions the free tier as workable for occasional questions but not for consistent daily reliance.',
      },
      {
        prompt: 'Who does the video suggest the higher-priced Max plan is really built for?',
        options: [
          'First-time users just trying Claude out',
          'People who rarely use AI tools',
          'Power users who run Claude continuously throughout their workday',
          'Users who only need it once a week',
        ],
        answer: 2,
        explanation: 'The video positions Max as addressing the needs of power users whose usage is heavy and continuous, beyond what Pro comfortably covers.',
      },
    ],
  },
  {
    id: 'productivity-2',
    partLabel: 'Part 2 of 4',
    part: 2,
    title: 'What Is Microsoft Copilot?',
    tagline: 'Your AI assistant, built directly into the Microsoft 365 apps you already use.',
    requirement: 'required',
    minutes: 6,
    sections: [
      {
        kind: 'lead',
        text: 'Copilot is an AI assistant woven into your everyday work tools.',
        body: 'Microsoft Copilot is built into apps like Word, Excel, PowerPoint, Outlook, and Teams. You describe what you need in plain language, and Copilot drafts, analyzes, or summarizes — grounded in your own work content, with your permission.',
      },
      {
        kind: 'video',
        youtubeId: 'MuNor5jjhVI',
        heading: 'Watch: Microsoft Copilot Explained in 6 Minutes',
        caption: '(~6 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Built into Microsoft 365', body: 'Copilot works inside Word, Excel, PowerPoint, Outlook, Teams, and more — no separate app needed.' },
          { title: 'You talk to it in plain language', body: 'Describe what you want — "summarize this thread," "draft a proposal" — and Copilot responds.' },
          { title: 'Grounded in your work', body: 'With permission, Copilot can reference your documents, emails, and meetings for relevant answers.' },
          { title: 'A starting point, not a final answer', body: 'Copilot drafts fast — you still review and refine before sending or publishing.' },
        ],
      },
    ],
    quiz: [
      {
        prompt: 'Where does Microsoft Copilot work?',
        options: [
          'Directly inside Microsoft 365 apps like Word, Excel, and Outlook',
          'Only in a separate standalone app',
          'Only on a physical device made by Microsoft',
          'Only in web browsers',
        ],
        answer: 0,
        explanation: 'Copilot is built into the Microsoft 365 apps people already use for work, not a separate destination.',
      },
      {
        prompt: 'How do you interact with Copilot?',
        options: [
          'By describing what you want in plain language',
          'By writing code',
          'By configuring XML files',
          'You cannot interact with it directly',
        ],
        answer: 0,
        explanation: 'You describe your request in natural, plain language, and Copilot responds accordingly.',
      },
      {
        prompt: 'What makes Copilot’s answers relevant to your specific job?',
        options: [
          'With permission, it can reference your own documents, emails, and meetings',
          'It only uses generic public internet knowledge',
          'It guesses randomly',
          'It requires no data at all',
        ],
        answer: 0,
        explanation: 'Copilot can ground its responses in your own work content, when you have permission to access it.',
      },
      {
        prompt: 'What should you do with what Copilot drafts?',
        options: [
          'Review and refine it before using it',
          'Publish it immediately without looking',
          'Delete it automatically',
          'Never read it',
        ],
        answer: 0,
        explanation: 'Copilot drafts quickly, but a person should still review and refine the output before it goes out.',
      },
    ],
  },
  {
    id: 'productivity-3',
    partLabel: 'Part 3 of 4',
    part: 3,
    title: 'Copilot in Word, Excel & PowerPoint',
    tagline: 'Hands-on ways to use Copilot in the apps you use every day.',
    requirement: 'required',
    minutes: 12,
    sections: [
      {
        kind: 'lead',
        text: 'Same assistant, different job in every app.',
        body: 'Copilot adapts to what each app is for: drafting and rewriting in Word, analyzing data in Excel, and building slides in PowerPoint — all from a plain-language prompt.',
      },
      {
        kind: 'video',
        youtubeId: 'CYwqjo7BA5c',
        heading: 'Watch: How to Use Microsoft Copilot in Word, Excel & PowerPoint',
        caption: 'Cloud Design Box (~12 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Word', body: 'Draft a first version of a document, rewrite a paragraph, or summarize a long file into key points.' },
          { title: 'Excel', body: 'Ask Copilot to analyze a dataset, spot trends, or explain what a formula does in plain English.' },
          { title: 'PowerPoint', body: 'Turn a Word document into a draft slide deck, or generate slides directly from a prompt.' },
          { title: 'Prompt, then refine', body: 'The first result is a starting point — ask follow-up questions to adjust tone, detail, or structure.' },
        ],
      },
    ],
    quiz: [
      {
        prompt: 'What can Copilot help with in Word?',
        options: [
          'Drafting, rewriting, or summarizing a document',
          'Only spell-checking',
          'Printing documents',
          'Formatting the operating system',
        ],
        answer: 0,
        explanation: 'In Word, Copilot can draft new content, rewrite existing text, or summarize a long document.',
      },
      {
        prompt: 'What can Copilot help with in Excel?',
        options: [
          'Analyzing data, spotting trends, and explaining formulas',
          'Designing a company logo',
          'Sending emails automatically',
          'Editing video files',
        ],
        answer: 0,
        explanation: 'In Excel, Copilot can help analyze datasets, identify trends, and explain what formulas are doing.',
      },
      {
        prompt: 'What can Copilot do in PowerPoint?',
        options: [
          'Turn a document into a draft slide deck, or build slides from a prompt',
          'Only change the file name',
          'Record a video presentation automatically',
          'Delete unused slides only',
        ],
        answer: 0,
        explanation: 'Copilot in PowerPoint can generate a first draft of slides from a document or a prompt.',
      },
      {
        prompt: 'What should you do if Copilot’s first result isn’t quite right?',
        options: [
          'Ask a follow-up to refine tone, detail, or structure',
          'Give up and do it manually with no further attempts',
          'Restart the whole application',
          'Assume it can never be changed',
        ],
        answer: 0,
        explanation: 'Copilot supports follow-up prompts — treat the first result as a draft you can refine further.',
      },
    ],
  },
  {
    id: 'productivity-4',
    partLabel: 'Part 4 of 4',
    part: 4,
    title: 'Writing Better Copilot Prompts',
    tagline: 'Small changes to how you ask make a big difference in what you get back.',
    requirement: 'required',
    minutes: 7,
    sections: [
      {
        kind: 'lead',
        text: 'A better prompt gets a better answer, faster.',
        body: 'Copilot responds to how you ask, not just what you ask. A few simple habits — giving it a clear goal, useful context, and a specific format — make its answers far more useful on the first try.',
      },
      {
        kind: 'video',
        youtubeId: 'QDLwaYYRjA8',
        heading: 'Watch: Microsoft Copilot Prompts Tutorial',
        caption: '(~7 min)',
      },
      {
        kind: 'list',
        heading: 'Key ideas from the video',
        items: [
          { title: 'Goal, context, expectations, source', body: 'A strong prompt states what you want, gives background, describes the format you expect, and points to a source if relevant.' },
          { title: 'Order matters', body: 'Copilot weighs the end of a prompt more heavily — put the most important instructions or source last.' },
          { title: 'Use natural, clear language', body: 'Write like you’re talking to a colleague — plain language, clear punctuation.' },
          { title: 'Iterate', body: 'If the first answer isn’t right, refine your prompt rather than starting over from nothing.' },
        ],
      },
      {
        kind: 'checklist',
        heading: 'Before you send a prompt, check…',
        items: [
          'Have you stated a clear goal?',
          'Have you given enough context for Copilot to understand the situation?',
          'Have you said what format or length you expect?',
          'If relevant, have you pointed it at the right file or source — placed last in the prompt?',
          'Will you review the answer before using it?',
        ],
      },
    ],
    quiz: [
      {
        prompt: 'What four elements can make up a strong Copilot prompt?',
        options: [
          'Goal, context, expectations, and source',
          'Font, color, size, and margin',
          'Username, password, date, and time',
          'Only the goal — nothing else matters',
        ],
        answer: 0,
        explanation: 'A well-structured prompt can include a goal, context, your expectations for the response, and a source to draw from.',
      },
      {
        prompt: 'Why does the order of instructions in a prompt matter?',
        options: [
          'Copilot tends to weigh the later parts of a prompt more heavily',
          'It doesn’t matter at all',
          'Only the first word is ever read',
          'Prompts must be exactly one sentence long',
        ],
        answer: 0,
        explanation: 'Later parts of a prompt are emphasized more — so put key instructions or a source near the end.',
      },
      {
        prompt: 'What should you do if Copilot’s first response isn’t what you wanted?',
        options: [
          'Revise your prompt and try again',
          'Assume Copilot is broken and stop using it',
          'Never give it a second try',
          'Restart your computer',
        ],
        answer: 0,
        explanation: 'Iterating on your prompt — clarifying or adjusting it — usually gets you a much better result.',
      },
      {
        prompt: 'Why should you always review Copilot’s output before using it?',
        options: [
          'It can occasionally generate inaccurate or inappropriate content, like any AI',
          'Because it always writes in the wrong language',
          'Because it costs extra to skip review',
          'It never needs review, only sometimes',
        ],
        answer: 0,
        explanation: 'Like any AI tool, Copilot can occasionally get things wrong — reviewing before use is a basic safety habit.',
      },
    ],
  },
];

/* ─── Tracks ─────────────────────────────────────────────────────────── */

export const TRACKS: Track[] = [
  {
    id: 'general-beginner',
    eyebrow: 'General Track · Beginner',
    title: 'AI Fundamentals: Watch & Learn',
    subtitle:
      'Ten short videos covering the basics of AI, machine learning, and using AI tools responsibly — with a quiz after each.',
    accent: '#307c4c',
    accentSoft: '#f0f9f4',
    modules: generalBeginnerModules,
  },
  {
    id: 'general-intermediate',
    eyebrow: 'General Track · Intermediate',
    title: 'AI in Practice',
    subtitle:
      'Going deeper into prompting, agents, multimodal AI, and real business risk — with a quiz after each video.',
    accent: '#0891b2',
    accentSoft: '#ecfeff',
    modules: generalIntermediateModules,
  },
  {
    id: 'general-advanced',
    eyebrow: 'General Track · Advanced',
    title: 'AI Strategy & Leadership',
    subtitle:
      'Strategic, governance, and leadership-level AI topics for business audiences — with a quiz after each video.',
    accent: '#7c3aed',
    accentSoft: '#f5f3ff',
    modules: generalAdvancedModules,
  },
  {
    id: 'technical-beginner',
    eyebrow: 'Technical Track · Beginner',
    title: 'Under the Hood: AI Foundations',
    subtitle:
      'Neural networks, LLMs, transformers, tokenization, embeddings, gradient descent, RAG, feature engineering, fine-tuning, and building AI agents — with a quiz after each video.',
    accent: '#4f46e5',
    accentSoft: '#eef2ff',
    modules: technicalBeginnerModules,
  },
  {
    id: 'technical-intermediate',
    eyebrow: 'Technical Track · Intermediate',
    title: 'Building Real AI Systems',
    subtitle:
      'Vector databases, evaluation, tool calling, orchestration, quantization, MLOps, RLHF, and more — with a quiz after each video.',
    accent: '#e11d48',
    accentSoft: '#fff1f2',
    modules: technicalIntermediateModules,
  },
  {
    id: 'technical-advanced',
    eyebrow: 'Technical Track · Advanced',
    title: 'Research-Level AI',
    subtitle:
      'Cutting-edge, research-oriented AI topics — with a quiz after each video.',
    accent: '#ea580c',
    accentSoft: '#fff7ed',
    modules: technicalAdvancedModules,
  },
  {
    id: 'productivity',
    eyebrow: 'Productivity Track',
    title: 'Use AI for Business',
    subtitle:
      'Four videos on getting real work done with Claude Pro and Microsoft Copilot — with a quiz after each.',
    accent: '#2563eb',
    accentSoft: '#eff6ff',
    modules: productivityModules,
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
