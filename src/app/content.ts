/**
 * NESR AI Verse - beginner content.
 *
 * Four tracks (Business, Create AI for Business, Advanced, Use AI for
 * Business), three video modules ("parts") each, and a short quiz after
 * every module.
 *
 * This is static, data-driven content - no database. The landing page and
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

export type TrackId = 'business' | 'create-ai' | 'advanced' | 'use-ai';

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
          { title: 'AI, defined', body: 'Machines that simulate human intelligence - learning, reasoning, and problem-solving.' },
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
        explanation: 'AI is about machines simulating human intelligence - learning, reasoning, and solving problems.',
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
          'Narrow AI - built for a specific task',
          'General AI - human-level at everything',
          'Super AI - beyond human ability',
          'None - AI has no types',
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
        text: 'Generative AI creates new content - text, images, and code.',
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
          { title: 'Capable but fallible', body: 'It can be confidently wrong - treat its output as a draft to review, not a final answer.' },
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
        body: 'This IBM explainer introduces AI ethics - the principles that help organizations capture AI’s benefits while reducing harms like bias and loss of trust.',
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
          { title: 'What AI ethics is', body: 'A set of principles for developing and using AI responsibly - maximizing benefit while reducing harm.' },
          { title: 'Bias is a core risk', body: 'AI trained on skewed data can produce unfair outcomes.' },
          { title: 'Transparency & explainability', body: 'People should be able to understand and question how AI reaches a decision.' },
          { title: 'Accountability', body: 'Organizations and people - not the AI - are responsible for outcomes.' },
        ],
      },
    ],
    quiz: [
      {
        prompt: 'What is AI ethics mainly about?',
        options: [
          'Principles for using AI responsibly - maximizing benefit and reducing harm',
          'Making AI models run faster',
          'Choosing which hardware to buy',
          'A new programming language',
        ],
        answer: 0,
        explanation: 'AI ethics is about responsible development and use - getting the benefits while limiting harm.',
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
        explanation: 'Bias in the training data can lead to unfair or skewed outcomes - a central AI-ethics concern.',
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
        explanation: 'Accountability stays with the people and organizations deploying AI - not the tool.',
      },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════
   CREATE AI FOR BUSINESS TRACK
   ══════════════════════════════════════════════════════════════════════ */

const createAiModules: Module[] = [
  {
    id: 'create-1',
    partLabel: 'Part 1 of 3',
    part: 1,
    title: 'Retrieval-Augmented Generation (RAG)',
    tagline: 'How to ground an AI’s answers in your own real, up-to-date data.',
    minutes: 8,
    sections: [
      {
        kind: 'lead',
        text: 'RAG lets an AI look things up before it answers.',
        body: 'Retrieval-Augmented Generation (RAG) connects a language model to an external knowledge base - your documents, policies, or databases - so it can pull in relevant, current information before generating a response, instead of relying only on what it learned during training.',
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
          { title: 'No retraining needed', body: 'Update the knowledge base and the model’s answers update too - no expensive retraining required.' },
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
          'Update the knowledge base it retrieves from - no retraining needed',
          'Retrain the entire model from scratch every time',
          'Buy a bigger computer',
          'It can never be updated',
        ],
        answer: 0,
        explanation: 'Since RAG retrieves from an external knowledge base, updating that source updates the answers - no costly retraining required.',
      },
    ],
  },
  {
    id: 'create-2',
    partLabel: 'Part 2 of 3',
    part: 2,
    title: 'Feature Engineering',
    tagline: 'Turning raw data into the inputs a model can actually learn from.',
    minutes: 10,
    sections: [
      {
        kind: 'lead',
        text: 'Good features make a good model.',
        body: 'Feature engineering is the process of selecting, transforming, and creating the input variables (“features”) that a machine learning model learns from. Raw data is rarely ready to use as-is - this is the step that shapes it into something a model can work with well.',
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
          'It never really happens - models use raw data directly',
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
        explanation: 'A model can only learn as well as the data it’s given - strong features often matter more than the choice of algorithm.',
      },
    ],
  },
  {
    id: 'create-3',
    partLabel: 'Part 3 of 3',
    part: 3,
    title: 'Building AI Agents',
    tagline: 'The difference between an AI that answers and an AI that acts.',
    minutes: 10,
    sections: [
      {
        kind: 'lead',
        text: 'An agent doesn’t just answer - it acts.',
        body: 'An AI agent extends a language model with the ability to make decisions, call tools or APIs, and carry out multi-step tasks toward a goal - rather than simply generating a single reply to a question.',
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
          { title: 'Order processing agent', body: 'Checks inventory, confirms pricing, and places an order - across multiple systems.' },
          { title: 'IT helpdesk agent', body: 'Diagnoses an issue, checks a knowledge base, and resets an account if appropriate - without a human doing each step.' },
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
        explanation: 'Agents go beyond a single reply - they can plan steps, call tools, and act toward completing a goal.',
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
   ADVANCED TRACK
   ══════════════════════════════════════════════════════════════════════ */

const advancedModules: Module[] = [
  {
    id: 'advanced-1',
    partLabel: 'Part 1 of 3',
    part: 1,
    title: 'What Is a Neural Network?',
    tagline: 'The building block behind modern AI - built up from scratch, and visualized.',
    minutes: 20,
    sections: [
      {
        kind: 'lead',
        text: 'A neural network learns patterns from examples.',
        body: 'This 3Blue1Brown video uses the classic task of recognizing handwritten digits to show how a network of simple “neurons,” arranged in layers, turns raw pixels into an answer - without anyone writing the rules by hand.',
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
          { title: 'Neurons hold a number', body: 'Each neuron carries an “activation” - a value between 0 and 1.' },
          { title: 'Organized in layers', body: 'An input layer, one or more hidden layers, and an output layer.' },
          { title: 'The digit example', body: 'A 28×28 image feeds 784 input neurons; 10 output neurons score the digits 0–9.' },
          { title: 'Weights and biases', body: 'Connections have weights and each neuron a bias - the values the network tunes to “learn.”' },
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
        explanation: 'A neuron holds an activation - a number between 0 and 1 representing how “lit up” it is.',
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
    id: 'advanced-2',
    partLabel: 'Part 2 of 3',
    part: 2,
    title: 'Large Language Models, Briefly',
    tagline: 'What an LLM actually does, and how it gets trained - in plain terms.',
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
        explanation: 'An LLM is, at heart, a next-word predictor - it outputs how likely each possible next word is.',
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
        explanation: '“Large” refers to the enormous number of tunable parameters - often hundreds of billions.',
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
    id: 'advanced-3',
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
        explanation: 'GPT = Generative Pretrained Transformer - the transformer is the core architecture.',
      },
      {
        prompt: 'Before a transformer processes text, the text is first broken into…',
        options: ['Tokens', 'Pixels', 'Folders', 'Whole sentences only'],
        answer: 0,
        explanation: 'Text is split into tokens - small chunks such as words or word-pieces.',
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
        explanation: 'Each token becomes an embedding - a vector - and vectors with similar meanings sit near each other.',
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

/* ══════════════════════════════════════════════════════════════════════
   USE AI FOR BUSINESS TRACK (MICROSOFT COPILOT)
   ══════════════════════════════════════════════════════════════════════ */

const useAiModules: Module[] = [
  {
    id: 'use-1',
    partLabel: 'Part 1 of 3',
    part: 1,
    title: 'What Is Microsoft Copilot?',
    tagline: 'Your AI assistant, built directly into the Microsoft 365 apps you already use.',
    minutes: 6,
    sections: [
      {
        kind: 'lead',
        text: 'Copilot is an AI assistant woven into your everyday work tools.',
        body: 'Microsoft Copilot is built into apps like Word, Excel, PowerPoint, Outlook, and Teams. You describe what you need in plain language, and Copilot drafts, analyzes, or summarizes - grounded in your own work content, with your permission.',
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
          { title: 'Built into Microsoft 365', body: 'Copilot works inside Word, Excel, PowerPoint, Outlook, Teams, and more - no separate app needed.' },
          { title: 'You talk to it in plain language', body: 'Describe what you want - "summarize this thread," "draft a proposal" - and Copilot responds.' },
          { title: 'Grounded in your work', body: 'With permission, Copilot can reference your documents, emails, and meetings for relevant answers.' },
          { title: 'A starting point, not a final answer', body: 'Copilot drafts fast - you still review and refine before sending or publishing.' },
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
    id: 'use-2',
    partLabel: 'Part 2 of 3',
    part: 2,
    title: 'Copilot in Word, Excel & PowerPoint',
    tagline: 'Hands-on ways to use Copilot in the apps you use every day.',
    minutes: 12,
    sections: [
      {
        kind: 'lead',
        text: 'Same assistant, different job in every app.',
        body: 'Copilot adapts to what each app is for: drafting and rewriting in Word, analyzing data in Excel, and building slides in PowerPoint - all from a plain-language prompt.',
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
          { title: 'Prompt, then refine', body: 'The first result is a starting point - ask follow-up questions to adjust tone, detail, or structure.' },
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
        explanation: 'Copilot supports follow-up prompts - treat the first result as a draft you can refine further.',
      },
    ],
  },
  {
    id: 'use-3',
    partLabel: 'Part 3 of 3',
    part: 3,
    title: 'Writing Better Copilot Prompts',
    tagline: 'Small changes to how you ask make a big difference in what you get back.',
    minutes: 7,
    sections: [
      {
        kind: 'lead',
        text: 'A better prompt gets a better answer, faster.',
        body: 'Copilot responds to how you ask, not just what you ask. A few simple habits - giving it a clear goal, useful context, and a specific format - make its answers far more useful on the first try.',
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
          { title: 'Order matters', body: 'Copilot weighs the end of a prompt more heavily - put the most important instructions or source last.' },
          { title: 'Use natural, clear language', body: 'Write like you’re talking to a colleague - plain language, clear punctuation.' },
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
          'If relevant, have you pointed it at the right file or source - placed last in the prompt?',
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
          'Only the goal - nothing else matters',
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
        explanation: 'Later parts of a prompt are emphasized more - so put key instructions or a source near the end.',
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
        explanation: 'Iterating on your prompt - clarifying or adjusting it - usually gets you a much better result.',
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
        explanation: 'Like any AI tool, Copilot can occasionally get things wrong - reviewing before use is a basic safety habit.',
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
      'A three-part video series - what AI is, using generative AI at work, and using it responsibly - with a short quiz after each.',
    accent: '#307c4c',
    accentSoft: '#f0f9f4',
    modules: businessModules,
  },
  {
    id: 'create-ai',
    eyebrow: 'Create AI Track',
    title: 'Create AI for Business',
    subtitle:
      'A three-part video series on building AI - retrieval-augmented generation, feature engineering, and AI agents - with a short quiz after each.',
    accent: '#0891b2',
    accentSoft: '#ecfeff',
    modules: createAiModules,
  },
  {
    id: 'advanced',
    eyebrow: 'Advanced Track',
    title: 'Advanced AI: Watch & Learn',
    subtitle:
      'A three-part video series - neural networks, large language models, and transformers - with a short quiz after each. Videos by 3Blue1Brown.',
    accent: '#4f46e5',
    accentSoft: '#eef2ff',
    modules: advancedModules,
  },
  {
    id: 'use-ai',
    eyebrow: 'Use AI Track',
    title: 'Use AI for Business',
    subtitle:
      'A three-part video series on Microsoft Copilot - what it is, using it in Word/Excel/PowerPoint, and writing better prompts - with a short quiz after each.',
    accent: '#2563eb',
    accentSoft: '#eff6ff',
    modules: useAiModules,
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
