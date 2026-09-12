export type CalculatorId =
  | 'scientific'
  | 'graphing'
  | 'mortgage'
  | 'loan'
  | 'tax'
  | 'interest'
  | 'payment'
  | 'time'
  | 'profit-margin'
  | 'roi'
  | 'percentage'
  | 'discount'
  | 'tip'
  | 'vat';

export interface InputField {
  id: string;
  label: string;
  type: 'number' | 'select' | 'date' | 'boolean';
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  tooltip?: string;
}

export interface ResultField {
  id: string;
  label: string;
  value: string | number;
  isPrimary?: boolean;
  prefix?: string;
  suffix?: string;
  format?: 'currency' | 'percent' | 'number' | 'text' | 'date';
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CalculatorSchema {
  id: CalculatorId;
  name: string;
  shortDescription: string;
  category: 'Financial Mathematics' | 'Practical Mathematics' | 'Basic Mathematics';
  lastUpdated: string;
  inputs: InputField[];
  formula: {
    equation: string;
    description: string;
    steps: string[];
  };
  example: {
    scenario: string;
    explanation: string;
  };
  faqs: FAQItem[];
}

export interface CalculationRecord {
  id: string;
  calculatorId: CalculatorId;
  calculatorName: string;
  category: CalculatorSchema['category'];
  inputs: Record<string, unknown>;
  results: ResultField[];
  name?: string;
  createdAt: string;
}

export interface CalculatorWorkspace {
  history: CalculationRecord[];
  saved: CalculationRecord[];
  favorites: CalculatorId[];
  recentlyUsed: CalculatorId[];
}

export interface GuideArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  publishedDate: string;
}

export interface User {
  _id?: string;
  fullName: string;
  username?: string;
  email: string;
  profilePicture?: string;
  provider: 'email' | 'google';
  password?: string;
  role: 'user' | 'admin';
  accountStatus: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  refreshToken?: string;
  bio?: string;
  // Email Verification Fields
  verificationToken?: string;
  verificationTokenExpires?: Date;
  verificationAttempts?: number;
  lastVerificationSent?: Date;
  // Password Reset Fields
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
  resetAttempts?: number;
  lastResetSent?: Date;
  history?: CalculationRecord[];
  savedCalculations?: CalculationRecord[];
  favoriteCalculators?: CalculatorId[];
  recentlyUsed?: CalculatorId[];
}
