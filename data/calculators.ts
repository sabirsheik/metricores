import { CalculatorSchema, CalculatorId, ResultField } from '@/types';
import { calculateAge, getDateYearsAgoString, getTodayDateString } from '@/utils/age';
import { calculateReverseMortgage } from '@/utils/reverseMortgage';

export const calculatorsData: Record<CalculatorId, CalculatorSchema> = {
  scientific: {
    id: 'scientific',
    name: 'Scientific Calculator',
    shortDescription: 'Compute high-precision mathematics with advanced trigonometric, logarithmic, and custom memory operations.',
    category: 'Basic Mathematics',
    lastUpdated: 'July 2026',
    inputs: [],
    formula: {
      equation: 'y = f(x)',
      description: 'Supports advanced high-precision standard mathematical functions with Degree/Radian toggle.',
      steps: [
        'Select DEG or RAD calculation mode.',
        'Enter numbers and scientific operands.',
        'Use parentheses for nested operation prioritization.',
        'Press enter or the equals sign to output evaluated results.'
      ]
    },
    example: {
      scenario: 'Evaluating trigonometric sine under degree mode',
      explanation: 'Input sin(30) to compute 0.5 instantly.'
    },
    faqs: [
      {
        question: 'How do I toggle Degree and Radian modes?',
        answer: 'Use the DEG and RAD status buttons in the top-left section of the calculator screen to instantly switch angular modes.'
      },
      {
        question: 'Does this support physical keyboard input?',
        answer: 'Yes! You can type numbers, standard math operators, Backspace to delete, Esc to clear, and Enter to compute.'
      }
    ]
  },
  graphing: {
    id: 'graphing',
    name: 'Graphing Calculator',
    shortDescription: 'Plot mathematical equations in real time, customize grid steps, and explore trigonometric functions.',
    category: 'Basic Mathematics',
    lastUpdated: 'July 2026',
    inputs: [],
    formula: {
      equation: 'y = f(x)',
      description: 'The standard Cartesian coordinate mapping of an independent variable x to dependent values y.',
      steps: [
        'Enter a function f(x) using supported operations.',
        'The graphing engine evaluates f(x) for each pixel column across the viewport.',
        'Cartesian coordinates are scaled and rendered on the high-definition canvas.'
      ]
    },
    example: {
      scenario: 'Plotting a quadratic parabola',
      explanation: 'Input x^2 - 4 to observe the roots crossing the x-axis at -2 and 2.'
    },
    faqs: [
      {
        question: 'Which functions are supported?',
        answer: 'The calculator supports sin(x), cos(x), tan(x), log(x), ln(x), sqrt(x), abs(x), exp(x), and standard operations (+, -, *, /, ^).'
      },
      {
        question: 'How do I pan and zoom?',
        answer: 'You can pan the coordinate plane by clicking and dragging on desktop or dragging on touch screens. Zoom in and out using your mouse scroll wheel or using the zoom buttons in the toolbar.'
      }
    ]
  },
  mortgage: {
    id: 'mortgage',
    name: 'Mortgage Calculator',
    shortDescription: 'Calculate your monthly mortgage payment, interest rates, and total amortization schedule.',
    category: 'Financial Mathematics',
    lastUpdated: 'July 2026',
    inputs: [
      {
        id: 'homePrice',
        label: 'Home Price',
        type: 'number',
        defaultValue: 400000,
        min: 0,
        prefix: '$',
        placeholder: 'e.g., 400,000',
        tooltip: 'The purchase price of the property.'
      },
      {
        id: 'downPayment',
        label: 'Down Payment',
        type: 'number',
        defaultValue: 80000,
        min: 0,
        prefix: '$',
        placeholder: 'e.g., 80,000',
        tooltip: 'The cash amount you pay upfront.'
      },
      {
        id: 'interestRate',
        label: 'Interest Rate (Annual)',
        type: 'number',
        defaultValue: 6.5,
        min: 0,
        max: 30,
        step: 0.01,
        suffix: '%',
        placeholder: 'e.g., 6.50',
        tooltip: 'The annual interest rate for your mortgage loan.'
      },
      {
        id: 'loanTerm',
        label: 'Loan Term',
        type: 'select',
        defaultValue: '30',
        options: [
          { label: '30 Years Fixed', value: '30' },
          { label: '20 Years Fixed', value: '20' },
          { label: '15 Years Fixed', value: '15' },
          { label: '10 Years Fixed', value: '10' }
        ],
        tooltip: 'The length of time you have to pay back the mortgage loan.'
      }
    ],
    formula: {
      equation: 'M = P * [ r(1 + r)^n ] / [ (1 + r)^n - 1 ]',
      description: 'Used to calculate fixed-rate monthly mortgage amortizations.',
      steps: [
        'Determine the principal loan amount (P) by subtracting the down payment from the home price.',
        'Convert the annual interest rate to a monthly rate (r) by dividing by 12 and then by 100.',
        'Calculate the total number of monthly payments (n) by multiplying the loan term in years by 12.',
        'Apply the annuity formula to find the monthly fixed payment (M).',
        'Multiply the monthly payment by the total number of months to calculate the total cost of the mortgage.'
      ]
    },
    example: {
      scenario: 'Purchasing a home valued at $400,000 with a 20% ($80,000) down payment, under a 30-year fixed term at a 6.5% interest rate.',
      explanation: 'The principal loan amount is $320,000. Under these terms, the monthly principal and interest payment is $2,022.62. Over the course of 30 years, you will make $728,143.20 in total payments, of which $408,143.20 is interest paid to the lender.'
    },
    faqs: [
      {
        question: 'What is a standard down payment on a home?',
        answer: 'While 20% is traditionally recommended to avoid paying Private Mortgage Insurance (PMI), many buyers pay as little as 3% to 5% upfront depending on loan type (FHA, conventional).'
      },
      {
        question: 'How can I lower my monthly mortgage payment?',
        answer: 'You can lower your payment by making a larger down payment, securing a lower annual interest rate, or extending the loan term (e.g., opting for 30 years instead of 15).'
      },
      {
        question: 'What does a mortgage payment typically include?',
        answer: 'A standard mortgage payment consists of Principal and Interest (P&I). Depending on your setup, it might also bundle property taxes, homeowners insurance, and HOA fees into an escrow account.'
      }
    ]
  },
  'reverse-mortgage': {
    id: 'reverse-mortgage',
    name: 'Reverse Mortgage Calculator',
    shortDescription: 'See how much cash you may receive and how your home equity could change over time.',
    category: 'Personal Finance',
    keywords: ['reverse mortgage calculator', 'reverse mortgage estimate', 'reverse mortgage proceeds', 'home equity', 'reverse mortgage balance', 'reverse mortgage interest', 'remaining home equity'],
    lastUpdated: 'September 2026',
    inputs: [
      {
        id: 'homeValue',
        label: 'Estimated Home Value',
        type: 'number',
        defaultValue: 500000,
        min: 1,
        prefix: '$',
        placeholder: 'e.g., 500,000',
        tooltip: 'A reasonable estimate of what your home could sell for today.'
      },
      {
        id: 'mortgageBalance',
        label: 'Mortgage Balance to Pay Off',
        type: 'number',
        defaultValue: 75000,
        min: 0,
        prefix: '$',
        placeholder: 'e.g., 75,000',
        tooltip: 'What you still owe on your current mortgage or other home lien.'
      },
      {
        id: 'borrowerAge',
        label: 'Youngest Homeowner Age',
        type: 'number',
        defaultValue: 68,
        min: 62,
        max: 100,
        step: 1,
        suffix: ' years',
        placeholder: 'e.g., 68',
        tooltip: 'For a couple, enter the age of the younger homeowner. Many US reverse mortgage programs start at age 62.'
      },
      {
        id: 'interestRate',
        label: 'Estimated Interest Rate',
        type: 'number',
        defaultValue: 6.5,
        min: 0,
        max: 20,
        step: 0.01,
        suffix: '%',
        placeholder: 'e.g., 6.50',
        tooltip: 'An estimated annual rate used to show how the loan balance could grow. Your lender may quote a different rate.'
      },
      {
        id: 'loanTerm',
        label: 'Years to Project',
        type: 'number',
        defaultValue: 15,
        min: 1,
        max: 30,
        step: 1,
        suffix: ' years',
        placeholder: 'e.g., 15',
        tooltip: 'How many years you want to see in the balance and equity estimate.'
      },
      {
        id: 'closingCosts',
        label: 'Estimated Upfront Costs',
        type: 'number',
        defaultValue: 10000,
        min: 0,
        prefix: '$',
        placeholder: 'e.g., 10,000',
        tooltip: 'Estimated fees and costs at closing. Actual costs vary by lender, loan program, and location.'
      },
      {
        id: 'initialAdvance',
        label: 'Cash You Want at Closing',
        type: 'number',
        defaultValue: 50000,
        min: 0,
        prefix: '$',
        placeholder: 'e.g., 50,000',
        tooltip: 'The amount you would like to receive upfront. The estimate may reduce this if the available amount is lower.'
      }
    ],
    formula: {
      equation: 'Estimated borrowing amount = Home value x age and rate factors',
      description: 'This educational estimate accounts for your home value, age, estimated rate, current mortgage, and upfront costs, then shows how the balance could grow over time.',
      steps: [
        'Estimate your home equity by subtracting your current mortgage from your home value.',
        'Estimate a borrowing amount using the youngest homeowner age and interest-rate assumption.',
        'Set aside the current mortgage payoff and estimated upfront costs.',
        'Project the loan balance and remaining home equity year by year.'
      ]
    },
    example: {
      scenario: 'Example only - not a lending offer or financial advice. A 68-year-old homeowner has a $500,000 home, a $75,000 mortgage, a 6.5% planning rate, $10,000 in estimated costs, and requests a $50,000 initial advance over 15 years.',
      explanation: 'The model estimates available equity, an illustrative borrowing capacity, net initial proceeds, projected interest, and remaining equity. Actual lender-approved results depend on the product, property, insurance, fees, and underwriting.'
    },
    faqs: [
      {
        question: 'What is a reverse mortgage?',
        answer: 'A reverse mortgage is a loan secured by home equity that can provide eligible homeowners with proceeds while they remain responsible for property charges and loan obligations.'
      },
      {
        question: 'How much can I borrow with a reverse mortgage?',
        answer: 'The amount depends on age, home value, existing liens, interest rate, loan program, property requirements, and lender limits. This calculator provides an illustrative estimate only.'
      },
      {
        question: 'Does a reverse mortgage affect home ownership?',
        answer: 'The borrower generally remains the owner, but the loan is secured by the property and must be repaid when the loan becomes due under its terms.'
      },
      {
        question: 'How does interest affect the balance?',
        answer: 'When interest is not paid from another source, it can be added to the outstanding balance over time, reducing remaining equity.'
      },
      {
        question: 'What happens to an existing mortgage?',
        answer: 'An existing mortgage or lien commonly needs to be paid or otherwise addressed at closing. This estimate subtracts the entered balance from available proceeds.'
      },
      {
        question: 'Does a reverse mortgage reduce home equity?',
        answer: 'It can. The balance, interest, and applicable costs may grow over time, which can reduce the equity available to the homeowner or estate.'
      },
      {
        question: 'Are these reverse mortgage calculations exact?',
        answer: 'No. The model is educational and deterministic, but actual products use program-specific principal-limit tables, fees, insurance, taxes, underwriting, and legal requirements.'
      },
      {
        question: 'Is this calculator financial advice?',
        answer: 'No. It is an informational planning tool, not a lender quote, approval, offer, or substitute for advice from a qualified housing or financial professional.'
      }
    ]
  },
  loan: {
    id: 'loan',
    name: 'Loan Calculator',
    shortDescription: 'Compute payments and total interest for personal, auto, or student loans.',
    category: 'Financial Mathematics',
    lastUpdated: 'June 2026',
    inputs: [
      {
        id: 'loanAmount',
        label: 'Loan Amount',
        type: 'number',
        defaultValue: 25000,
        min: 0,
        prefix: '$',
        placeholder: 'e.g., 25,000',
        tooltip: 'The total amount of money borrowed.'
      },
      {
        id: 'interestRate',
        label: 'Interest Rate (Annual)',
        type: 'number',
        defaultValue: 7.2,
        min: 0,
        max: 50,
        step: 0.01,
        suffix: '%',
        placeholder: 'e.g., 7.20',
        tooltip: 'The annual interest rate of the loan.'
      },
      {
        id: 'loanTerm',
        label: 'Loan Term (Months)',
        type: 'number',
        defaultValue: 60,
        min: 1,
        max: 360,
        step: 1,
        suffix: 'mo',
        placeholder: 'e.g., 60',
        tooltip: 'The duration of the loan in months.'
      }
    ],
    formula: {
      equation: 'M = P * [ r(1 + r)^n ] / [ (1 + r)^n - 1 ]',
      description: 'Used to calculate installment payments on simple interest personal or auto loans.',
      steps: [
        'P represents the loan amount (Principal).',
        'r is the monthly interest rate, calculated as Annual Rate / 12 / 100.',
        'n is the total number of monthly payments.',
        'Apply the amortized repayment equation to determine the monthly installment.',
        'Subtract the initial loan amount from the sum of all monthly payments to find the total interest paid.'
      ]
    },
    example: {
      scenario: 'Taking out a $25,000 auto loan for 60 months (5 years) at an annual interest rate of 7.2%.',
      explanation: 'The monthly payment will be $497.35. At the end of 5 years, you will have paid $29,841.00 in total, with $4,841.00 representing the total interest paid on the loan.'
    },
    faqs: [
      {
        question: 'What is the difference between an auto loan and a personal loan?',
        answer: 'An auto loan is secured by the vehicle you buy, meaning the lender can repossess it if you default. Personal loans are usually unsecured, meaning they do not require collateral but often carry higher interest rates.'
      },
      {
        question: 'Does paying off a loan early save money?',
        answer: 'Yes, if your loan does not have a prepayment penalty. Paying off the principal early reduces the base on which interest is compounded, saving you money.'
      }
    ]
  },
  tax: {
    id: 'tax',
    name: 'Tax Calculator',
    shortDescription: 'Estimate your annual federal income tax liabilities and effective tax bracket.',
    category: 'Practical Mathematics',
    lastUpdated: 'May 2026',
    inputs: [
      {
        id: 'annualIncome',
        label: 'Annual Income',
        type: 'number',
        defaultValue: 85000,
        min: 0,
        prefix: '$',
        placeholder: 'e.g., 85,000',
        tooltip: 'Your gross annual earnings before tax.'
      },
      {
        id: 'filingStatus',
        label: 'Filing Status',
        type: 'select',
        defaultValue: 'single',
        options: [
          { label: 'Single', value: 'single' },
          { label: 'Married Filing Jointly', value: 'married' }
        ],
        tooltip: 'Your legal tax filing status.'
      },
      {
        id: 'deductions',
        label: 'Deductions (Standard or Itemized)',
        type: 'number',
        defaultValue: 15000,
        min: 0,
        prefix: '$',
        placeholder: 'e.g., 15,000',
        tooltip: 'The standard or itemized deduction amount to subtract from income.'
      }
    ],
    formula: {
      equation: 'Taxable Income = Gross Income - Deductions',
      description: 'Progressive marginal tax brackets are applied to taxable income slices.',
      steps: [
        'Calculate Taxable Income by subtracting your standard or itemized deductions from your gross annual income.',
        'Segment the taxable income into progressive bracket slices.',
        'Multiply the portion of income in each bracket by that bracket’s percentage rate.',
        'Sum the tax due from all applicable brackets to obtain the Total Tax Liability.',
        'Divide the Total Tax by your Gross Income to find your Effective Tax Rate.'
      ]
    },
    example: {
      scenario: 'A single filer earning $85,000 with a standard deduction of $15,000.',
      explanation: 'Taxable income is $70,000 ($85,000 - $15,000). Applying progressive tax tiers, the first $11,600 is taxed at 10%, the amount up to $47,150 is taxed at 12%, and the remaining amount up to $70,000 is taxed at 22%. Total tax due is $10,453.00, resulting in an effective tax rate of 12.30%.'
    },
    faqs: [
      {
        question: 'What is the difference between marginal and effective tax rates?',
        answer: 'Your marginal rate is the tax rate applied to your last dollar of income (the highest bracket you reach). Your effective rate is the average rate you actually paid, computed as total tax divided by total income.'
      },
      {
        question: 'Should I take the standard deduction or itemize?',
        answer: 'You should itemize only if your total itemizable expenses (like mortgage interest, charitable donations, medical expenses) exceed the standard deduction set for your filing status.'
      }
    ]
  },
  interest: {
    id: 'interest',
    name: 'Interest Calculator',
    shortDescription: 'Calculate simple or compound interest growth with regular monthly contributions.',
    category: 'Financial Mathematics',
    lastUpdated: 'July 2026',
    inputs: [
      {
        id: 'principal',
        label: 'Initial Principal',
        type: 'number',
        defaultValue: 10000,
        min: 0,
        prefix: '$',
        placeholder: 'e.g., 10,000',
        tooltip: 'The starting balance of your investment.'
      },
      {
        id: 'monthlyContribution',
        label: 'Monthly Contribution',
        type: 'number',
        defaultValue: 250,
        min: 0,
        prefix: '$',
        placeholder: 'e.g., 250',
        tooltip: 'The amount added to the investment each month.'
      },
      {
        id: 'interestRate',
        label: 'Annual Interest Rate',
        type: 'number',
        defaultValue: 8,
        min: 0,
        max: 100,
        step: 0.1,
        suffix: '%',
        placeholder: 'e.g., 8.0',
        tooltip: 'The expected yearly rate of return.'
      },
      {
        id: 'term',
        label: 'Duration (Years)',
        type: 'number',
        defaultValue: 10,
        min: 1,
        max: 50,
        step: 1,
        suffix: 'yrs',
        placeholder: 'e.g., 10',
        tooltip: 'The period of time the investment will grow.'
      },
      {
        id: 'interestType',
        label: 'Interest Type',
        type: 'select',
        defaultValue: 'compound',
        options: [
          { label: 'Compound Interest', value: 'compound' },
          { label: 'Simple Interest', value: 'simple' }
        ],
        tooltip: 'Whether interest compounds over time or is calculated solely on the principal.'
      }
    ],
    formula: {
      equation: 'A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)] * (1 + r/n)',
      description: 'Applies compound interest growth with periodic deposits.',
      steps: [
        'Determine the growth of the initial principal (P) based on the interest rate (r) and compounding cycles (n).',
        'Add the cumulative compounding value of monthly contributions (PMT) made during the duration (t).',
        'Subtract the sum of the principal and all manual contributions from the final future value to get the total interest earned.'
      ]
    },
    example: {
      scenario: 'Starting with $10,000, contributing $250 monthly for 10 years at an 8% compounding rate.',
      explanation: 'Your total manual contributions will be $30,000. Over 10 years, your investment will grow to $66,134.46, representing $26,134.46 in pure compounded interest earned.'
    },
    faqs: [
      {
        question: 'What does compounding mean?',
        answer: 'Compounding is the process where your investment earns interest, and then that earned interest earns interest of its own, creating exponential growth over time.'
      },
      {
        question: 'What is simple interest?',
        answer: 'Simple interest is calculated strictly on the initial principal amount only. It does not take previously earned interest into account.'
      }
    ]
  },
  payment: {
    id: 'payment',
    name: 'Payment Calculator',
    shortDescription: 'Calculate required monthly payments or payoff timelines for debts and credit cards.',
    category: 'Financial Mathematics',
    lastUpdated: 'April 2026',
    inputs: [
      {
        id: 'calcOption',
        label: 'Calculate Target',
        type: 'select',
        defaultValue: 'payment',
        options: [
          { label: 'Find Monthly Payment (Given Months)', value: 'payment' },
          { label: 'Find Months to Payoff (Given Monthly Payment)', value: 'term' }
        ],
        tooltip: 'Choose what you want to calculate.'
      },
      {
        id: 'balance',
        label: 'Current Balance',
        type: 'number',
        defaultValue: 5000,
        min: 0,
        prefix: '$',
        placeholder: 'e.g., 5,000',
        tooltip: 'The outstanding balance of your debt or credit card.'
      },
      {
        id: 'interestRate',
        label: 'Annual Interest Rate (APR)',
        type: 'number',
        defaultValue: 18.9,
        min: 0,
        max: 100,
        step: 0.1,
        suffix: '%',
        placeholder: 'e.g., 18.90',
        tooltip: 'The annual percentage interest rate of the credit card or debt.'
      },
      {
        id: 'monthlyPayment',
        label: 'Fixed Monthly Payment',
        type: 'number',
        defaultValue: 250,
        min: 1,
        prefix: '$',
        placeholder: 'e.g., 250',
        tooltip: 'The amount you intend to pay monthly (only used when finding payoff months).'
      },
      {
        id: 'targetMonths',
        label: 'Target Payoff Term (Months)',
        type: 'number',
        defaultValue: 24,
        min: 1,
        max: 120,
        step: 1,
        suffix: 'mo',
        placeholder: 'e.g., 24',
        tooltip: 'The number of months you want to pay off the debt in (only used when finding monthly payment).'
      }
    ],
    formula: {
      equation: 'n = -ln(1 - (P * r) / M) / ln(1 + r)',
      description: 'Determines the number of payment periods (n) required to pay off a balance (P) with payment (M) at rate (r).',
      steps: [
        'Identify current outstanding balance and annual APR converted to monthly rate (r).',
        'If calculating payment: apply standard amortization formula based on target months.',
        'If calculating term: apply logarithmic time-to-repayment formula using the fixed payment size.',
        'Verify that the monthly payment exceeds the interest generated each month; otherwise, the debt will never be paid off.'
      ]
    },
    example: {
      scenario: 'A $5,000 credit card balance with an 18.9% APR, paying $250 monthly.',
      explanation: 'It will take 25 months (2.1 years) to pay off the balance. You will make $6,183.17 in total payments, of which $1,183.17 is interest.'
    },
    faqs: [
      {
        question: 'What is APR?',
        answer: 'APR stands for Annual Percentage Rate. It is the annual rate of interest charged on your borrowed balance, compounded monthly.'
      },
      {
        question: 'What happens if my monthly payment is smaller than interest accrued?',
        answer: 'This leads to negative amortization. Your balance will grow instead of shrink, and you will never pay off the debt.'
      }
    ]
  },
  time: {
    id: 'time',
    name: 'Time Calculator',
    shortDescription: 'Calculate total business days between dates or add calendar days to a start date.',
    category: 'Practical Mathematics',
    lastUpdated: 'June 2026',
    inputs: [
      {
        id: 'mode',
        label: 'Calculation Mode',
        type: 'select',
        defaultValue: 'difference',
        options: [
          { label: 'Find Days Between Two Dates', value: 'difference' },
          { label: 'Add/Subtract Days to Date', value: 'add' }
        ],
        tooltip: 'Choose whether to find differences or project future/past timelines.'
      },
      {
        id: 'startDate',
        label: 'Start Date',
        type: 'date',
        defaultValue: '2026-07-06',
        tooltip: 'The initial date of the timeline.'
      },
      {
        id: 'endDate',
        label: 'End Date',
        type: 'date',
        defaultValue: '2026-12-31',
        tooltip: 'The terminal date (only used in date differences).'
      },
      {
        id: 'addSubtractDays',
        label: 'Days to Add/Subtract',
        type: 'number',
        defaultValue: 45,
        step: 1,
        suffix: 'days',
        placeholder: 'e.g., 45',
        tooltip: 'The number of days to add (positive) or subtract (negative) to the start date.'
      },
      {
        id: 'excludeWeekends',
        label: 'Exclude Weekends (Saturday & Sunday)',
        type: 'boolean',
        defaultValue: true,
        tooltip: 'If checked, Saturdays and Sundays are ignored.'
      }
    ],
    formula: {
      equation: 'Duration = End Date - Start Date',
      description: 'Calculates chronological intervals or offsets business days.',
      steps: [
        'Select the calculation mode (Duration vs. Offset).',
        'Identify start and end dates.',
        'Iterate chronologically, checking the day-of-week for each calendar day.',
        'If "Exclude Weekends" is checked, filter out Saturdays (6) and Sundays (0).',
        'Present final calculated business days and calendar days.'
      ]
    },
    example: {
      scenario: 'Calculating working days between July 6, 2026 and December 31, 2026, excluding weekends.',
      explanation: 'There are exactly 178 calendar days in this period. Excluding Saturdays and Sundays leaves exactly 128 business days of productive operational time.'
    },
    faqs: [
      {
        question: 'What is counted as a business day?',
        answer: 'A standard business day represents Monday through Friday. It excludes Saturdays and Sundays.'
      },
      {
        question: 'Does this calculator include public holidays?',
        answer: 'No, public holidays vary heavily by region and industry. This calculator strictly filters weekends unless configured otherwise.'
      }
    ]
  },
  age: {
    id: 'age',
    name: 'Age Calculator',
    shortDescription: 'Calculate exact age in years, months, and days from a date of birth.',
    category: 'Planning / Everyday',
    keywords: ['age calculator', 'exact age calculator', 'calculate age', 'date of birth calculator', 'age in years months and days'],
    lastUpdated: 'September 2026',
    inputs: [
      {
        id: 'dateOfBirth',
        label: 'Date of Birth',
        type: 'date',
        defaultValue: () => getDateYearsAgoString(30),
        maxDate: () => getTodayDateString(),
        tooltip: 'Enter the person\'s date of birth. Future birth dates are not accepted.'
      },
      {
        id: 'calculationDate',
        label: 'Calculate As Of',
        type: 'date',
        defaultValue: () => getTodayDateString(),
        tooltip: 'Choose today or another date for a historical or future age calculation.'
      }
    ],
    formula: {
      equation: 'Exact age = calendar difference between Date of Birth and Calculation Date',
      description: 'Age is calculated using calendar years, months, and days rather than a fixed number of days per year.',
      steps: [
        'Validate both dates as real calendar dates and confirm the calculation date is not before the date of birth.',
        'Count completed calendar years, treating February 29 birthdays as February 28 in non-leap years.',
        'Calculate the remaining months and days using the actual length of each calendar month.',
        'Calculate supporting totals such as elapsed days, weeks, next birthday, and days remaining.'
      ]
    },
    example: {
      scenario: 'A person born on January 15, 1995, calculated as of September 14, 2026.',
      explanation: 'The calculator returns the exact calendar age as 31 Years, 7 Months, 30 Days, together with total elapsed time and the next birthday.'
    },
    faqs: [
      {
        question: 'Does the calculator account for leap years?',
        answer: 'Yes. It uses the actual calendar length of every month and recognizes February 29 in leap years.'
      },
      {
        question: 'How are February 29 birthdays handled?',
        answer: 'In non-leap years, February 28 is used as the birthday anniversary so the completed age remains calendar-consistent.'
      },
      {
        question: 'Can I calculate age on a past or future date?',
        answer: 'Yes. Select any calculation date on or after the date of birth to review historical or projected age.'
      }
    ]
  },
  'profit-margin': {
    id: 'profit-margin',
    name: 'Profit Margin Calculator',
    shortDescription: 'Find your selling price, gross profit margins, and markup metrics.',
    category: 'Financial Mathematics',
    lastUpdated: 'July 2026',
    inputs: [
      {
        id: 'calcMode',
        label: 'What to Calculate',
        type: 'select',
        defaultValue: 'margin',
        options: [
          { label: 'Calculate Margin from Price', value: 'margin' },
          { label: 'Calculate Price from Target Margin', value: 'price' }
        ],
        tooltip: 'Choose to calculate margin percentages or determine a target retail price.'
      },
      {
        id: 'cost',
        label: 'Cost of Good (COGS)',
        type: 'number',
        defaultValue: 60,
        min: 0,
        prefix: '$',
        placeholder: 'e.g., 60',
        tooltip: 'The total cost to manufacture or acquire the product.'
      },
      {
        id: 'sellingPrice',
        label: 'Selling Price (Retail)',
        type: 'number',
        defaultValue: 100,
        min: 0,
        prefix: '$',
        placeholder: 'e.g., 100',
        tooltip: 'The price the item is sold for (only used when calculating margin).'
      },
      {
        id: 'targetMargin',
        label: 'Target Gross Margin',
        type: 'number',
        defaultValue: 40,
        min: 0,
        max: 99.9,
        suffix: '%',
        placeholder: 'e.g., 40',
        tooltip: 'Your desired gross profit percentage (only used when calculating price).'
      }
    ],
    formula: {
      equation: 'Gross Margin = (Selling Price - Cost) / Selling Price * 100',
      description: 'Differentiates Gross Margin (based on retail price) from Markup (based on product cost).',
      steps: [
        'Gross Profit is Selling Price minus Cost of Goods Sold (COGS).',
        'Gross Margin represents Gross Profit divided by Selling Price.',
        'Markup represents Gross Profit divided by Cost of Goods Sold.',
        'To find Selling Price given Cost and Target Margin: Cost / (1 - Margin/100).'
      ]
    },
    example: {
      scenario: 'A product costs $60 to manufacture, and is sold for $100.',
      explanation: 'The Gross Profit is $40. The Gross Margin is 40% ($40 profit / $100 price). The Markup is 66.67% ($40 profit / $60 cost).'
    },
    faqs: [
      {
        question: 'What is the difference between margin and markup?',
        answer: 'Gross margin is profit relative to the selling price, while markup is profit relative to the cost of acquisition.'
      },
      {
        question: 'Why is gross profit margin critical for businesses?',
        answer: 'Gross profit margin represents how much money remains to cover operating expenses, taxes, and net profit after direct production costs are paid.'
      }
    ]
  },
  roi: {
    id: 'roi',
    name: 'ROI Calculator',
    shortDescription: 'Measure the return on investment percentage and annualized ROI of projects.',
    category: 'Financial Mathematics',
    lastUpdated: 'July 2026',
    inputs: [
      {
        id: 'amountInvested',
        label: 'Initial Capital Invested',
        type: 'number',
        defaultValue: 50000,
        min: 0,
        prefix: '$',
        placeholder: 'e.g., 50,000',
        tooltip: 'The initial cash investment.'
      },
      {
        id: 'amountReturned',
        label: 'Final Amount Returned',
        type: 'number',
        defaultValue: 75000,
        min: 0,
        prefix: '$',
        placeholder: 'e.g., 75,000',
        tooltip: 'The total value returned after the investment period.'
      },
      {
        id: 'termYears',
        label: 'Investment Term (Years)',
        type: 'number',
        defaultValue: 3,
        min: 0.1,
        max: 50,
        step: 0.1,
        suffix: 'yrs',
        placeholder: 'e.g., 3',
        tooltip: 'The total holding duration of the investment in years.'
      }
    ],
    formula: {
      equation: 'Total ROI = (Returned - Invested) / Invested * 100',
      description: 'Computes total return and projects compounded annual growth rates (CAGR).',
      steps: [
        'Subtract the initial capital invested from the final value returned to obtain Total Investment Profit.',
        'Divide Profit by the Initial Investment to find the Total Return on Investment percentage.',
        'Calculate the Annualized ROI: (Amount Returned / Amount Invested)^(1 / Term) - 1.'
      ]
    },
    example: {
      scenario: 'Investing $50,000 in a business expansion, yielding $75,000 after 3 years.',
      explanation: 'Your profit is $25,000. This represents a total ROI of 50.00%. The compounding annualized ROI is 14.47% per year.'
    },
    faqs: [
      {
        question: 'What is a good ROI?',
        answer: 'A good ROI depends heavily on risk profile and industry benchmarks. Broad stock market indexes traditionally return 7% to 10% annually.'
      },
      {
        question: 'What does Annualized ROI represent?',
        answer: 'Annualized ROI represents the geometric average rate of return earned each year, allowing direct comparison with other investments over different periods.'
      }
    ]
  },
  percentage: {
    id: 'percentage',
    name: 'Percentage Calculator',
    shortDescription: 'Solve percentage equations, proportion rates, and percentage increase or decrease.',
    category: 'Basic Mathematics',
    lastUpdated: 'July 2026',
    inputs: [
      {
        id: 'mode',
        label: 'Calculation Type',
        type: 'select',
        defaultValue: 'of_value',
        options: [
          { label: 'What is X% of Y?', value: 'of_value' },
          { label: 'X is what percentage of Y?', value: 'proportion' },
          { label: 'Percentage change from X to Y', value: 'change' }
        ],
        tooltip: 'Select the percentage formula to evaluate.'
      },
      {
        id: 'valueX',
        label: 'Value X',
        type: 'number',
        defaultValue: 20,
        placeholder: 'e.g., 20',
        tooltip: 'The first value or percentage rate.'
      },
      {
        id: 'valueY',
        label: 'Value Y',
        type: 'number',
        defaultValue: 150,
        placeholder: 'e.g., 150',
        tooltip: 'The base or ending value.'
      }
    ],
    formula: {
      equation: 'Percentage Formulae',
      description: 'Calculates basic percentage ratios, proportions, or rates of change.',
      steps: [
        'For X% of Y: Result = (X / 100) * Y',
        'For X is what percentage of Y: Result = (X / Y) * 100',
        'For Percentage change from X to Y: Result = ((Y - X) / X) * 100'
      ]
    },
    example: {
      scenario: 'Finding what percentage 30 is of 150, or calculating a salary raise from $50k to $58k.',
      explanation: '30 is 20% of 150 because (30 / 150) * 100 = 20%. Moving from $50,000 to $58,000 represents a 16% increase because ((58000 - 50000) / 50000) * 100 = 16%.'
    },
    faqs: [
      {
        question: 'What is a percentage?',
        answer: 'A percentage is a number or ratio expressed as a fraction of 100. It is denoted using the percent sign (%).'
      },
      {
        question: 'How do you calculate a percentage increase?',
        answer: 'Subtract the original value from the new value, divide the difference by the original value, and multiply by 100.'
      }
    ]
  },
  discount: {
    id: 'discount',
    name: 'Discount & Sale Calculator',
    shortDescription: 'Calculate the promotional sale savings, net purchase price, and tax additions.',
    category: 'Basic Mathematics',
    lastUpdated: 'July 2026',
    inputs: [
      {
        id: 'originalPrice',
        label: 'Original Price',
        type: 'number',
        defaultValue: 120,
        min: 0,
        prefix: '$',
        placeholder: 'e.g., 120',
        tooltip: 'The catalog price of the product before discount.'
      },
      {
        id: 'discountRate',
        label: 'Discount Rate',
        type: 'number',
        defaultValue: 25,
        min: 0,
        max: 100,
        suffix: '%',
        placeholder: 'e.g., 25',
        tooltip: 'The markdown percentage of the sale.'
      },
      {
        id: 'taxRate',
        label: 'Sales Tax Rate',
        type: 'number',
        defaultValue: 8.25,
        min: 0,
        max: 50,
        suffix: '%',
        placeholder: 'e.g., 8.25',
        tooltip: 'The local sales tax rate to apply after markdown.'
      }
    ],
    formula: {
      equation: 'Net Price = [ Original Price * (1 - Discount/100) ] * (1 + Tax/100)',
      description: 'Finds product savings and computes sales tax additions.',
      steps: [
        'Calculate the savings amount: Savings = Original Price * (Discount Rate / 100).',
        'Determine the discounted sale price: Sale Price = Original Price - Savings.',
        'Calculate sales tax on the discounted price: Tax = Sale Price * (Tax Rate / 100).',
        'Add tax to the sale price to find the Final Price.'
      ]
    },
    example: {
      scenario: 'Buying a jacket priced at $120 marked 25% off with an 8.25% sales tax rate.',
      explanation: 'The 25% discount saves you $30.00, reducing the price to $90.00. Adding 8.25% tax ($7.43) yields a final net checkout price of $97.43.'
    },
    faqs: [
      {
        question: 'Is tax calculated before or after the discount is applied?',
        answer: 'In almost all jurisdictions, sales tax is computed on the actual discounted checkout price, not the original price.'
      },
      {
        question: 'How do double discounts work?',
        answer: 'If you have consecutive discounts (e.g., 20% off, plus an extra 10% coupon), they compound sequentially. A $100 item becomes $80, and then 10% off of $80 is $8, making the price $72 (a total 28% discount, not 30%).'
      }
    ]
  },
  tip: {
    id: 'tip',
    name: 'Tip & Split Calculator',
    shortDescription: 'Calculate standard gratuity amounts and split the total bill evenly among dinner guests.',
    category: 'Basic Mathematics',
    lastUpdated: 'July 2026',
    inputs: [
      {
        id: 'billAmount',
        label: 'Bill Amount',
        type: 'number',
        defaultValue: 85,
        min: 0,
        prefix: '$',
        placeholder: 'e.g., 85',
        tooltip: 'The subtotal amount of the bill.'
      },
      {
        id: 'tipPercentage',
        label: 'Tip Percentage',
        type: 'number',
        defaultValue: 18,
        min: 0,
        max: 100,
        suffix: '%',
        placeholder: 'e.g., 18',
        tooltip: 'The percentage of the subtotal to award as a gratuity.'
      },
      {
        id: 'numPeople',
        label: 'Split (Number of People)',
        type: 'number',
        defaultValue: 4,
        min: 1,
        max: 100,
        step: 1,
        suffix: 'people',
        placeholder: 'e.g., 4',
        tooltip: 'The number of guests splitting the tab.'
      }
    ],
    formula: {
      equation: 'Share = [ Bill * (1 + Tip/100) ] / Guests',
      description: 'Calculates total service tip and divides bills proportionally.',
      steps: [
        'Calculate total tip: Tip Amount = Bill Amount * (Tip Percentage / 100).',
        'Add the tip to the bill: Total Bill = Bill Amount + Tip Amount.',
        'Divide the total bill by the number of people to find the individual payment share.'
      ]
    },
    example: {
      scenario: 'A $85.00 restaurant subtotal split among 4 guests with an 18% tip.',
      explanation: 'The 18% tip adds $15.30, bringing the grand total to $100.30. Divided evenly among 4 people, each guest owes exactly $25.08.'
    },
    faqs: [
      {
        question: 'Should I tip on the pre-tax or post-tax subtotal?',
        answer: 'Traditionally, gratuity is calculated on the pre-tax subtotal of food and services, though many credit card terminals display post-tax percentage suggestions.'
      },
      {
        question: 'How do you round tips for cleaner payments?',
        answer: 'You can adjust the tip percentage slightly up or down to make the final grand total or the individual split round to the nearest whole dollar.'
      }
    ]
  },
  vat: {
    id: 'vat',
    name: 'VAT (Value Added Tax) Calculator',
    shortDescription: 'Add or extract Value Added Tax (VAT) from purchase totals.',
    category: 'Practical Mathematics',
    lastUpdated: 'July 2026',
    inputs: [
      {
        id: 'mode',
        label: 'Tax Direction',
        type: 'select',
        defaultValue: 'add',
        options: [
          { label: 'Add VAT (Exclusive)', value: 'add' },
          { label: 'Remove VAT (Inclusive)', value: 'remove' }
        ],
        tooltip: 'Choose whether to add VAT to a net total or extract built-in tax from a gross total.'
      },
      {
        id: 'amount',
        label: 'Base Amount',
        type: 'number',
        defaultValue: 150,
        min: 0,
        prefix: '$',
        placeholder: 'e.g., 150',
        tooltip: 'The financial amount to process.'
      },
      {
        id: 'vatRate',
        label: 'VAT Rate',
        type: 'number',
        defaultValue: 20,
        min: 0,
        max: 100,
        suffix: '%',
        placeholder: 'e.g., 20',
        tooltip: 'The percentage of Value Added Tax to apply.'
      }
    ],
    formula: {
      equation: 'VAT Calculation',
      description: 'Handles value-added tax inclusions and extractions.',
      steps: [
        'To Add VAT (Exclusive): VAT Amount = Amount * (Rate / 100); Total = Amount + VAT Amount.',
        'To Remove VAT (Inclusive): Net Amount = Amount / (1 + Rate / 100); VAT Amount = Amount - Net Amount.'
      ]
    },
    example: {
      scenario: 'Processing a $150 transaction subject to a 20% European VAT rate.',
      explanation: 'Under Exclusive mode, 20% tax ($30.00) is added, yielding $180.00 total. Under Inclusive mode, the base $150.00 is treated as containing the VAT, extracting a net value of $125.00 and $25.00 in VAT.'
    },
    faqs: [
      {
        question: 'What is the difference between VAT and Sales Tax?',
        answer: 'Value Added Tax (VAT) is collected sequentially at each stage of production and distribution, whereas standard sales tax is a one-time levy assessed purely at final retail checkout.'
      },
      {
        question: 'How do you extract built-in VAT from a final price?',
        answer: 'Divide the gross inclusive price by (1 + VAT Rate / 100) to find the net price, then subtract the net price from the gross price to get the tax portion.'
      }
    ]
  }
};

export function calculate(id: CalculatorId, inputs: Record<string, any>): ResultField[] {
  switch (id) {
    case 'scientific': {
      return [];
    }

    case 'mortgage': {
      const homePrice = Number(inputs.homePrice || 0);
      const downPayment = Number(inputs.downPayment || 0);
      const interestRate = Number(inputs.interestRate || 0);
      const loanTerm = Number(inputs.loanTerm || 30);

      const P = Math.max(0, homePrice - downPayment);
      const r = (interestRate / 100) / 12;
      const n = loanTerm * 12;

      let monthlyPayment = 0;
      if (P > 0) {
        if (r === 0) {
          monthlyPayment = P / n;
        } else {
          monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }
      }

      const totalCost = monthlyPayment * n;
      const totalInterest = Math.max(0, totalCost - P);

      return [
        { id: 'monthlyPayment', label: 'Monthly Payment', value: monthlyPayment, isPrimary: true, format: 'currency' },
        { id: 'principal', label: 'Loan Principal', value: P, format: 'currency' },
        { id: 'totalInterest', label: 'Total Interest', value: totalInterest, format: 'currency' },
        { id: 'totalCost', label: 'Total Cost of Mortgage', value: totalCost, format: 'currency' }
      ];
    }

    case 'reverse-mortgage': {
      const estimate = calculateReverseMortgage({
        homeValue: Number(inputs.homeValue || 0),
        mortgageBalance: Number(inputs.mortgageBalance || 0),
        borrowerAge: Number(inputs.borrowerAge || 0),
        interestRate: Number(inputs.interestRate || 0),
        loanTerm: Number(inputs.loanTerm || 0),
        closingCosts: Number(inputs.closingCosts || 0),
        initialAdvance: Number(inputs.initialAdvance || 0)
      });

      return [
        { id: 'estimatedProceeds', label: 'Estimated Reverse Mortgage Proceeds', value: estimate.estimatedProceeds, isPrimary: true, format: 'currency' },
        { id: 'availableEquity', label: 'Estimated Available Equity', value: estimate.availableEquity, format: 'currency' },
        { id: 'mortgagePayoff', label: 'Existing Mortgage Payoff', value: estimate.mortgagePayoff, format: 'currency' },
        { id: 'netEquityAfterMortgage', label: 'Net Equity After Mortgage and Costs', value: estimate.netEquityAfterMortgage, format: 'currency' },
        { id: 'borrowingCapacity', label: 'Illustrative Borrowing Capacity', value: estimate.borrowingCapacity, format: 'currency' },
        { id: 'initialAdvance', label: 'Estimated Initial Advance', value: estimate.initialAdvance, format: 'currency' },
        { id: 'estimatedRemainingEquity', label: 'Estimated Remaining Equity', value: estimate.estimatedRemainingEquity, format: 'currency' },
        { id: 'estimatedLoanBalance', label: 'Estimated Loan Balance', value: estimate.estimatedLoanBalance, format: 'currency' },
        { id: 'estimatedInterest', label: 'Estimated Interest Accumulation', value: estimate.estimatedInterest, format: 'currency' },
        { id: 'estimatedRepayment', label: 'Estimated Total Repayment Balance', value: estimate.estimatedRepayment, format: 'currency' },
        { id: 'principalLimitFactor', label: 'Illustrative Age/Rate Factor', value: estimate.principalLimitFactor * 100, format: 'percent' },
        { id: 'projectionSummary', label: 'Projection', value: `${inputs.loanTerm} years at the entered planning rate`, format: 'text' }
      ];
    }

    case 'loan': {
      const loanAmount = Number(inputs.loanAmount || 0);
      const interestRate = Number(inputs.interestRate || 0);
      const loanTerm = Number(inputs.loanTerm || 12);

      const P = loanAmount;
      const r = (interestRate / 100) / 12;
      const n = loanTerm;

      let monthlyPayment = 0;
      if (P > 0) {
        if (r === 0) {
          monthlyPayment = P / n;
        } else {
          monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }
      }

      const totalPayment = monthlyPayment * n;
      const totalInterest = Math.max(0, totalPayment - P);

      return [
        { id: 'monthlyPayment', label: 'Monthly Repayment', value: monthlyPayment, isPrimary: true, format: 'currency' },
        { id: 'totalInterest', label: 'Total Interest Paid', value: totalInterest, format: 'currency' },
        { id: 'totalPayment', label: 'Total Repayment Cost', value: totalPayment, format: 'currency' }
      ];
    }

    case 'tax': {
      const annualIncome = Number(inputs.annualIncome || 0);
      const filingStatus = inputs.filingStatus || 'single';
      const deductions = Number(inputs.deductions || 0);

      const TI = Math.max(0, annualIncome - deductions);

      const brackets = filingStatus === 'single'
        ? [
            { limit: 11600, rate: 0.10 },
            { limit: 47150, rate: 0.12 },
            { limit: 100525, rate: 0.22 },
            { limit: 191950, rate: 0.24 },
            { limit: 243725, rate: 0.32 },
            { limit: 609350, rate: 0.35 },
            { limit: Infinity, rate: 0.37 }
          ]
        : [
            { limit: 23200, rate: 0.10 },
            { limit: 94300, rate: 0.12 },
            { limit: 201050, rate: 0.22 },
            { limit: 383900, rate: 0.24 },
            { limit: 487450, rate: 0.32 },
            { limit: 731200, rate: 0.35 },
            { limit: Infinity, rate: 0.37 }
          ];

      let taxDue = 0;
      let remainingIncome = TI;
      let previousLimit = 0;

      for (const bracket of brackets) {
        const taxableInBracket = Math.min(remainingIncome, bracket.limit - previousLimit);
        if (taxableInBracket <= 0) break;
        taxDue += taxableInBracket * bracket.rate;
        remainingIncome -= taxableInBracket;
        previousLimit = bracket.limit;
      }

      const effectiveTaxRate = annualIncome > 0 ? (taxDue / annualIncome) * 100 : 0;
      const takeHomeIncome = Math.max(0, annualIncome - taxDue);

      return [
        { id: 'taxDue', label: 'Est. Federal Tax Due', value: taxDue, isPrimary: true, format: 'currency' },
        { id: 'taxableIncome', label: 'Taxable Income', value: TI, format: 'currency' },
        { id: 'effectiveTaxRate', label: 'Effective Tax Rate', value: effectiveTaxRate, format: 'percent' },
        { id: 'takeHomeIncome', label: 'Estimated Take-Home Income', value: takeHomeIncome, format: 'currency' }
      ];
    }

    case 'interest': {
      const principal = Number(inputs.principal || 0);
      const monthlyContribution = Number(inputs.monthlyContribution || 0);
      const interestRate = Number(inputs.interestRate || 0);
      const term = Number(inputs.term || 1);
      const interestType = inputs.interestType || 'compound';

      if (interestType === 'simple') {
        const rate = interestRate / 100;
        const simpleInterest = principal * rate * term;
        const totalContributions = monthlyContribution * 12 * term;
        const futureValue = principal + simpleInterest + totalContributions;

        return [
          { id: 'futureValue', label: 'Future Value', value: futureValue, isPrimary: true, format: 'currency' },
          { id: 'totalContributions', label: 'Total Contributions', value: totalContributions, format: 'currency' },
          { id: 'totalInterest', label: 'Simple Interest Earned', value: simpleInterest, format: 'currency' }
        ];
      } else {
        const r = interestRate / 100;
        const totalMonths = Math.round(term * 12);
        const monthlyRate = r / 12;

        let balance = principal;
        let totalContributions = 0;

        for (let m = 1; m <= totalMonths; m++) {
          balance += monthlyContribution;
          totalContributions += monthlyContribution;
          balance += balance * monthlyRate;
        }

        const totalInterest = Math.max(0, balance - principal - totalContributions);

        return [
          { id: 'futureValue', label: 'Future Compounded Value', value: balance, isPrimary: true, format: 'currency' },
          { id: 'totalContributions', label: 'Total Contributions', value: totalContributions, format: 'currency' },
          { id: 'totalInterest', label: 'Compound Interest Earned', value: totalInterest, format: 'currency' }
        ];
      }
    }

    case 'payment': {
      const calcOption = inputs.calcOption || 'payment';
      const balance = Number(inputs.balance || 0);
      const interestRate = Number(inputs.interestRate || 0);
      const monthlyPayment = Number(inputs.monthlyPayment || 250);
      const targetMonths = Number(inputs.targetMonths || 24);

      const P = balance;
      const r = (interestRate / 100) / 12;

      if (calcOption === 'payment') {
        const n = targetMonths;
        let paymentAmount = 0;

        if (P > 0) {
          if (r === 0) {
            paymentAmount = P / n;
          } else {
            paymentAmount = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
          }
        }

        const totalCost = paymentAmount * n;
        const totalInterest = Math.max(0, totalCost - P);

        return [
          { id: 'resultPayment', label: 'Required Monthly Payment', value: paymentAmount, isPrimary: true, format: 'currency' },
          { id: 'totalInterest', label: 'Total Interest Charge', value: totalInterest, format: 'currency' },
          { id: 'totalPayments', label: 'Total Debt Cost', value: totalCost, format: 'currency' }
        ];
      } else {
        const M = monthlyPayment;
        const interestAccrualPerMonth = P * r;

        if (P === 0) {
          return [
            { id: 'resultMonths', label: 'Time to Payoff', value: 'Paid off', isPrimary: true, format: 'text' },
            { id: 'totalInterest', label: 'Total Interest Charge', value: 0, format: 'currency' },
            { id: 'totalPayments', label: 'Total Debt Cost', value: 0, format: 'currency' }
          ];
        }

        if (M <= interestAccrualPerMonth) {
          return [
            { id: 'resultMonths', label: 'Time to Payoff', value: 'Infinite (Payment too low to cover APR)', isPrimary: true, format: 'text' },
            { id: 'totalInterest', label: 'Total Interest Charge', value: Infinity, format: 'currency' },
            { id: 'totalPayments', label: 'Total Debt Cost', value: Infinity, format: 'currency' }
          ];
        }

        let months = 0;
        if (r === 0) {
          months = P / M;
        } else {
          months = -Math.log(1 - (P * r) / M) / Math.log(1 + r);
        }

        const exactMonths = Math.max(0, months);
        const roundedMonths = Math.ceil(exactMonths);
        const yearsStr = (exactMonths / 12).toFixed(1);
        const payoffStr = `${roundedMonths} months (~${yearsStr} years)`;

        const totalCost = M * exactMonths;
        const totalInterest = Math.max(0, totalCost - P);

        return [
          { id: 'resultMonths', label: 'Time to Payoff', value: payoffStr, isPrimary: true, format: 'text' },
          { id: 'totalInterest', label: 'Total Interest Charge', value: totalInterest, format: 'currency' },
          { id: 'totalPayments', label: 'Total Debt Cost', value: totalCost, format: 'currency' }
        ];
      }
    }

    case 'time': {
      const mode = inputs.mode || 'difference';
      const startDateStr = inputs.startDate || '2026-07-06';
      const endDateStr = inputs.endDate || '2026-12-31';
      const addSubtractDays = Number(inputs.addSubtractDays || 0);
      const excludeWeekends = inputs.excludeWeekends !== false;

      const start = new Date(startDateStr);

      if (mode === 'difference') {
        const end = new Date(endDateStr);
        const diffTime = end.getTime() - start.getTime();
        const totalCalendarDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        let bizDays = 0;
        // Simple day offset counting loop
        const temp = new Date(start);
        const isForward = totalCalendarDays >= 0;

        if (isForward) {
          while (temp < end) {
            temp.setDate(temp.getDate() + 1);
            const day = temp.getDay();
            if (!excludeWeekends || (day !== 0 && day !== 6)) {
              bizDays++;
            }
          }
        } else {
          while (temp > end) {
            temp.setDate(temp.getDate() - 1);
            const day = temp.getDay();
            if (!excludeWeekends || (day !== 0 && day !== 6)) {
              bizDays--;
            }
          }
        }

        const absCal = Math.abs(totalCalendarDays);
        const absBiz = Math.abs(bizDays);
        const weeks = (absCal / 7).toFixed(1);

        return [
          { id: 'calendarDays', label: 'Total Calendar Days', value: `${absCal} days`, isPrimary: true, format: 'text' },
          { id: 'businessDays', label: 'Working Business Days', value: `${absBiz} working days`, format: 'text' },
          { id: 'weeks', label: 'Equivalent Weeks', value: `${weeks} weeks`, format: 'text' }
        ];
      } else {
        const days = addSubtractDays;
        const temp = new Date(start);

        if (excludeWeekends) {
          let added = 0;
          const target = Math.abs(days);
          const step = days >= 0 ? 1 : -1;

          while (added < target) {
            temp.setDate(temp.getDate() + step);
            const day = temp.getDay();
            if (day !== 0 && day !== 6) {
              added++;
            }
          }
        } else {
          temp.setDate(temp.getDate() + days);
        }

        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const resultDateStr = temp.toLocaleDateString('en-US', options);

        return [
          { id: 'targetDate', label: 'Projected Target Date', value: resultDateStr, isPrimary: true, format: 'text' },
          { id: 'calendarOffset', label: 'Offset Duration', value: `${Math.abs(days)} calendar-adjusted days`, format: 'text' }
        ];
      }
    }

    case 'age': {
      const age = calculateAge(inputs.dateOfBirth, inputs.calculationDate);

      return [
        {
          id: 'exactAge',
          label: 'Your Exact Age',
          value: `${age.years} Years, ${age.months} Months, ${age.days} Days`,
          isPrimary: true,
          format: 'text'
        },
        { id: 'totalYears', label: 'Total Years', value: age.totalYears, format: 'number', suffix: ' years' },
        { id: 'totalMonths', label: 'Total Months', value: age.totalMonths, format: 'number', suffix: ' months' },
        { id: 'totalWeeks', label: 'Total Weeks', value: age.totalWeeks, format: 'number', suffix: ' weeks' },
        { id: 'totalDays', label: 'Total Days', value: age.totalDays, format: 'number', suffix: ' days' },
        { id: 'nextBirthday', label: 'Next Birthday', value: age.nextBirthday, format: 'text' },
        { id: 'daysUntilNextBirthday', label: 'Days Until Next Birthday', value: age.daysUntilNextBirthday, format: 'number', suffix: ' days' },
        { id: 'dayOfBirth', label: 'Day of Birth', value: age.dayOfBirth, format: 'text' },
        { id: 'ageStatus', label: 'Age Status', value: age.status, format: 'text' }
      ];
    }

    case 'profit-margin': {
      const calcMode = inputs.calcMode || 'margin';
      const cost = Number(inputs.cost || 0);
      const sellingPrice = Number(inputs.sellingPrice || 0);
      const targetMargin = Number(inputs.targetMargin || 0);

      if (calcMode === 'margin') {
        const GP = sellingPrice - cost;
        const GM = sellingPrice > 0 ? (GP / sellingPrice) * 100 : 0;
        const Markup = cost > 0 ? (GP / cost) * 100 : 0;

        return [
          { id: 'grossMargin', label: 'Gross Profit Margin', value: GM, isPrimary: true, format: 'percent' },
          { id: 'grossProfit', label: 'Gross Profit Earned', value: GP, format: 'currency' },
          { id: 'markup', label: 'Markup Achieved', value: Markup, format: 'percent' },
          { id: 'sellingPrice', label: 'Retained Selling Price', value: sellingPrice, format: 'currency' }
        ];
      } else {
        const GM = targetMargin;
        const sellingPriceCalculated = GM < 100 ? cost / (1 - GM / 100) : 0;
        const GP = sellingPriceCalculated - cost;
        const Markup = cost > 0 ? (GP / cost) * 100 : 0;

        return [
          { id: 'sellingPrice', label: 'Target Selling Price', value: sellingPriceCalculated, isPrimary: true, format: 'currency' },
          { id: 'grossProfit', label: 'Expected Gross Profit', value: GP, format: 'currency' },
          { id: 'markup', label: 'Required Markup', value: Markup, format: 'percent' }
        ];
      }
    }

    case 'roi': {
      const amountInvested = Number(inputs.amountInvested || 0);
      const amountReturned = Number(inputs.amountReturned || 0);
      const termYears = Number(inputs.termYears || 1);

      const profit = amountReturned - amountInvested;
      const roi = amountInvested > 0 ? (profit / amountInvested) * 100 : 0;

      let annualizedRoi = 0;
      if (termYears > 0 && amountInvested > 0 && amountReturned > 0) {
        annualizedRoi = (Math.pow(amountReturned / amountInvested, 1 / termYears) - 1) * 100;
      }

      return [
        { id: 'totalRoi', label: 'Total Return on Investment (ROI)', value: roi, isPrimary: true, format: 'percent' },
        { id: 'profit', label: 'Net Investment Profit', value: profit, format: 'currency' },
        { id: 'annualizedRoi', label: 'Annualized ROI (CAGR)', value: annualizedRoi, format: 'percent' }
      ];
    }

    case 'percentage': {
      const mode = inputs.mode || 'of_value';
      const X = Number(inputs.valueX || 0);
      const Y = Number(inputs.valueY || 0);

      if (mode === 'proportion') {
        const pct = Y !== 0 ? (X / Y) * 100 : 0;
        return [
          { id: 'resultPercent', label: 'Proportion Percentage', value: pct, isPrimary: true, format: 'percent' },
          { id: 'ratio', label: 'Ratio fraction', value: `${X} / ${Y}`, format: 'text' }
        ];
      } else if (mode === 'change') {
        const pct = X !== 0 ? ((Y - X) / X) * 100 : 0;
        const diff = Y - X;
        return [
          { id: 'resultPercent', label: 'Percentage Change', value: pct, isPrimary: true, format: 'percent' },
          { id: 'difference', label: 'Absolute Difference', value: diff, format: 'number' }
        ];
      } else {
        // of_value
        const resultVal = (X / 100) * Y;
        return [
          { id: 'resultValue', label: 'Percentage Value', value: resultVal, isPrimary: true, format: 'number' },
          { id: 'base', label: 'Base Value (Y)', value: Y, format: 'number' },
          { id: 'rate', label: 'Rate (X%)', value: `${X}%`, format: 'text' }
        ];
      }
    }

    case 'discount': {
      const originalPrice = Number(inputs.originalPrice || 0);
      const discountRate = Number(inputs.discountRate || 0);
      const taxRate = Number(inputs.taxRate || 0);

      const savings = originalPrice * (discountRate / 100);
      const salePrice = Math.max(0, originalPrice - savings);
      const taxPaid = salePrice * (taxRate / 100);
      const finalPrice = salePrice + taxPaid;

      return [
        { id: 'finalPrice', label: 'Final Net Price', value: finalPrice, isPrimary: true, format: 'currency' },
        { id: 'savings', label: 'Total Savings Discounted', value: savings, format: 'currency' },
        { id: 'salePrice', label: 'Pre-Tax Sale Price', value: salePrice, format: 'currency' },
        { id: 'taxPaid', label: 'Sales Tax Paid', value: taxPaid, format: 'currency' }
      ];
    }

    case 'tip': {
      const billAmount = Number(inputs.billAmount || 0);
      const tipPercentage = Number(inputs.tipPercentage || 0);
      const numPeople = Number(inputs.numPeople || 1);

      const tipAmount = billAmount * (tipPercentage / 100);
      const grandTotal = billAmount + tipAmount;
      const share = numPeople > 0 ? grandTotal / numPeople : grandTotal;

      return [
        { id: 'share', label: 'Share per Guest', value: share, isPrimary: true, format: 'currency' },
        { id: 'tipAmount', label: 'Total Tip Amount', value: tipAmount, format: 'currency' },
        { id: 'grandTotal', label: 'Grand Total Bill', value: grandTotal, format: 'currency' }
      ];
    }

    case 'vat': {
      const mode = inputs.mode || 'add';
      const amount = Number(inputs.amount || 0);
      const vatRate = Number(inputs.vatRate || 0);

      if (mode === 'remove') {
        const netAmount = amount / (1 + vatRate / 100);
        const vatAmount = amount - netAmount;
        return [
          { id: 'netAmount', label: 'Net Amount (Excl. VAT)', value: netAmount, isPrimary: true, format: 'currency' },
          { id: 'vatAmount', label: 'Extracted VAT Amount', value: vatAmount, format: 'currency' },
          { id: 'grossAmount', label: 'Gross Amount (Incl. VAT)', value: amount, format: 'currency' }
        ];
      } else {
        const vatAmount = amount * (vatRate / 100);
        const grossAmount = amount + vatAmount;
        return [
          { id: 'grossAmount', label: 'Gross Amount (Incl. VAT)', value: grossAmount, isPrimary: true, format: 'currency' },
          { id: 'vatAmount', label: 'VAT Tax Amount', value: vatAmount, format: 'currency' },
          { id: 'netAmount', label: 'Net Amount (Excl. VAT)', value: amount, format: 'currency' }
        ];
      }
    }

    default:
      return [];
  }
}
