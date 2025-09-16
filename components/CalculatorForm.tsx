import React from 'react';
import type { FormInputs } from '../App';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface CalculatorFormProps {
  inputs: FormInputs;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ inputs, onInputChange, onSubmit }) => {
  const isFormValid = Object.values(inputs).every(
    value => value.trim() !== '' && !isNaN(Number(value)) && Number(value) >= 0
  );

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-md space-y-6 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 border-b pb-4">Enter Your Details</h2>
        <Input
            label="Remaining Mortgage Balance"
            id="remainingBalance"
            name="remainingBalance"
            type="text"
            inputMode="decimal"
            value={inputs.remainingBalance}
            onChange={onInputChange}
            prefix="$"
        />
        <Input
            label="Lump Sum Payment"
            id="lumpSum"
            name="lumpSum"
            type="text"
            inputMode="decimal"
            value={inputs.lumpSum}
            onChange={onInputChange}
            prefix="$"
        />
        <Input
            label="Remaining Mortgage Term (Years)"
            id="remainingYears"
            name="remainingYears"
            type="text"
            inputMode="numeric"
            value={inputs.remainingYears}
            onChange={onInputChange}
        />
        <Input
            label="Mortgage Interest Rate"
            id="mortgageRate"
            name="mortgageRate"
            type="text"
            inputMode="decimal"
            value={inputs.mortgageRate}
            onChange={onInputChange}
            suffix="%"
        />
        <Input
            label="Expected Annual Market Return"
            id="marketReturn"
            name="marketReturn"
            type="text"
            inputMode="decimal"
            value={inputs.marketReturn}
            onChange={onInputChange}
            suffix="%"
        />
        <Button type="submit" disabled={!isFormValid}>
            Calculate Comparison
        </Button>
    </form>
  );
};