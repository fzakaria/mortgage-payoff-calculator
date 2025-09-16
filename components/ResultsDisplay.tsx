import React, { useState } from 'react';
import type { CalculationResults } from '../types';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card } from './ui/Card';

// --- Constants for better maintainability ---
const COLORS = {
  invest: '#10b981', // green-500
  payDown: '#3b82f6', // blue-500
  textPrimary: '#1e293b', // slate-800
  textSecondary: '#475569', // slate-600
  textMuted: '#64748b', // slate-500
};

// --- Helper Functions ---
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatAxisTick = (value: number) => `$${Number(value) / 1000}k`;

// --- UI Components ---

// Extracted for cleanliness
const Placeholder: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full bg-white p-8 rounded-xl shadow-md border border-slate-200">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
    <h3 className="text-xl font-semibold text-slate-700">Your results will appear here</h3>
    <p className="text-slate-500 mt-2 text-center">Fill out the form and click "Calculate" to see your comparison.</p>
  </div>
);

// Extracted SVG icons for readability
const LineChartIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 group-hover:text-slate-800">
    <path d="M3 17l6-6 4 4 8-8" />
  </svg>
);

const BarChartIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 group-hover:text-slate-800">
    <rect x="3" y="8" width="4" height="8" /><rect x="10" y="4" width="4" height="12" /><rect x="17" y="12" width="4" height="4" />
  </svg>
);


// --- Main Component ---
interface ResultsDisplayProps {
  results: CalculationResults | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [chartView, setChartView] = useState<'comparison' | 'growth'>('comparison');

  if (!results) {
    return <Placeholder />;
  }

  const { investLumpSum, payDownMortgage, inputs, timeSeriesData } = results;
  const difference = investLumpSum.finalPortfolioValue - payDownMortgage.finalPortfolioValue;
  const isInvestingWinner = difference > 0;
  const winner = isInvestingWinner ? 'Invest the Lump Sum' : 'Pay Down the Mortgage';
  const winnerColorClass = isInvestingWinner ? 'text-green-600' : 'text-blue-600';

  const comparisonChartData = [{
    name: 'Final Portfolio Value',
    'Invest Lump Sum': Math.round(investLumpSum.finalPortfolioValue),
    'Pay Down Mortgage': Math.round(payDownMortgage.finalPortfolioValue),
  }];

  // Sample the time series data to show one point per year for a cleaner chart
  const growthChartData = timeSeriesData
    .filter((_, index) => (index + 1) % 12 === 0 || index === timeSeriesData.length - 1)
    .map(point => ({
      year: Math.ceil(point.month / 12),
      'Lump Sum Growth': Math.round(point.lumpSumValue),
      'Monthly Savings Growth': Math.round(point.monthlySavingsValue),
    }));

  return (
    <div className="space-y-8">
      <Card>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">The Verdict ⚖️</h2>
          <p className="text-lg text-slate-600">
            After {inputs.remainingYears} years, the superior strategy is to{' '}
            <strong className={`${winnerColorClass} font-semibold`}>{winner}</strong>,
            leaving you with an estimated{' '}
            <strong className={`${winnerColorClass} font-semibold`}>{formatCurrency(Math.abs(difference))}</strong> more.
          </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card isHighlighted={isInvestingWinner}>
            <h3 className="text-xl font-bold text-green-700">Option 1: Invest the Lump Sum</h3>
            <div className="mt-4 space-y-2 text-slate-700">
                <p>Final Portfolio Value: <span className="font-semibold text-lg">{formatCurrency(investLumpSum.finalPortfolioValue)}</span></p>
                <p>Total Interest Paid: <span className="font-semibold">{formatCurrency(investLumpSum.totalInterestPaid)}</span></p>
                <p>Monthly Mortgage: <span className="font-semibold">{formatCurrency(investLumpSum.monthlyPayment)}</span></p>
            </div>
        </Card>
        <Card isHighlighted={!isInvestingWinner}>
            <h3 className="text-xl font-bold text-blue-700">Option 2: Pay Down Mortgage</h3>
            <div className="mt-4 space-y-2 text-slate-700">
                <p>Final Portfolio Value: <span className="font-semibold text-lg">{formatCurrency(payDownMortgage.finalPortfolioValue)}</span></p>
                <p>Total Interest Paid: <span className="font-semibold">{formatCurrency(payDownMortgage.totalInterestPaid)}</span></p>
                <p>Monthly Mortgage: <span className="font-semibold">{formatCurrency(payDownMortgage.monthlyPayment)}</span></p>
            </div>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>
            {chartView === 'comparison' ? 'Final Portfolio Comparison' : 'Portfolio Growth Over Time'}
          </h3>
          <button
            onClick={() => setChartView(prev => prev === 'comparison' ? 'growth' : 'comparison')}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 group"
            title={`Switch to ${chartView === 'comparison' ? 'Growth Over Time' : 'Comparison'} view`}
          >
            {chartView === 'comparison' ? <LineChartIcon /> : <BarChartIcon />}
          </button>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer>
            {chartView === 'comparison' ? (
              <BarChart data={comparisonChartData} margin={{ top: 5, right: 20, left: 30, bottom: 55 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: COLORS.textMuted }} />
                <YAxis tickFormatter={formatAxisTick} tick={{ fill: COLORS.textMuted }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(value: number) => formatCurrency(value)} />
                 <Legend wrapperStyle={{ textAlign: 'center', paddingTop: '15px' }} />
                <Bar dataKey="Invest Lump Sum" fill={COLORS.invest} />
                <Bar dataKey="Pay Down Mortgage" fill={COLORS.payDown} />
              </BarChart>
            ) : (
              <LineChart data={growthChartData} margin={{ top: 5, right: 20, left: 30, bottom: 55 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: COLORS.textMuted }}
                  label={{ value: 'Years', position: 'insideBottom', offset: -15, style: { fill: COLORS.textMuted } }}
                  interval="preserveStartEnd"
                />
                 <YAxis
                   tickFormatter={formatAxisTick}
                   tick={{ fill: COLORS.textMuted }}
                   label={{ 
                     value: 'Portfolio Value', 
                     angle: -90, 
                     position: 'insideLeft', 
                     style: { textAnchor: 'middle', fill: COLORS.textMuted },
                     offset: -20
                   }}
                 />
                <Tooltip
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Year ${label}`}
                />
                 <Legend 
                   verticalAlign="bottom" 
                   height={36}
                   wrapperStyle={{ 
                     paddingTop: '30px',
                     textAlign: 'center',
                     width: '100%'
                   }} 
                 />
                <Line type="monotone" dataKey="Lump Sum Growth" stroke={COLORS.invest} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Monthly Savings Growth" stroke={COLORS.payDown} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};