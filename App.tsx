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

        <footer className="flex flex-col md:flex-row justify-between items-center border-t mt-12 pt-6 gap-4 text-sm text-slate-500">
          <div>
            © 2025 <a href="https://fzakaria.com" className="underline hover:text-slate-700">Farid Zakaria</a>
          </div>
          <div>
            <i>Calculations are for illustrative purposes only and do not constitute financial advice.</i>
          </div>
          <div className="flex items-center gap-4">
            <a
              className="font-mono underline hover:text-slate-700"
              href={`https://github.com/fzakaria/mortgage-payoff-calculator/commit/${__GIT_COMMIT__ || 'main'}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {(__GIT_COMMIT__).substring(0, 7)}
            </a>
            <a
              className="hover:text-slate-700"
              href="https://github.com/fzakaria/mortgage-payoff-calculator"
              aria-label="GitHub repository"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>
          </div>
        </footer>

        </main>
    </div>
  );
};

export default App;