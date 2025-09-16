
import React from 'react';
import type { CalculationResults } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from './ui/Card';

interface ResultsDisplayProps {
  results: CalculationResults | null;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Define a placeholder component to be shown before calculations
const Placeholder: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full bg-white p-8 rounded-xl shadow-md border border-slate-200">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <h3 className="text-xl font-semibold text-slate-700">Your results will appear here</h3>
      <p className="text-slate-500 mt-2 text-center">Fill out the form and click "Calculate" to see your comparison.</p>
    </div>
);


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (!results) {
    return <Placeholder />;
  }

  const { investLumpSum, payDownMortgage, inputs } = results;
  const difference = investLumpSum.finalPortfolioValue - payDownMortgage.finalPortfolioValue;
  const winner = difference > 0 ? 'Invest Lump Sum' : 'Pay Down Mortgage';
  const winnerColor = difference > 0 ? 'text-green-600' : 'text-blue-600';

  const chartData = [
    {
      name: 'Final Portfolio Value',
      'Invest Lump Sum': Math.round(investLumpSum.finalPortfolioValue),
      'Pay Down Mortgage': Math.round(payDownMortgage.finalPortfolioValue),
    },
  ];

  return (
    <div className="space-y-8">
      <Card>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">The Verdict</h2>
          <p className="text-lg text-slate-600">
            After {inputs.remainingYears} years, the superior strategy is to{' '}
            <strong className={`${winnerColor} font-semibold`}>{winner}</strong>,
            leaving you with an estimated{' '}
            <strong className={`${winnerColor} font-semibold`}>{formatCurrency(Math.abs(difference))}</strong> more in your portfolio.
          </p>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card isHighlighted={winner === 'Invest Lump Sum'}>
            <h3 className="text-xl font-bold text-green-700">Option 1: Invest the Lump Sum</h3>
            <div className="mt-4 space-y-2 text-slate-700">
                <p>Final Portfolio Value: <span className="font-semibold text-lg">{formatCurrency(investLumpSum.finalPortfolioValue)}</span></p>
                <p>Total Interest Paid: <span className="font-semibold">{formatCurrency(investLumpSum.totalInterestPaid)}</span></p>
                <p>Monthly Mortgage: <span className="font-semibold">{formatCurrency(investLumpSum.monthlyPayment)}</span></p>
            </div>
        </Card>
        <Card isHighlighted={winner === 'Pay Down Mortgage'}>
            <h3 className="text-xl font-bold text-blue-700">Option 2: Pay Down Mortgage</h3>
            <div className="mt-4 space-y-2 text-slate-700">
                <p>Final Portfolio Value: <span className="font-semibold text-lg">{formatCurrency(payDownMortgage.finalPortfolioValue)}</span></p>
                <p>Total Interest Paid: <span className="font-semibold">{formatCurrency(payDownMortgage.totalInterestPaid)}</span></p>
                <p>Monthly Mortgage: <span className="font-semibold">{formatCurrency(payDownMortgage.monthlyPayment)}</span></p>
            </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Portfolio Value Comparison</h3>
        <div className="w-full h-72">
            <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  formatter={(value: number) => formatCurrency(value)} 
                />
                <Legend />
                <Bar dataKey="Invest Lump Sum" fill="#10b981" />
                <Bar dataKey="Pay Down Mortgage" fill="#3b82f6" />
            </BarChart>
            </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
