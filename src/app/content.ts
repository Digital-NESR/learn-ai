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

export interface Module {
  /** url slug, e.g. "general-beginner-1" */
  id: string;
  /** "Part 1 of 10" */
  partLabel: string;
  part: number;
  title: string;
  tagline: string;
  /** rough time to read + quiz */
  minutes: number;
  sections: ContentBlock[];
  quiz: QuizQuestion[];
}

export type TrackId =
  | 'general-beginner'
  | 'general-intermediate'
  | 'general-advanced'
  | 'technical'
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
   (8 of 10 videos so far — 2 slots held back after a duplicate-video
   conflict with the Technical track was caught during QA; to be topped up.)
   ══════════════════════════════════════════════════════════════════════ */

const generalIntermediateModules: Module[] = [
  {
    id: 'general-intermediate-1',
    partLabel: 'Part 1 of 8',
    part: 1,
    title: 'Prompt Engineering: Four Ways to Talk to an AI',
    tagline: 'Beyond "write a good prompt" — the actual named techniques that make LLMs more accurate.',
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
    partLabel: 'Part 2 of 8',
    part: 2,
    title: 'Why AI Chatbots Sometimes Make Things Up',
    tagline: 'Hallucinations explained: why a confident-sounding AI answer can still be wrong.',
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
    partLabel: 'Part 3 of 8',
    part: 3,
    title: 'Multimodal AI: One Model, Many Kinds of Input',
    tagline: 'How modern AI systems handle text, images, and audio together, not separately.',
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
    partLabel: 'Part 4 of 8',
    part: 4,
    title: 'AI in the Supply Chain',
    tagline: 'How AI is being applied to real supply chain and procurement operations.',
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
    partLabel: 'Part 5 of 8',
    part: 5,
    title: 'AI, Machine Learning, Deep Learning, and Generative AI: What’s the Difference?',
    tagline: 'How models actually learn from data, and where each buzzword fits.',
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
    partLabel: 'Part 6 of 8',
    part: 6,
    title: 'Five AI Risks That Can Get You Fired',
    tagline: 'The real security and governance pitfalls of using AI carelessly at work.',
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
    partLabel: 'Part 7 of 8',
    part: 7,
    title: 'The Future of AI: A Conversation With Sam Altman',
    tagline: 'A live, unscripted look at where one of AI’s most influential leaders thinks the field is headed.',
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
    partLabel: 'Part 8 of 8',
    part: 8,
    title: 'The Rise of Generative AI for Business',
    tagline: 'Zooming out: why generative AI is being called a defining, industrial-revolution-scale moment for business.',
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

const technicalModules: Module[] = [
  {
    id: 'technical-1',
    partLabel: 'Part 1 of 6',
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
    partLabel: 'Part 2 of 6',
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
    partLabel: 'Part 3 of 6',
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
  {
    id: 'technical-4',
    partLabel: 'Part 4 of 6',
    part: 4,
    title: 'Retrieval-Augmented Generation (RAG)',
    tagline: 'How to ground an AI’s answers in your own real, up-to-date data.',
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
    id: 'technical-5',
    partLabel: 'Part 5 of 6',
    part: 5,
    title: 'Feature Engineering',
    tagline: 'Turning raw data into the inputs a model can actually learn from.',
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
    id: 'technical-6',
    partLabel: 'Part 6 of 6',
    part: 6,
    title: 'Building AI Agents',
    tagline: 'The difference between an AI that answers and an AI that acts.',
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
    id: 'technical',
    eyebrow: 'Technical Track',
    title: 'Under the Hood: Building & Understanding AI',
    subtitle:
      'Six deep-dive videos — neural networks, LLMs, transformers, RAG, feature engineering, and building AI agents — with a quiz after each.',
    accent: '#4f46e5',
    accentSoft: '#eef2ff',
    modules: technicalModules,
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
