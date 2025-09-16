import React, { useState, useCallback } from 'react';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { useMortgageCalculator } from './hooks/useMortgageCalculator';
import type { MortgageInputs, CalculationResults } from './types';

// A helper type to represent form inputs, which are strings during entry
export type FormInputs = {
  [K in keyof MortgageInputs]: string;
};

const App: React.FC = () => {
  const [inputs, setInputs] = useState<FormInputs>({
    mortgageRate: '3.5',
    marketReturn: '7',
    remainingYears: '25',
    remainingBalance: '300000',
    lumpSum: '50000',
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const { calculate } = useMortgageCalculator();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow only non-negative numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value)) {
        setInputs(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const numericInputs: MortgageInputs = {
        mortgageRate: Number(inputs.mortgageRate) || 0,
        marketReturn: Number(inputs.marketReturn) || 0,
        remainingYears: Number(inputs.remainingYears) || 0,
        remainingBalance: Number(inputs.remainingBalance) || 0,
        lumpSum: Number(inputs.lumpSum) || 0,
    };
    const newResults = calculate(numericInputs);
    setResults(newResults);
  }, [inputs, calculate]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Mortgage Lump Sum Calculator
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            Should you pay down your mortgage or invest a lump sum? This calculator compares both scenarios, accounting for market returns on your saved monthly payments.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <CalculatorForm 
              inputs={inputs} 
              onInputChange={handleInputChange} 
              onSubmit={handleFormSubmit}
            />
          </div>
          <div className="lg:col-span-3">
            <ResultsDisplay results={results} />
          </div>
        </div>

        <footer className="text-center mt-12 text-sm text-slate-500">
          <p>Calculations are for illustrative purposes only and do not constitute financial advice.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;