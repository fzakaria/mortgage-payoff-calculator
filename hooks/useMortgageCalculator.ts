
import { useCallback } from 'react';
import type { MortgageInputs, CalculationResults, ScenarioResult } from '../types';

export const useMortgageCalculator = () => {

  const calculateMonthlyPayment = (principal: number, monthlyRate: number, numberOfPayments: number): number => {
    if (principal <= 0) return 0;
    if (monthlyRate === 0) return principal / numberOfPayments;
    
    const factor = Math.pow(1 + monthlyRate, numberOfPayments);
    return principal * (monthlyRate * factor) / (factor - 1);
  };

  const calculateFvAnnuity = (monthlyInvestment: number, monthlyRate: number, numberOfPayments: number): number => {
    if (monthlyRate === 0) return monthlyInvestment * numberOfPayments;
    return monthlyInvestment * ((Math.pow(1 + monthlyRate, numberOfPayments) - 1) / monthlyRate);
  };
  
  const calculate = useCallback((inputs: MortgageInputs): CalculationResults => {
    const { mortgageRate, marketReturn, remainingYears, remainingBalance, lumpSum } = inputs;
    
    const n_months = remainingYears * 12;
    const r_mortgage_monthly = mortgageRate / 100 / 12;
    const r_market_monthly = marketReturn / 100 / 12;

    // Scenario A: Invest the Lump Sum
    const originalMonthlyPayment = calculateMonthlyPayment(remainingBalance, r_mortgage_monthly, n_months);
    const totalInterest_A = (originalMonthlyPayment * n_months) - remainingBalance;
    const finalPortfolioValue_A = lumpSum * Math.pow(1 + r_market_monthly, n_months);
    
    const investLumpSumResult: ScenarioResult = {
      finalPortfolioValue: finalPortfolioValue_A > 0 ? finalPortfolioValue_A : 0,
      totalInterestPaid: totalInterest_A > 0 ? totalInterest_A : 0,
      monthlyPayment: originalMonthlyPayment
    };
    
    // Scenario B: Pay Down Mortgage & Invest Savings
    const newBalance = remainingBalance - lumpSum;
    let newMonthlyPayment = 0;
    let totalInterest_B = 0;
    let monthlyInvestment = 0;
    let finalPortfolioValue_B = 0;

    if (newBalance <= 0) { // Mortgage is fully paid off
        newMonthlyPayment = 0;
        totalInterest_B = 0;
        monthlyInvestment = originalMonthlyPayment; // The entire original payment can be invested
    } else {
        newMonthlyPayment = calculateMonthlyPayment(newBalance, r_mortgage_monthly, n_months);
        totalInterest_B = (newMonthlyPayment * n_months) - newBalance;
        monthlyInvestment = originalMonthlyPayment - newMonthlyPayment;
    }

    if (monthlyInvestment > 0 && n_months > 0) {
      finalPortfolioValue_B = calculateFvAnnuity(monthlyInvestment, r_market_monthly, n_months);
    }
    
    const payDownMortgageResult: ScenarioResult = {
      finalPortfolioValue: finalPortfolioValue_B > 0 ? finalPortfolioValue_B : 0,
      totalInterestPaid: totalInterest_B > 0 ? totalInterest_B : 0,
      monthlyPayment: newMonthlyPayment
    };

    return {
      investLumpSum: investLumpSumResult,
      payDownMortgage: payDownMortgageResult,
      inputs
    };
  }, []);

  return { calculate };
};
