import { calculatorsData } from '@/data/calculators';
import { guidesData } from '@/data/guides';
import type { CalculatorId, GuideQualityProfile, SearchIntentProfile, TopicCluster } from '@/types';

export function getSearchIntentProfile(calculatorId: CalculatorId): SearchIntentProfile {
  const calculator = calculatorsData[calculatorId];

  const profileMap: Record<CalculatorId, SearchIntentProfile> = {
    scientific: {
      calculatorId: 'scientific',
      primaryIntent: 'calculate scientific expressions',
      secondaryIntents: ['evaluate formulas', 'check trigonometric functions', 'solve algebraic expressions'],
      userProblem: 'Need fast, accurate calculations for science, engineering, and math-heavy work without switching tools.',
      targetAudience: 'students, analysts, and technical users',
      relatedQuestions: ['How do I calculate sine or cosine?', 'How do I solve a logarithmic expression?', 'What is the result of a formula with parentheses?'],
      relatedCalculators: ['percentage', 'time', 'age'],
      supportingGuides: [],
    },
    graphing: {
      calculatorId: 'graphing',
      primaryIntent: 'plot mathematical functions and graph equations',
      secondaryIntents: ['visualize function behavior', 'inspect roots and intersections', 'compare graph shapes'],
      userProblem: 'Needs a visual way to understand how a formula behaves across a domain.',
      targetAudience: 'students and analysts',
      relatedQuestions: ['How do I graph a quadratic?', 'What does the function look like?', 'Where do the roots intersect the axis?'],
      relatedCalculators: ['scientific', 'percentage'],
      supportingGuides: [],
    },
    mortgage: {
      calculatorId: 'mortgage',
      primaryIntent: 'calculate monthly mortgage payment',
      secondaryIntents: ['compare home loan options', 'estimate total mortgage interest', 'check affordability'],
      userProblem: 'Needs to understand the monthly cost and total interest of a home loan before committing to a mortgage.',
      targetAudience: 'homebuyers and homeowners',
      relatedQuestions: ['What is my monthly mortgage payment?', 'How much interest will I pay over 30 years?', 'How does a larger down payment change the loan?'],
      relatedCalculators: ['loan', 'payment', 'interest'],
      supportingGuides: ['understanding-amortization'],
    },
    'reverse-mortgage': {
      calculatorId: 'reverse-mortgage',
      primaryIntent: 'estimate reverse mortgage proceeds',
      secondaryIntents: ['project equity after repayment', 'compare planned retirement cash flow', 'estimate home equity over time'],
      userProblem: 'Needs a high-level estimate of potential proceeds and long-term equity impact before discussing a reverse mortgage.',
      targetAudience: 'older homeowners planning retirement',
      relatedQuestions: ['How much could I access with a reverse mortgage?', 'How will equity change over time?', 'What happens if I still have an existing mortgage?'],
      relatedCalculators: ['mortgage', 'loan'],
      supportingGuides: [],
    },
    loan: {
      calculatorId: 'loan',
      primaryIntent: 'estimate loan repayment schedule',
      secondaryIntents: ['compare borrowing costs', 'see monthly payment by term', 'model principal and interest'],
      userProblem: 'Needs to estimate the total cost and payment structure for a loan before borrowing.',
      targetAudience: 'borrowers and small business owners',
      relatedQuestions: ['What will my monthly payment be?', 'What is the total cost of the loan?', 'How do interest rate and term affect borrowing?'],
      relatedCalculators: ['mortgage', 'payment', 'interest'],
      supportingGuides: ['understanding-amortization'],
    },
    tax: {
      calculatorId: 'tax',
      primaryIntent: 'estimate tax liability',
      secondaryIntents: ['compare filing scenarios', 'estimate withholding impact', 'review tax planning assumptions'],
      userProblem: 'Needs a simple estimate of how income, deductions, and filing status affect tax liability.',
      targetAudience: 'employees and small business owners',
      relatedQuestions: ['What will my tax bill be?', 'How do deductions affect my tax calculation?', 'What is the difference between marginal and effective tax rate?'],
      relatedCalculators: ['payment', 'interest'],
      supportingGuides: ['marginal-vs-effective-tax-rates'],
    },
    interest: {
      calculatorId: 'interest',
      primaryIntent: 'calculate interest growth or cost',
      secondaryIntents: ['compare simple versus compound growth', 'estimate total interest paid', 'model return scenarios'],
      userProblem: 'Needs to understand how interest accumulates or is charged over time.',
      targetAudience: 'borrowers, savers, and investors',
      relatedQuestions: ['How much interest will I pay?', 'How fast will savings grow?', 'What is compound interest?'],
      relatedCalculators: ['mortgage', 'loan', 'roi'],
      supportingGuides: ['understanding-amortization'],
    },
    payment: {
      calculatorId: 'payment',
      primaryIntent: 'estimate payment amount',
      secondaryIntents: ['model periodic payments', 'bridge affordability gaps', 'budget for recurring obligations'],
      userProblem: 'Needs a clear estimate of recurring payment obligations across a loan or financing plan.',
      targetAudience: 'budget planners and borrowers',
      relatedQuestions: ['What payment fits my budget?', 'How does term affect my payment?', 'What does the periodic payment formula look like?'],
      relatedCalculators: ['mortgage', 'loan', 'interest'],
      supportingGuides: ['understanding-amortization'],
    },
    time: {
      calculatorId: 'time',
      primaryIntent: 'calculate time differences and elapsed periods',
      secondaryIntents: ['measure elapsed time', 'convert time units', 'schedule date-based planning'],
      userProblem: 'Needs a precise way to compare or convert time spans across dates or units.',
      targetAudience: 'students and workers',
      relatedQuestions: ['How many days between two dates?', 'What is the elapsed time?', 'How do I convert time units correctly?'],
      relatedCalculators: ['age', 'percentage'],
      supportingGuides: [],
    },
    age: {
      calculatorId: 'age',
      primaryIntent: 'calculate age or time between dates',
      secondaryIntents: ['estimate age in years or months', 'find time since a date', 'plan date-based milestones'],
      userProblem: 'Needs to measure elapsed time accurately for planning, verification, or personal reference.',
      targetAudience: 'families, students, and general users',
      relatedQuestions: ['How old am I in years and months?', 'How long until a date?', 'How much time has passed since this event?'],
      relatedCalculators: ['time', 'payment'],
      supportingGuides: [],
    },
    'profit-margin': {
      calculatorId: 'profit-margin',
      primaryIntent: 'calculate profit margin',
      secondaryIntents: ['assess pricing strategy', 'estimate operating efficiency', 'compare profitability scenarios'],
      userProblem: 'Needs to understand whether the current pricing model creates healthy profit after costs.',
      targetAudience: 'small business owners',
      relatedQuestions: ['What is my profit margin?', 'How much margin does my pricing produce?', 'How do cost changes affect profitability?'],
      relatedCalculators: ['roi', 'payment'],
      supportingGuides: ['gross-margin-vs-markup'],
    },
    roi: {
      calculatorId: 'roi',
      primaryIntent: 'calculate return on investment',
      secondaryIntents: ['compare investment scenarios', 'estimate annualized gain', 'evaluate business decisions'],
      userProblem: 'Needs a simple method to understand whether an investment or project is worth pursuing.',
      targetAudience: 'investors and operators',
      relatedQuestions: ['What is my return on investment?', 'How much profit did I earn relative to cost?', 'Which option performs better?'],
      relatedCalculators: ['interest', 'profit-margin'],
      supportingGuides: ['gross-margin-vs-markup'],
    },
    percentage: {
      calculatorId: 'percentage',
      primaryIntent: 'calculate percentage-based values',
      secondaryIntents: ['estimate percent changes', 'compare proportional values', 'solve discount and markup questions'],
      userProblem: 'Needs a reliable way to calculate proportions, change, and discount values.',
      targetAudience: 'general users and shoppers',
      relatedQuestions: ['What is 20% of 400?', 'How much did the value increase by percentage?', 'What is the discount amount?'],
      relatedCalculators: ['profit-margin', 'discount', 'tip'],
      supportingGuides: [],
    },
    discount: {
      calculatorId: 'discount',
      primaryIntent: 'calculate sale discounts',
      secondaryIntents: ['estimate final sale price', 'compare discount offers', 'price savings'],
      userProblem: 'Needs a straightforward method to work out the final price after a reduction.',
      targetAudience: 'shoppers and sellers',
      relatedQuestions: ['What is the final price after a discount?', 'How much did I save?', 'What discount rate leads to a target sale price?'],
      relatedCalculators: ['percentage', 'tip'],
      supportingGuides: [],
    },
    tip: {
      calculatorId: 'tip',
      primaryIntent: 'calculate a recommended tip',
      secondaryIntents: ['split a bill', 'estimate total cost with gratuity', 'round a payment amount'],
      userProblem: 'Needs a simple way to calculate a fair gratuity and final bill total.',
      targetAudience: 'diners and service workers',
      relatedQuestions: ['How much should I tip?', 'What is the final cost after gratuity?', 'How do I split the bill?'],
      relatedCalculators: ['percentage', 'discount'],
      supportingGuides: [],
    },
    vat: {
      calculatorId: 'vat',
      primaryIntent: 'calculate VAT-inclusive or VAT-exclusive totals',
      secondaryIntents: ['estimate tax on purchases', 'compare tax-inclusive pricing', 'model consumer tax impact'],
      userProblem: 'Needs to see the effect of VAT on the total purchase price based on local tax rules.',
      targetAudience: 'shoppers and business operators',
      relatedQuestions: ['What is the VAT amount on this price?', 'How much is the total with tax?', 'What is the tax-exclusive base?'],
      relatedCalculators: ['percentage', 'tax'],
      supportingGuides: [],
    },
  };

  return profileMap[calculatorId] ?? {
    calculatorId,
    primaryIntent: calculator.searchIntent || 'solve a calculation problem',
    secondaryIntents: [],
    userProblem: calculator.introduction || 'Help a user calculate a useful result quickly and accurately.',
    targetAudience: calculator.targetAudience || 'general users',
    relatedQuestions: calculator.faqs?.map(({ question }) => question) ?? [],
    relatedCalculators: calculator.relatedCalculators,
    supportingGuides: calculator.relatedGuides,
  };
}

export function getSearchIntentMap(): Record<string, SearchIntentProfile> {
  return Object.fromEntries(
    (Object.keys(calculatorsData) as CalculatorId[]).map((calculatorId) => [calculatorId, getSearchIntentProfile(calculatorId)])
  );
}

export function getTopicCluster(category: string): TopicCluster {
  const allCalculators = Object.values(calculatorsData);
  const calculatorsByCategory = allCalculators.filter((calculator) => calculator.category === category);
  const clusterGuides = guidesData.filter((guide) => calculatorsByCategory.some((calculator) => calculator.relatedGuides.includes(guide.id)));

  const clusterMap: Record<string, TopicCluster> = {
    'Financial Mathematics': {
      category: 'Financial Mathematics',
      slug: 'financial-mathematics',
      primaryUserNeed: 'Help users estimate borrowing, repayment, and interest outcomes with clear assumptions.',
      calculators: ['mortgage', 'loan', 'interest', 'payment', 'tax', 'reverse-mortgage'],
      guides: ['understanding-amortization', 'marginal-vs-effective-tax-rates'],
    },
    'Personal Finance': {
      category: 'Personal Finance',
      slug: 'personal-finance',
      primaryUserNeed: 'Support practical planning decisions around borrowing, taxes, and cash flow.',
      calculators: ['mortgage', 'reverse-mortgage', 'tax', 'loan'],
      guides: ['understanding-amortization', 'marginal-vs-effective-tax-rates'],
    },
    'Planning / Everyday': {
      category: 'Planning / Everyday',
      slug: 'planning-everyday',
      primaryUserNeed: 'Help user value calculations across budgeting, planning, and day-to-day decisions.',
      calculators: ['discount', 'tip', 'percentage', 'vat'],
      guides: [],
    },
    'Basic Mathematics': {
      category: 'Basic Mathematics',
      slug: 'basic-mathematics',
      primaryUserNeed: 'Support educational and general-purpose calculation needs with fast, clear tools.',
      calculators: ['scientific', 'graphing', 'time', 'age', 'percentage'],
      guides: [],
    },
    'Practical Mathematics': {
      category: 'Practical Mathematics',
      slug: 'practical-mathematics',
      primaryUserNeed: 'Support real-world decision making with standardized math and financial calculations.',
      calculators: ['percentage', 'discount', 'tip', 'vat'],
      guides: [],
    },
  };

  return clusterMap[category] ?? {
    category,
    slug: category.toLowerCase().replace(/\s+/g, '-'),
    primaryUserNeed: 'Serve a coherent calculation use case with clear intent.',
    calculators: calculatorsByCategory.map((calculator) => calculator.id),
    guides: clusterGuides.map((guide) => guide.id),
  };
}

export function getGuideQualityProfile(guideId: string): GuideQualityProfile {
  const guide = guidesData.find((entry) => entry.id === guideId || entry.slug === guideId);

  if (!guide) {
    throw new Error(`Guide not found: ${guideId}`);
  }

  return {
    guideId: guide.id,
    title: guide.title,
    purpose: guide.purpose || 'Explain a calculator-related question in practical terms.',
    introduction: guide.introduction || guide.excerpt,
    sections: guide.sections || ['Overview', 'How it works', 'Examples'],
    examples: guide.examples || [guide.excerpt],
    methodology: guide.methodology || ['Use clear assumptions and explain the formula context.'],
    calculatorCta: guide.calculatorCta || 'Use the relevant calculator to apply this concept to your own numbers.',
    relatedCalculators: guide.relatedCalculators || [],
    relatedGuides: guide.relatedGuides || [],
    lastReviewed: guide.lastReviewed || guide.publishedDate,
  };
}
