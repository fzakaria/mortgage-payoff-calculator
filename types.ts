
export interface MortgageInputs {
  mortgageRate: number;
  marketReturn: number;
  remainingYears: number;
  remainingBalance: number;
  lumpSum: number;
}

export interface ScenarioResult {
  finalPortfolioValue: number;
  totalInterestPaid: number;
  monthlyPayment: number;
}

export interface CalculationResults {
  investLumpSum: ScenarioResult;
  payDownMortgage: ScenarioResult;
  inputs: MortgageInputs;
}
