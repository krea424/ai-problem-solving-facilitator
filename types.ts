export interface AIResponse {
  problemAnalysis: string;
  strategicGoals: string[];
  recommendedFrameworks: Framework[];
}

export interface FrameworkGuidance {
  title: string;
  description:string;
  keyQuestions: string[];
  framework: Framework;
}

export type Answer = {
  question: string;
  answer: string;
};

export interface FinalSolution {
  title: string;
  summary: string;
  recommendations: Array<{
    title: string;
    details: string;
  }>;
}

// Problem Classification Types
export type IndustryVertical =
  | 'Technology'
  | 'Healthcare'
  | 'Financial'
  | 'Retail'
  | 'Manufacturing'
  | 'Services'
  | 'Other';

export type ProblemCategory = 'Strategic' | 'Operational' | 'MarketEntry' | 'Digital' | 'Innovation' | 'Organizational';

export type FrameworkType = 'Analysis' | 'Strategy' | 'Implementation' | 'Evaluation';

export interface Framework {
  id: string;
  name: string;
  type: FrameworkType;
  description: string;
  steps: string[];
  templates?: Record<string, any>;
  industryGuidance?: Record<IndustryVertical, string>;
}

export interface StakeholderAnalysis {
  stakeholderName: string;
  influence: number; // 1-10
  interest: number; // 1-10
  engagement: 'Champion' | 'Supporter' | 'Neutral' | 'Critic' | 'Blocker';
  actions: string[];
}

export interface RiskAssessment {
  riskName: string;
  probability: number; // 1-5
  impact: number; // 1-5
  mitigationStrategy: string;
  contingencyPlan: string;
  owner: string;
}

export interface ImplementationPlan {
  phases: {
    name: string;
    duration: string;
    activities: string[];
    deliverables: string[];
    stakeholders: string[];
    risks: RiskAssessment[];
  }[];
  kpis: {
    metric: string;
    target: string;
    frequency: string;
  }[];
}

export interface Solution {
  problemCategory: ProblemCategory;
  industry: IndustryVertical;
  frameworks: Framework[];
  stakeholderAnalysis: StakeholderAnalysis[];
  riskAssessment: RiskAssessment[];
  implementationPlan: ImplementationPlan;
  nextSteps: string[];
  successMetrics: string[];
}

// Session types for persistence
export interface Session {
  id: string;
  created_at: string;
  name: string;
  content: {
    problem: string;
    context: string;
    solution: Solution;
    collaborators?: string[];
    status: 'Draft' | 'InProgress' | 'Completed';
    version: number;
  };
}

export interface Playbook {
  id: string;
  name: string;
  objective: string;
  context: string;
  description: string;
  sector: IndustryVertical;
  problemCategory: ProblemCategory;
  frameworks: Framework[];
  implementationPlan: ImplementationPlan;
  stakeholderTemplates: StakeholderAnalysis[];
  riskTemplates: RiskAssessment[];
  kpis: ImplementationPlan['kpis'];
}

export interface ComplexityScore {
  causeAmbiguity: {
    score: number;
    reasoning: string;
  };
  interconnections: {
    score: number;
    reasoning: string;
  };
  businessImpact: {
    score: number;
    reasoning: string;
  };
  strategicRecommendations: string[];
}

export interface FiveWhysStep {
  id: number;
  question: string;
  answer: string;
}

export interface FiveWhys {
  id: string;
  name: string;
  type: 'Analysis';
  description: string;
  steps: FiveWhysStep[];
}

export interface AISuggestedSolution {
  solutionTitle: string;
  solutionDescription: string;
  kpi: {
    metric: string;
    target: string;
  };
  alert: {
    risk: string;
    mitigation: string;
  };
  quote: {
    text: string;
    author: string;
  };
}
