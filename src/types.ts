export interface UserProfile {
  age: number;
  income: number;
  occupation: string;
  goals: string[];
  riskProfile: 'Conservative' | 'Moderate' | 'Aggressive';
  learningHistory: string[];
  quizScores: { [lessonId: string]: number };
  xp: number;
  streak: number;
  badges: string[];
  monthlyExpenses: number;
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  section: string;
  content: string;
  keyPoints: string[];
}

export interface LearningPath {
  userId: string;
  title: string;
  lessons: Lesson[];
  currentLessonId: string;
  progressPercent: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index in options
  explanation: string;
}

export interface Quiz {
  lessonId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface Flashcard {
  term: string;
  definition: string;
  example: string;
  category: string;
}

export interface BudgetItem {
  category: string;
  amount: number;
}

export interface BudgetPlan {
  income: number;
  expenses: BudgetItem[];
  savingsPlan: string;
  emergencyFundGoal: number;
  suggestedAction: string;
  expensePrediction: string;
}

export interface SIPResult {
  monthlyInvestment: number;
  rateOfReturn: number;
  years: number;
  totalInvestment: number;
  wealthGained: number;
  futureValue: number;
  yearlyBreakdown: {
    year: number;
    investment: number;
    interest: number;
    total: number;
  }[];
}

export interface RAGContext {
  id: string;
  title: string;
  source: string;
  url: string;
  content: string;
  category: string;
}

export interface OrchestrationResult {
  query: string;
  analysis: {
    intentDetected: string;
    agentsTriggered: string[];
  };
  mcpOutputs: {
    profile?: UserProfile;
    finance?: {
      termExplained?: { term: string; explanation: string; guide: string };
      comparedProducts?: string;
    };
    budget?: BudgetPlan;
    investment?: SIPResult;
    learning?: {
      path?: LearningPath;
      nextLesson?: Lesson;
    };
    quiz?: Quiz;
    rag?: RAGContext[];
  };
  responseMarkdown: string;
  citations: { source: string; url: string; snippet: string }[];
}
