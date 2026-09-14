export interface ReverseMortgageInputs {
  homeValue: number;
  mortgageBalance: number;
  borrowerAge: number;
  interestRate: number;
  loanTerm: number;
  closingCosts: number;
  initialAdvance: number;
}

export interface ReverseMortgageProjection {
  year: number;
  startingBalance: number;
  interestAccumulated: number;
  endingBalance: number;
  remainingEquity: number;
}

export interface ReverseMortgageEstimate {
  availableEquity: number;
  borrowingCapacity: number;
  mortgagePayoff: number;
  netEquityAfterMortgage: number;
  estimatedProceeds: number;
  initialAdvance: number;
  estimatedRemainingEquity: number;
  estimatedLoanBalance: number;
  estimatedInterest: number;
  estimatedRepayment: number;
  principalLimitFactor: number;
  projections: ReverseMortgageProjection[];
}

const MIN_BORROWER_AGE = 62;
const MAX_BORROWER_AGE = 100;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

export function calculateReverseMortgage(inputs: ReverseMortgageInputs): ReverseMortgageEstimate {
  const {
    homeValue,
    mortgageBalance,
    borrowerAge,
    interestRate,
    loanTerm,
    closingCosts,
    initialAdvance
  } = inputs;

  if (homeValue <= 0) throw new Error('Home value must be greater than zero.');
  if (mortgageBalance < 0 || mortgageBalance > homeValue) {
    throw new Error('Existing mortgage balance must be between zero and the home value.');
  }
  if (borrowerAge < MIN_BORROWER_AGE || borrowerAge > MAX_BORROWER_AGE) {
    throw new Error(`Borrower age must be between ${MIN_BORROWER_AGE} and ${MAX_BORROWER_AGE}.`);
  }
  if (interestRate < 0 || interestRate > 20) throw new Error('Interest rate must be between 0% and 20%.');
  if (loanTerm < 1 || loanTerm > 30) throw new Error('Expected term must be between 1 and 30 years.');
  if (closingCosts < 0 || initialAdvance < 0) throw new Error('Costs and advances cannot be negative.');

  const availableEquity = homeValue - mortgageBalance;
  const netEquityAfterMortgage = availableEquity - closingCosts;

  // Illustrative planning model, not a lender principal-limit table. Older age increases
  // the factor while higher rates reduce it; actual programs use lender-specific rules.
  const principalLimitFactor = clamp(0.40 + (borrowerAge - MIN_BORROWER_AGE) * 0.0075, 0.40, 0.75);
  const interestAdjustment = clamp(1 - interestRate / 100 * 2, 0.60, 1);
  const borrowingCapacity = homeValue * principalLimitFactor * interestAdjustment;
  const estimatedProceeds = Math.max(0, Math.min(initialAdvance, borrowingCapacity - mortgageBalance - closingCosts));
  const startingBalance = mortgageBalance + closingCosts + estimatedProceeds;
  const annualRate = interestRate / 100;
  const projections: ReverseMortgageProjection[] = [];
  let balance = startingBalance;

  for (let year = 0; year <= loanTerm; year += 1) {
    if (year > 0) {
      const startingBalance = balance;
      const interestAccumulated = startingBalance * annualRate;
      balance = startingBalance + interestAccumulated;
      projections.push({
        year,
        startingBalance,
        interestAccumulated,
        endingBalance: balance,
        remainingEquity: Math.max(0, homeValue - balance)
      });
    } else {
      projections.push({
        year: 0,
        startingBalance: balance,
        interestAccumulated: 0,
        endingBalance: balance,
        remainingEquity: Math.max(0, homeValue - balance)
      });
    }
  }

  const finalProjection = projections[projections.length - 1];
  return {
    availableEquity,
    borrowingCapacity,
    mortgagePayoff: mortgageBalance,
    netEquityAfterMortgage,
    estimatedProceeds,
    initialAdvance: estimatedProceeds,
    estimatedRemainingEquity: finalProjection.remainingEquity,
    estimatedLoanBalance: finalProjection.endingBalance,
    estimatedInterest: finalProjection.endingBalance - startingBalance,
    estimatedRepayment: finalProjection.endingBalance,
    principalLimitFactor,
    projections
  };
}