import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Percent,
  Home as HomeIcon,
  FileText,
  TrendingUp,
  CreditCard,
  Clock,
  Scale,
  Award,
  Tag,
  Coins,
  Receipt,
  DollarSign,
  Calendar,
  Users,
  Check,
  Copy,
  Printer,
  RotateCcw,
  Info,
  ChevronRight,
  AlertTriangle,
  User,
  Calculator,
  Plus,
  Minus,
  ShoppingBag,
  Utensils,
  TrendingDown,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { CalculatorSchema, ResultField } from '@/types';
import { calculate, calculatorsData } from '@/data/calculators';
import InputField from './InputField';
import SelectField from './SelectField';
import ActionButtons from './ActionButtons';
import ResultCard from './ResultCard';
import FormulaSection from './FormulaSection';
import ExampleSection from './ExampleSection';
import FAQSection from './FAQSection';
import { useToast } from './Toast';
import { CalculatorCardSkeleton, ResultCardSkeleton } from '../ui/Skeleton';
import { formatCurrency, formatPercentage, formatNumber, formatDate } from '@/utils/format';
import ScientificCalculator from './ScientificCalculator';

// Icon mapping for calculators
export const calcIcons: Record<string, any> = {
  scientific: Calculator,
  graphing: TrendingUp,
  mortgage: HomeIcon,
  loan: Percent,
  tax: FileText,
  interest: TrendingUp,
  payment: CreditCard,
  time: Clock,
  'profit-margin': Scale,
  roi: Award,
  percentage: Percent,
  discount: Tag,
  tip: Coins,
  vat: Receipt
};

interface CalculatorCardProps {
  calculator: CalculatorSchema;
  onBack: () => void;
  onNavigateToCalculator: (id: string) => void;
}

export default function CalculatorCard({
  calculator,
  onBack,
  onNavigateToCalculator
}: CalculatorCardProps) {
  const IconComponent = calcIcons[calculator.id] || Percent;
  const { addToast } = useToast();

  // Parameters State
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [results, setResults] = useState<ResultField[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Sync parameters and run initial calculation on mount / calculator swap
  useEffect(() => {
    setIsPageLoading(true);
    const defaultInputs: Record<string, any> = {};
    calculator.inputs.forEach((field) => {
      defaultInputs[field.id] = field.defaultValue;
    });
    setInputs(defaultInputs);
    setErrors({});
    
    try {
      const initialResults = calculate(calculator.id, defaultInputs);
      setResults(initialResults);
    } catch (e) {
      console.error('Initial engine pre-calc failure:', e);
    }

    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [calculator]);

  const handleInputChange = (fieldId: string, value: any) => {
    setInputs((prev) => {
      const updated = {
        ...prev,
        [fieldId]: value
      };
      // For immediate calculations on simple triggers or slider drags, we can auto-trigger calculations
      // but to preserve standard "Calculate" action feedback, we'll keep standard calculate triggers
      return updated;
    });

    // Clear error for that parameter
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  // Shared validation system (No browser defaults)
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    calculator.inputs.forEach((field) => {
      const val = inputs[field.id];

      if (field.type === 'number') {
        if (val === undefined || val === '') {
          newErrors[field.id] = `${field.label} is required.`;
        } else {
          const numVal = Number(val);
          if (isNaN(numVal)) {
            newErrors[field.id] = 'Must be a valid number.';
          } else if (field.min !== undefined && numVal < field.min) {
            newErrors[field.id] = `Cannot be less than ${field.prefix || ''}${field.min}${field.suffix || ''}.`;
          } else if (field.max !== undefined && numVal > field.max) {
            newErrors[field.id] = `Cannot exceed ${field.prefix || ''}${field.max}${field.suffix || ''}.`;
          }
        }
      } else if (field.type === 'date') {
        if (!val) {
          newErrors[field.id] = `${field.label} is required.`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) {
      addToast('Validation failed. Please check your parameters.', 'error');
      return;
    }

    setIsCalculating(true);
    // Simulate minor calculation delay for professional micro-state experience
    setTimeout(() => {
      try {
        const computed = calculate(calculator.id, inputs);
        setResults(computed);
        addToast('Calculation completed successfully!', 'success');
      } catch (err) {
        console.error('Calculation execution failed:', err);
        addToast('Calculation execution failed.', 'error');
      } finally {
        setIsCalculating(false);
      }
    }, 250);
  };

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      const defaultInputs: Record<string, any> = {};
      calculator.inputs.forEach((field) => {
        defaultInputs[field.id] = field.defaultValue;
      });
      setInputs(defaultInputs);
      setErrors({});
      try {
        const initialResults = calculate(calculator.id, defaultInputs);
        setResults(initialResults);
        addToast('Parameters reset to default settings.', 'info');
      } catch (e) {
        console.error(e);
      } finally {
        setIsResetting(false);
      }
    }, 200);
  };

  const handleClear = () => {
    const clearedInputs: Record<string, any> = {};
    calculator.inputs.forEach((field) => {
      if (field.type === 'boolean') {
        clearedInputs[field.id] = false;
      } else if (field.type === 'select') {
        clearedInputs[field.id] = field.options?.[0]?.value || '';
      } else {
        clearedInputs[field.id] = '';
      }
    });
    setInputs(clearedInputs);
    setErrors({});
    setResults([]);
    addToast('Parameters cleared.', 'info');
  };

  // Exclude current calculator and list other ones
  const relatedCalculators = Object.values(calculatorsData)
    .filter((c) => c.id !== calculator.id)
    .slice(0, 4);

  // Specialized unique rendering per calculator ID
  const renderSpecializedLayout = () => {
    if (calculator.id === 'scientific') {
      return <ScientificCalculator />;
    }

    if (results.length === 0) {
      return (
        <div className="lg:col-span-12 bg-white border border-zinc-200 rounded-sm p-8 text-center py-16 space-y-4">
          <div className="w-12 h-12 bg-zinc-50 border border-zinc-200 rounded-sm flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6 text-zinc-300 animate-pulse" />
          </div>
          <p className="text-xs font-semibold text-zinc-400 font-sans max-w-sm mx-auto leading-relaxed">
            Please input configuration parameters and calculate to output metrics.
          </p>
          <button onClick={handleReset} className="px-4 py-2 bg-zinc-950 text-white text-xs font-bold rounded-sm hover:bg-zinc-800 transition-all font-sans cursor-pointer">
            Load Default Parameters
          </button>
        </div>
      );
    }

    const primaryResult = results.find((r) => r.isPrimary);
    const secondaryResults = results.filter((r) => !r.isPrimary);

    const getResultValue = (id: string) => {
      const field = results.find((r) => r.id === id);
      if (!field) return 0;
      return typeof field.value === 'number' ? field.value : Number(field.value) || 0;
    };

    const getResultFormatted = (id: string) => {
      const field = results.find((r) => r.id === id);
      if (!field) return 'N/A';
      const val = field.value;
      if (typeof val === 'string') return val;
      if (field.format === 'currency') return formatCurrency(val, 'USD');
      if (field.format === 'percent') return formatPercentage(val);
      if (field.format === 'number') return (field.prefix || '') + formatNumber(val) + (field.suffix || '');
      return String(val);
    };

    switch (calculator.id) {
      case 'mortgage': {
        const homePrice = Number(inputs.homePrice || 0);
        const downPayment = Number(inputs.downPayment || 0);
        const loanPrincipal = Math.max(0, homePrice - downPayment);
        const totalInterest = getResultValue('totalInterest');
        const totalCost = getResultValue('totalCost');

        const totalSum = loanPrincipal + totalInterest;
        const principalPct = totalSum > 0 ? (loanPrincipal / totalSum) * 100 : 0;
        const interestPct = totalSum > 0 ? (totalInterest / totalSum) * 100 : 0;

        return (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left side: Premium Emerald inputs config */}
            <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6 border-l-4 border-l-emerald-600">
              <div className="border-b border-zinc-100 pb-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-sm font-sans">
                  Mortgage Amortization
                </span>
                <h3 className="text-sm font-bold text-zinc-900 font-heading mt-2">Real Estate Loan Settings</h3>
              </div>

              <div className="space-y-4">
                {calculator.inputs.map((field) => (
                  <div key={field.id} className="relative group">
                    {field.type === 'select' ? (
                      <SelectField
                        field={field}
                        value={inputs[field.id]}
                        onChange={(val) => handleInputChange(field.id, val)}
                        error={errors[field.id]}
                      />
                    ) : (
                      <InputField
                        field={field}
                        value={inputs[field.id]}
                        onChange={(val) => handleInputChange(field.id, val)}
                        error={errors[field.id]}
                      />
                    )}
                  </div>
                ))}
              </div>

              <ActionButtons
                onCalculate={handleCalculate}
                onReset={handleReset}
                onClear={handleClear}
                isCalculating={isCalculating}
                isResetting={isResetting}
              />
            </div>

            {/* Right side: Zillow-style mortgage dashboard */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans">Payment Allocation Dashboard</h3>
                </div>
                <div className="flex space-x-1.5">
                  <button onClick={() => window.print()} className="p-1.5 hover:bg-zinc-50 border border-zinc-200 rounded-sm text-zinc-500 hover:text-zinc-800 transition-all cursor-pointer">
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Big monthly payment display */}
              <div className="bg-emerald-50/20 border border-emerald-600/10 rounded-sm p-5 flex flex-col items-center justify-center text-center space-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 text-emerald-600/10 pointer-events-none">
                  <HomeIcon className="w-16 h-16" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-sans">Estimated Monthly Payment (P&I)</span>
                <span className="text-3xl sm:text-4.5xl font-extrabold text-zinc-950 font-mono tracking-tight">{getResultFormatted('monthlyPayment')}</span>
                <span className="text-[10px] text-zinc-500 font-sans font-medium">Principal & Interest only. Taxes, Insurance escrow excluded.</span>
              </div>

              {/* Principal vs Interest progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-zinc-700 font-sans">
                  <span>Loan Breakdown Ratio</span>
                  <span className="text-zinc-500 font-mono">Principal: {principalPct.toFixed(0)}% vs Interest: {interestPct.toFixed(0)}%</span>
                </div>
                <div className="w-full h-4 bg-zinc-100 rounded-sm overflow-hidden flex border border-zinc-200/50">
                  <div style={{ width: `${principalPct}%` }} className="bg-emerald-600 h-full transition-all duration-300" title="Loan Principal" />
                  <div style={{ width: `${interestPct}%` }} className="bg-zinc-700 h-full transition-all duration-300" title="Total Interest Accrued" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />
                    <span className="text-zinc-600 font-sans">Loan Principal: <strong className="text-zinc-900 font-mono">{formatCurrency(loanPrincipal, 'USD')}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 bg-zinc-700 rounded-full" />
                    <span className="text-zinc-600 font-sans">Lifetime Interest: <strong className="text-zinc-900 font-mono">{formatCurrency(totalInterest, 'USD')}</strong></span>
                  </div>
                </div>
              </div>

              {/* Detail list items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-zinc-100">
                <div className="p-4 bg-zinc-50/50 rounded-sm border border-zinc-200/40 flex flex-col">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Cost over Term</span>
                  <span className="text-lg font-bold text-zinc-900 font-mono mt-1">{getResultFormatted('totalCost')}</span>
                </div>
                <div className="p-4 bg-zinc-50/50 rounded-sm border border-zinc-200/40 flex flex-col">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Filing Schedule Length</span>
                  <span className="text-lg font-bold text-zinc-900 font-mono mt-1">{inputs.loanTerm} Years Fixed</span>
                </div>
              </div>

              <div className="text-[10px] text-zinc-400 font-sans border-t border-zinc-100 pt-3">
                Calculations processed securely inside your browser using Standard Mortgage Amortization Formulas.
              </div>
            </div>
          </div>
        );
      }

      case 'loan': {
        const loanAmount = Number(inputs.loanAmount || 0);
        const totalInterest = getResultValue('totalInterest');
        const totalPayment = getResultValue('totalPayment');
        const ratio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

        return (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Col: Blueprint inputs */}
            <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6 border-l-4 border-l-blue-600">
              <div className="border-b border-zinc-100 pb-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-sm font-sans">
                  Repayment Matrix
                </span>
                <h3 className="text-sm font-bold text-zinc-900 font-heading mt-2">Personal / Auto Loan Configuration</h3>
              </div>

              <div className="space-y-4">
                {calculator.inputs.map((field) => (
                  <div key={field.id}>
                    {field.type === 'select' ? (
                      <SelectField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    ) : (
                      <InputField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    )}
                  </div>
                ))}
              </div>

              <ActionButtons
                onCalculate={handleCalculate}
                onReset={handleReset}
                onClear={handleClear}
                isCalculating={isCalculating}
                isResetting={isResetting}
              />
            </div>

            {/* Right Col: Repayment Ticket */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-zinc-400" />
                  Loan Certificate Voucher
                </h3>
                <span className="text-[10px] text-zinc-400 font-mono uppercase font-semibold">REF: #LCN-{Math.floor(loanAmount / 100)}</span>
              </div>

              {/* Coupon ticket styled payment block */}
              <div className="relative border-2 border-dashed border-zinc-200 bg-zinc-50/50 rounded-sm p-6 flex flex-col items-center justify-center text-center space-y-1">
                {/* Left & Right punch holes for ticket layout */}
                <div className="absolute top-1/2 -left-3.5 -translate-y-1/2 w-7 h-7 bg-[#FAFAFA] border-r-2 border-dashed border-zinc-200 rounded-full" />
                <div className="absolute top-1/2 -right-3.5 -translate-y-1/2 w-7 h-7 bg-[#FAFAFA] border-l-2 border-dashed border-zinc-200 rounded-full" />

                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-sans">Monthly Installment Repayment</span>
                <span className="text-4xl font-extrabold text-blue-600 font-mono tracking-tight">{getResultFormatted('monthlyPayment')}</span>
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mt-2 font-mono">Issued Term: {inputs.loanTerm} Months</span>
              </div>

              {/* Bento Repayment Data Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-zinc-200 rounded-sm flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Base Loan Amount</span>
                  <span className="text-lg font-bold text-zinc-950 font-mono mt-1">{formatCurrency(loanAmount, 'USD')}</span>
                </div>
                <div className="p-4 border border-zinc-200 rounded-sm flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Lifetime Interest Due</span>
                  <span className="text-lg font-bold text-zinc-950 font-mono mt-1">{getResultFormatted('totalInterest')}</span>
                </div>
              </div>

              {/* Interactive Term Summary Card */}
              <div className="p-4 bg-blue-50/10 border border-blue-600/10 rounded-sm flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <Percent className="w-4 h-4 text-blue-600" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 font-sans">Interest Drag Ratio</h4>
                    <p className="text-[10px] text-zinc-500 leading-snug">Interest accounts for {ratio.toFixed(1)}% of total repayments.</p>
                  </div>
                </div>
                <div className="w-16 h-2 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50 shrink-0">
                  <div style={{ width: `${ratio}%` }} className="bg-blue-600 h-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'tax': {
        const annualIncome = Number(inputs.annualIncome || 0);
        const taxableIncome = getResultValue('taxableIncome');
        const taxDue = getResultValue('taxDue');
        const effectiveTaxRate = getResultValue('effectiveTaxRate');
        const takeHomeIncome = getResultValue('takeHomeIncome');

        const brackets = inputs.filingStatus === 'single'
          ? [11600, 47150, 100525, 191950, 243725, 609350]
          : [23200, 94300, 201050, 383900, 487450, 731200];
        const rates = [10, 12, 22, 24, 32, 35, 37];

        return (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Side Inputs config */}
            <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6 border-l-4 border-l-purple-600">
              <div className="border-b border-zinc-100 pb-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-sm font-sans">
                  Tax Compliance
                </span>
                <h3 className="text-sm font-bold text-zinc-900 font-heading mt-2">Federal Income Settings</h3>
              </div>

              <div className="space-y-4">
                {calculator.inputs.map((field) => (
                  <div key={field.id}>
                    {field.type === 'select' ? (
                      <SelectField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    ) : (
                      <InputField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    )}
                  </div>
                ))}
              </div>

              <ActionButtons
                onCalculate={handleCalculate}
                onReset={handleReset}
                onClear={handleClear}
                isCalculating={isCalculating}
                isResetting={isResetting}
              />
            </div>

            {/* Right Side: Tax dashboard with Bracket towers */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6">
              <div className="border-b border-zinc-100 pb-3 flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans flex items-center gap-2">
                  <FileText className="w-4 h-4 text-zinc-400" />
                  Federal Bracket Allocation Dashboard
                </h3>
                <span className="px-2 py-0.5 bg-purple-50 border border-purple-200 text-purple-700 text-[9px] font-bold rounded-sm">2026 Fiscal Code</span>
              </div>

              {/* Bento Income Summary Tiers */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-sm text-center">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Gross Income</span>
                  <span className="text-sm font-bold text-zinc-950 font-mono mt-1 block truncate">{formatCurrency(annualIncome, 'USD')}</span>
                </div>
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-sm text-center">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Taxable Income</span>
                  <span className="text-sm font-bold text-zinc-950 font-mono mt-1 block truncate">{formatCurrency(taxableIncome, 'USD')}</span>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-100 rounded-sm text-center">
                  <span className="text-[9px] font-bold text-purple-800 uppercase tracking-widest block">Est. Federal Tax</span>
                  <span className="text-sm font-bold text-purple-950 font-mono mt-1 block truncate">{formatCurrency(taxDue, 'USD')}</span>
                </div>
              </div>

              {/* Large Effective rate & Take Home displays */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 border border-zinc-200 rounded-sm flex items-center space-x-3 bg-zinc-50/40">
                  <span className="w-10 h-10 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                    {effectiveTaxRate.toFixed(1)}%
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 font-sans">Effective Tax Rate</h4>
                    <p className="text-[10px] text-zinc-400 font-sans">The average tax rate applied to your base income.</p>
                  </div>
                </div>
                <div className="p-4 border border-zinc-200 rounded-sm flex items-center space-x-3 bg-zinc-50/40">
                  <span className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 font-sans">Estimated Take-Home</h4>
                    <p className="text-[10px] text-emerald-600 font-mono font-semibold">{formatCurrency(takeHomeIncome, 'USD')}/yr</p>
                  </div>
                </div>
              </div>

              {/* Tax Brackets Tower Graph */}
              <div className="space-y-3 pt-3 border-t border-zinc-100">
                <h4 className="text-xs font-bold text-zinc-700 font-sans">Interactive Progressive Brackets (Marginal Rates)</h4>
                <div className="grid grid-cols-7 gap-1.5 h-24 items-end bg-zinc-50/50 p-3.5 border border-zinc-200/50 rounded-sm">
                  {rates.map((rate, idx) => {
                    const prevLimit = idx === 0 ? 0 : brackets[idx - 1];
                    const currLimit = idx === brackets.length ? Infinity : brackets[idx];

                    let fillPct = 0;
                    if (taxableIncome > prevLimit) {
                      if (taxableIncome >= currLimit) {
                        fillPct = 100;
                      } else {
                        fillPct = ((taxableIncome - prevLimit) / (currLimit - prevLimit)) * 100;
                      }
                    }

                    return (
                      <div key={idx} className="flex flex-col items-center h-full justify-end group relative cursor-help">
                        {/* Fill Tower */}
                        <div className="w-full bg-zinc-200/60 rounded-sm overflow-hidden h-full flex flex-col justify-end border border-zinc-300/30">
                          <div style={{ height: `${fillPct}%` }} className="bg-purple-600 w-full transition-all duration-300" />
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-1.5 hidden group-hover:block w-32 p-1.5 bg-zinc-900 text-white text-[9px] rounded-sm text-center shadow-md z-10 font-mono">
                          Limit: {currLimit === Infinity ? 'Over' : `$${(currLimit/1000).toFixed(0)}k`}
                          <br />
                          Taxes: {fillPct > 0 ? (fillPct === 100 ? 'Full' : `${fillPct.toFixed(0)}%`) : 'Unreached'}
                        </div>
                        <span className="text-[9px] font-bold text-zinc-400 font-sans mt-1.5">{rate}%</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[9px] text-zinc-400 uppercase font-mono font-semibold">
                  <span>Start Bracket (10%)</span>
                  <span>Highest Bracket (37%)</span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'interest': {
        const principal = Number(inputs.principal || 0);
        const monthlyContribution = Number(inputs.monthlyContribution || 0);
        const interestRate = Number(inputs.interestRate || 0);
        const term = Number(inputs.term || 5);
        const futureValue = getResultValue('futureValue');
        const totalContributions = getResultValue('totalContributions');
        const totalInterest = getResultValue('totalInterest');

        const totalPoints = 6;
        const yearInterval = Math.max(1, term / (totalPoints - 1));
        const rate = interestRate / 100;
        const monthlyRate = rate / 12;

        const chartPoints: { year: number; balance: number }[] = [];
        for (let i = 0; i < totalPoints; i++) {
          const currentYear = Math.round(i * yearInterval);
          if (inputs.interestType === 'simple') {
            const simpleInt = principal * rate * currentYear;
            const contrib = monthlyContribution * 12 * currentYear;
            chartPoints.push({ year: currentYear, balance: principal + simpleInt + contrib });
          } else {
            const totalMonths = currentYear * 12;
            let bal = principal;
            for (let m = 1; m <= totalMonths; m++) {
              bal += monthlyContribution;
              bal += bal * monthlyRate;
            }
            chartPoints.push({ year: currentYear, balance: bal });
          }
        }

        const width = 360;
        const height = 130;
        const padding = 15;
        const maxVal = Math.max(...chartPoints.map((p) => p.balance), 1000);

        const svgCoords = chartPoints.map((p, idx) => {
          const x = padding + (idx / (totalPoints - 1)) * (width - 2 * padding);
          const y = height - padding - (p.balance / maxVal) * (height - 2 * padding);
          return { x, y, year: p.year, balance: p.balance };
        });

        const linePath = svgCoords.map((c, idx) => `${idx === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
        const fillPath = `${linePath} L ${svgCoords[svgCoords.length - 1].x.toFixed(1)} ${(height - padding).toFixed(1)} L ${svgCoords[0].x.toFixed(1)} ${(height - padding).toFixed(1)} Z`;

        return (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Col Inputs */}
            <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6 border-l-4 border-l-emerald-500">
              <div className="border-b border-zinc-100 pb-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-sm font-sans">
                  Wealth Compounder
                </span>
                <h3 className="text-sm font-bold text-zinc-900 font-heading mt-2">Capital Deposit Parameters</h3>
              </div>

              <div className="space-y-4">
                {calculator.inputs.map((field) => (
                  <div key={field.id}>
                    {field.type === 'select' ? (
                      <SelectField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    ) : (
                      <InputField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    )}
                  </div>
                ))}
              </div>

              <ActionButtons
                onCalculate={handleCalculate}
                onReset={handleReset}
                onClear={handleClear}
                isCalculating={isCalculating}
                isResetting={isResetting}
              />
            </div>

            {/* Right Col: Compounded growth path line chart */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6">
              <div className="border-b border-zinc-100 pb-3 flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-zinc-400" />
                  Compounded Yield Map
                </h3>
                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-bold rounded-sm uppercase">Interest Engine</span>
              </div>

              {/* Future value large badge */}
              <div className="bg-zinc-50 border border-zinc-200 p-4.5 rounded-sm text-center flex flex-col space-y-0.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Projected Horizon Capital</span>
                <span className="text-3xl font-extrabold text-emerald-600 font-mono tracking-tight">{getResultFormatted('futureValue')}</span>
                <span className="text-[10px] text-zinc-400 font-sans font-medium">Estimated after {inputs.term} Years at {inputs.interestRate}% annualized.</span>
              </div>

              {/* Area Chart SVG */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-zinc-700 font-sans">
                  <span>Exponential Capital Curve</span>
                  <span className="text-zinc-400 font-mono">Horizon Limit: {formatCurrency(maxVal, 'USD', 0)}</span>
                </div>
                <div className="border border-zinc-200/50 rounded-sm p-3 bg-zinc-50/20 relative">
                  <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e4e4e7" strokeWidth="1.5" />
                    <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="3 3" />
                    <line x1={padding} y1={height/2} x2={width - padding} y2={height/2} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="3 3" />

                    <path d={fillPath} fill="rgba(16,185,129,0.06)" className="transition-all duration-300" />
                    <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300" />

                    {svgCoords.map((c, i) => (
                      <g key={i} className="group/dot cursor-pointer">
                        <circle cx={c.x} cy={c.y} r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" className="transition-all duration-150 hover:scale-150" />
                        <g className="hidden group-hover/dot:block">
                          <rect x={c.x - 35} y={c.y - 25} width="70" height="18" rx="2" fill="#18181b" />
                          <text x={c.x} y={c.y - 13} fill="#ffffff" fontSize="8" textAnchor="middle" fontFamily="monospace">
                            Y{c.year}: ${(c.balance/1000).toFixed(0)}k
                          </text>
                        </g>
                      </g>
                    ))}
                  </svg>
                </div>
                <div className="flex justify-between text-[9px] text-zinc-400 uppercase font-mono font-semibold">
                  <span>Year 0 (Principal)</span>
                  <span>Year {inputs.term} (Maturity Horizon)</span>
                </div>
              </div>

              {/* Split metrics */}
              <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-zinc-300 rounded-full" />
                  <span className="text-xs text-zinc-600 font-sans">Contributions Paid: <strong className="text-zinc-900 font-mono">{getResultFormatted('totalContributions')}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs text-zinc-600 font-sans">Compounded Interest: <strong className="text-zinc-900 font-mono">{getResultFormatted('totalInterest')}</strong></span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'payment': {
        const balance = Number(inputs.balance || 0);
        const totalInterest = getResultValue('totalInterest');
        const totalPayments = getResultValue('totalPayments');
        const isInfinite = results.find(r => r.id === 'resultMonths')?.value?.toString().toLowerCase().includes('infinite');

        return (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Inputs block */}
            <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6 border-l-4 border-l-rose-600">
              <div className="border-b border-zinc-100 pb-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-sm font-sans">
                  Debt Payoff Schedule
                </span>
                <h3 className="text-sm font-bold text-zinc-900 font-heading mt-2">Liability Settings</h3>
              </div>

              <div className="space-y-4">
                {calculator.inputs.map((field) => (
                  <div key={field.id}>
                    {field.type === 'select' ? (
                      <SelectField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    ) : (
                      <InputField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    )}
                  </div>
                ))}
              </div>

              <ActionButtons
                onCalculate={handleCalculate}
                onReset={handleReset}
                onClear={handleClear}
                isCalculating={isCalculating}
                isResetting={isResetting}
              />
            </div>

            {/* Right Results Dashboard */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6">
              <div className="border-b border-zinc-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-zinc-400" />
                  Debt Retirement Ledger
                </h3>
              </div>

              {isInfinite ? (
                <div className="p-5 bg-red-50 border border-red-200 text-red-800 rounded-sm flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold font-sans">Warning: Infinite Payoff Cycle!</h4>
                    <p className="text-xs text-red-600/90 leading-relaxed mt-1 font-sans">
                      The current monthly contribution of {formatCurrency(Number(inputs.monthlyPayment || 0), 'USD')} is below or equal to the accruing monthly APR. The interest accrued is too large to payoff this balance. Increase your payment.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Primary result billboard */}
                  <div className="bg-zinc-50 border border-zinc-200 rounded-sm p-5 text-center flex flex-col space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{primaryResult?.label}</span>
                    <span className="text-3xl font-extrabold text-rose-600 font-mono tracking-tight">{getResultFormatted(primaryResult?.id || '')}</span>
                    <span className="text-[10px] text-zinc-500 font-sans">Required parameter threshold to retire balance of {formatCurrency(balance, 'USD')}.</span>
                  </div>

                  {/* Financial Breakdown cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-zinc-200 rounded-sm flex flex-col">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Initial Credit Balance</span>
                      <span className="text-lg font-bold text-zinc-900 font-mono mt-1">{formatCurrency(balance, 'USD')}</span>
                    </div>
                    <div className="p-4 border border-zinc-200 rounded-sm flex flex-col">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Interest Drag</span>
                      <span className="text-lg font-bold text-zinc-900 font-mono mt-1">{getResultFormatted('totalInterest')}</span>
                    </div>
                  </div>

                  {/* Encouraging target milestone banner */}
                  <div className="p-4 bg-emerald-50/20 border border-emerald-600/10 rounded-sm flex items-center space-x-3.5">
                    <span className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 font-sans">Debt Retirement Pathway</h4>
                      <p className="text-[10px] text-zinc-500 leading-snug">Paying this schedule consistently retires the debt completely and saves lifetime credit penalties.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'time': {
        const calendarDays = results.find(r => r.id === 'calendarDays')?.value || '';
        const businessDays = results.find(r => r.id === 'businessDays')?.value || '';
        const weeks = results.find(r => r.id === 'weeks')?.value || '';
        const targetDate = results.find(r => r.id === 'targetDate')?.value || '';
        const calendarOffset = results.find(r => r.id === 'calendarOffset')?.value || '';
        const mode = inputs.mode || 'difference';

        return (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Inputs block */}
            <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6 border-l-4 border-l-zinc-800">
              <div className="border-b border-zinc-100 pb-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-800 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-sm font-sans">
                  Temporal Calculation
                </span>
                <h3 className="text-sm font-bold text-zinc-900 font-heading mt-2">Calendar Adjustments</h3>
              </div>

              <div className="space-y-4">
                {calculator.inputs.map((field) => (
                  <div key={field.id}>
                    {field.type === 'select' ? (
                      <SelectField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    ) : (
                      <InputField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    )}
                  </div>
                ))}
              </div>

              <ActionButtons
                onCalculate={handleCalculate}
                onReset={handleReset}
                onClear={handleClear}
                isCalculating={isCalculating}
                isResetting={isResetting}
              />
            </div>

            {/* Right Results Dashboard */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6">
              <div className="border-b border-zinc-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  Chronological Span Analysis
                </h3>
              </div>

              {mode === 'difference' ? (
                <div className="space-y-6">
                  {/* Calendar terminal connector graphic */}
                  <div className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-sm text-center">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase">From Start Date</span>
                      <span className="text-xs font-semibold text-zinc-700 mt-1 font-sans">{formatDate(inputs.startDate)}</span>
                    </div>
                    <div className="flex-grow flex items-center px-4 relative">
                      <div className="w-full h-0.5 bg-zinc-200" />
                      <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-950 text-white rounded-full flex items-center justify-center text-[8px] font-mono font-bold">&gt;&gt;</div>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase">To Target Date</span>
                      <span className="text-xs font-semibold text-zinc-700 mt-1 font-sans">{formatDate(inputs.endDate)}</span>
                    </div>
                  </div>

                  {/* Mono cards display */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 border border-zinc-200 rounded-sm text-center">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Calendar Days</span>
                      <span className="text-lg font-bold text-zinc-950 font-mono mt-1.5 block">{String(calendarDays)}</span>
                    </div>
                    <div className="p-4 border border-zinc-200 rounded-sm text-center">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Business Days</span>
                      <span className="text-lg font-bold text-zinc-950 font-mono mt-1.5 block">{String(businessDays)}</span>
                    </div>
                    <div className="p-4 border border-zinc-200 rounded-sm text-center">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Equivalent Weeks</span>
                      <span className="text-lg font-bold text-zinc-950 font-mono mt-1.5 block">{String(weeks)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Single date display */}
                  <div className="bg-zinc-50 border border-zinc-200 rounded-sm p-6 text-center flex flex-col space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Projected Horizon Date</span>
                    <span className="text-2xl font-extrabold text-zinc-950 font-sans tracking-tight">{String(targetDate)}</span>
                    <span className="text-[10px] text-zinc-500 font-sans mt-1">Starting {formatDate(inputs.startDate)} with {String(calendarOffset)}.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'profit-margin': {
        const cost = Number(inputs.cost || 0);
        const sellingPrice = Number(inputs.sellingPrice || 0);
        const grossMargin = getResultValue('grossMargin');
        const grossProfit = getResultValue('grossProfit');
        const markup = getResultValue('markup');
        const calcMode = inputs.calcMode || 'margin';

        const computedSellPrice = calcMode === 'margin' ? sellingPrice : getResultValue('sellingPrice');
        const computedProfit = grossProfit;
        const cogsPct = computedSellPrice > 0 ? (cost / computedSellPrice) * 100 : 0;
        const profitPct = computedSellPrice > 0 ? (computedProfit / computedSellPrice) * 100 : 0;

        return (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Col Inputs */}
            <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6 border-l-4 border-l-amber-600">
              <div className="border-b border-zinc-100 pb-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-sm font-sans">
                  Pricing Matrix
                </span>
                <h3 className="text-sm font-bold text-zinc-900 font-heading mt-2">Retail Cost Sheet</h3>
              </div>

              <div className="space-y-4">
                {calculator.inputs.map((field) => (
                  <div key={field.id}>
                    {field.type === 'select' ? (
                      <SelectField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    ) : (
                      <InputField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    )}
                  </div>
                ))}
              </div>

              <ActionButtons
                onCalculate={handleCalculate}
                onReset={handleReset}
                onClear={handleClear}
                isCalculating={isCalculating}
                isResetting={isResetting}
              />
            </div>

            {/* Right Col Outputs */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6">
              <div className="border-b border-zinc-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans flex items-center gap-2">
                  <Scale className="w-4 h-4 text-zinc-400" />
                  COGS Structure Allocation
                </h3>
              </div>

              {/* Stacked COGS vs Margin bar gauge */}
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs font-semibold text-zinc-700 font-sans">
                  <span>Price Allocation Ratio</span>
                  <span className="text-zinc-500 font-mono">COGS: {cogsPct.toFixed(0)}% vs Profit Margin: {profitPct.toFixed(0)}%</span>
                </div>
                <div className="w-full h-4.5 bg-zinc-100 rounded-sm overflow-hidden flex border border-zinc-200/50">
                  <div style={{ width: `${cogsPct}%` }} className="bg-zinc-700 h-full transition-all" title="Cost of Goods Sold" />
                  <div style={{ width: `${profitPct}%` }} className="bg-amber-500 h-full transition-all" title="Gross Profit Margin" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs pt-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 bg-zinc-700 rounded-full" />
                    <span className="text-zinc-600 font-sans">COGS (Base Cost): <strong className="text-zinc-900 font-mono">{formatCurrency(cost, 'USD')}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                    <span className="text-zinc-600 font-sans">Profit Margin: <strong className="text-zinc-900 font-mono">{formatCurrency(computedProfit, 'USD')}</strong></span>
                  </div>
                </div>
              </div>

              {/* Bento Gross Margin, Profit Earned and Markups */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-zinc-100 pt-5">
                <div className="p-3.5 border border-zinc-200 rounded-sm text-center">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Gross Profit Margin</span>
                  <span className="text-base font-bold text-zinc-950 font-mono mt-1 block">
                    {calcMode === 'margin' ? getResultFormatted('grossMargin') : `${inputs.targetMargin}%`}
                  </span>
                </div>
                <div className="p-3.5 border border-zinc-200 rounded-sm text-center">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Required Markup</span>
                  <span className="text-base font-bold text-zinc-950 font-mono mt-1 block">{getResultFormatted('markup')}</span>
                </div>
                <div className="p-3.5 bg-amber-50/10 border border-amber-600/10 rounded-sm text-center">
                  <span className="text-[9px] font-bold text-amber-800 uppercase tracking-widest block">Target Selling Price</span>
                  <span className="text-base font-bold text-amber-950 font-mono mt-1 block">{getResultFormatted('sellingPrice')}</span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'roi': {
        const invested = Number(inputs.amountInvested || 0);
        const returned = Number(inputs.amountReturned || 0);
        const profit = returned - invested;
        const totalRoi = getResultValue('totalRoi');
        const annualizedRoi = getResultValue('annualizedRoi');
        const multiple = invested > 0 ? (returned / invested).toFixed(2) : '0.00';

        return (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Col Inputs */}
            <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6 border-l-4 border-l-yellow-600">
              <div className="border-b border-zinc-100 pb-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-600 bg-yellow-50 border border-yellow-100 px-2 py-0.5 rounded-sm font-sans">
                  Venture ROI
                </span>
                <h3 className="text-sm font-bold text-zinc-900 font-heading mt-2">Capital Performance</h3>
              </div>

              <div className="space-y-4">
                {calculator.inputs.map((field) => (
                  <div key={field.id}>
                    {field.type === 'select' ? (
                      <SelectField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    ) : (
                      <InputField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    )}
                  </div>
                ))}
              </div>

              <ActionButtons
                onCalculate={handleCalculate}
                onReset={handleReset}
                onClear={handleClear}
                isCalculating={isCalculating}
                isResetting={isResetting}
              />
            </div>

            {/* Right Col outputs */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6">
              <div className="border-b border-zinc-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans flex items-center gap-2">
                  <Award className="w-4 h-4 text-zinc-400" />
                  Equity Investment Return Statement
                </h3>
              </div>

              {/* Capital Multiplier badge */}
              <div className="relative border border-zinc-200 bg-zinc-50 rounded-sm p-5 flex flex-col items-center justify-center text-center space-y-1.5 overflow-hidden">
                <div className="absolute right-0 top-0 p-3 text-zinc-400/10 pointer-events-none">
                  <TrendingUp className="w-16 h-16" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 font-sans">Cash Capital Multiplier</span>
                <span className="text-4xl font-extrabold text-zinc-950 font-mono tracking-tight">{multiple}x</span>
                <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-full flex items-center space-x-1 font-sans">
                  <span>Total Gain: {totalRoi.toFixed(1)}%</span>
                </span>
              </div>

              {/* Net Returns grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-zinc-200 rounded-sm flex items-center justify-between bg-zinc-50/55">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase block tracking-wider">Net Return Profit</span>
                    <span className="text-base font-bold text-zinc-950 font-mono mt-1 block">{formatCurrency(profit, 'USD')}</span>
                  </div>
                  <span className={`p-1.5 rounded-full ${profit >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    <ChevronRight className="w-4 h-4 transform -rotate-45" />
                  </span>
                </div>
                <div className="p-4 border border-zinc-200 rounded-sm flex items-center justify-between bg-zinc-50/55">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase block tracking-wider">Annualized CAGR</span>
                    <span className="text-base font-bold text-zinc-950 font-mono mt-1 block">{annualizedRoi.toFixed(2)}%</span>
                  </div>
                  <span className="p-1.5 rounded-full bg-yellow-50 text-yellow-600">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'percentage': {
        const X = Number(inputs.valueX || 0);
        const Y = Number(inputs.valueY || 0);
        const mode = inputs.mode || 'of_value';

        return (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Split view natural-sentence layout */}
            <div className="lg:col-span-12 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6">
              <div className="border-b border-zinc-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans flex items-center gap-2">
                  <Percent className="w-4 h-4 text-zinc-400" />
                  Natural-Language Equation Assistant
                </h3>
                {/* Segmented Mode Selector Tab-bar */}
                <div className="flex border border-zinc-200 rounded-sm overflow-hidden text-xs bg-zinc-50/30 shrink-0">
                  <button onClick={() => handleInputChange('mode', 'of_value')} className={`px-3 py-1 font-medium font-sans cursor-pointer focus:outline-none transition-all ${mode === 'of_value' ? 'bg-zinc-950 text-white shadow-sm' : 'hover:bg-zinc-100 text-zinc-500'}`}>Percentage Value</button>
                  <button onClick={() => handleInputChange('mode', 'proportion')} className={`px-3 py-1 font-medium font-sans cursor-pointer focus:outline-none transition-all ${mode === 'proportion' ? 'bg-zinc-950 text-white shadow-sm' : 'hover:bg-zinc-100 text-zinc-500'}`}>Proportion Ratio</button>
                  <button onClick={() => handleInputChange('mode', 'change')} className={`px-3 py-1 font-medium font-sans cursor-pointer focus:outline-none transition-all ${mode === 'change' ? 'bg-zinc-950 text-white shadow-sm' : 'hover:bg-zinc-100 text-zinc-500'}`}>Percentage Change</button>
                </div>
              </div>

              {/* Sentence Input Zone */}
              <div className="p-6 bg-zinc-50 rounded-sm border border-zinc-200/60 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-semibold text-zinc-800 text-center sm:text-left">
                {mode === 'of_value' && (
                  <>
                    <span>What is</span>
                    <input type="number" value={X !== undefined ? X : ''} onChange={(e) => handleInputChange('valueX', e.target.value)} className="w-20 px-2 py-1 border border-zinc-300 rounded-sm font-mono text-center text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950" />
                    <span>% of</span>
                    <input type="number" value={Y !== undefined ? Y : ''} onChange={(e) => handleInputChange('valueY', e.target.value)} className="w-28 px-2 py-1 border border-zinc-300 rounded-sm font-mono text-center text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950" />
                    <span>?</span>
                  </>
                )}

                {mode === 'proportion' && (
                  <>
                    <span>What percent of</span>
                    <input type="number" value={Y !== undefined ? Y : ''} onChange={(e) => handleInputChange('valueY', e.target.value)} className="w-28 px-2 py-1 border border-zinc-300 rounded-sm font-mono text-center text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950" />
                    <span>is</span>
                    <input type="number" value={X !== undefined ? X : ''} onChange={(e) => handleInputChange('valueX', e.target.value)} className="w-20 px-2 py-1 border border-zinc-300 rounded-sm font-mono text-center text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950" />
                    <span>?</span>
                  </>
                )}

                {mode === 'change' && (
                  <>
                    <span>What is the percent change from</span>
                    <input type="number" value={X !== undefined ? X : ''} onChange={(e) => handleInputChange('valueX', e.target.value)} className="w-24 px-2 py-1 border border-zinc-300 rounded-sm font-mono text-center text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950" />
                    <span>to</span>
                    <input type="number" value={Y !== undefined ? Y : ''} onChange={(e) => handleInputChange('valueY', e.target.value)} className="w-28 px-2 py-1 border border-zinc-300 rounded-sm font-mono text-center text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950" />
                    <span>?</span>
                  </>
                )}

                <button onClick={handleCalculate} className="px-4 py-1.5 bg-zinc-950 text-white text-xs font-bold rounded-sm hover:bg-zinc-800 transition-all cursor-pointer font-sans shrink-0 sm:ml-4">Calculate</button>
              </div>

              {/* Big Sentence Answer Display */}
              <div className="p-5 border border-zinc-200/60 rounded-sm bg-zinc-50/20 text-center flex flex-col space-y-1 justify-center items-center">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Computed Sentence Result</span>
                <span className="text-3xl font-extrabold text-zinc-950 font-mono tracking-tight mt-1">
                  {primaryResult?.label}: {getResultFormatted(primaryResult?.id || '')}
                </span>
                {secondaryResults.length > 0 && (
                  <span className="text-[10px] text-zinc-500 font-mono pt-1">
                    Secondary factor ({secondaryResults[0].label}): {getResultFormatted(secondaryResults[0].id)}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'discount': {
        const originalPrice = Number(inputs.originalPrice || 0);
        const discountRate = Number(inputs.discountRate || 0);
        const taxRate = Number(inputs.taxRate || 0);
        const savings = getResultValue('savings');
        const taxPaid = getResultValue('taxPaid');
        const finalPrice = getResultValue('finalPrice');

        return (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Col: POS config */}
            <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6 border-l-4 border-l-teal-600">
              <div className="border-b border-zinc-100 pb-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-sm font-sans">
                  Checkout Settings
                </span>
                <h3 className="text-sm font-bold text-zinc-900 font-heading mt-2">Shopping Cart Parameters</h3>
              </div>

              <div className="space-y-4">
                {calculator.inputs.map((field) => (
                  <div key={field.id}>
                    {field.type === 'select' ? (
                      <SelectField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    ) : (
                      <InputField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    )}
                  </div>
                ))}
              </div>

              <ActionButtons
                onCalculate={handleCalculate}
                onReset={handleReset}
                onClear={handleClear}
                isCalculating={isCalculating}
                isResetting={isResetting}
              />
            </div>

            {/* Right Col: Invoice receipt ticket */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 text-teal-600/10 pointer-events-none">
                <ShoppingBag className="w-16 h-16" />
              </div>

              <div className="border-b border-zinc-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans flex items-center gap-2">
                  Checkout Invoice Statement
                </h3>
              </div>

              {/* Shopping Receipt Ticket Slip */}
              <div className="border-t-4 border-b-4 border-dashed border-zinc-200 bg-zinc-50/50 p-6 flex flex-col space-y-3 font-mono text-xs text-zinc-700 relative">
                <div className="text-center font-bold text-zinc-900 uppercase text-sm border-b border-zinc-200 pb-2">
                  STORE TAX RECEIPT
                </div>

                <div className="flex justify-between">
                  <span>Regular Original Price:</span>
                  <span className="font-semibold text-zinc-900">{formatCurrency(originalPrice, 'USD')}</span>
                </div>

                <div className="flex justify-between text-teal-600 font-semibold">
                  <span>Applied Discount (-{discountRate}%):</span>
                  <span>-{formatCurrency(savings, 'USD')}</span>
                </div>

                <div className="flex justify-between text-zinc-500 border-t border-zinc-200/50 pt-2">
                  <span>Pre-Tax Subtotal:</span>
                  <span>{formatCurrency(Math.max(0, originalPrice - savings), 'USD')}</span>
                </div>

                <div className="flex justify-between text-zinc-500">
                  <span>Sales Tax (+{taxRate}%):</span>
                  <span>+{formatCurrency(taxPaid, 'USD')}</span>
                </div>

                <div className="flex justify-between text-sm font-extrabold text-zinc-950 border-t-2 border-zinc-950 pt-3">
                  <span>NET TOTAL DUE:</span>
                  <span>{formatCurrency(finalPrice, 'USD')}</span>
                </div>

                {/* Simulated Barcode */}
                <div className="flex flex-col items-center pt-4 border-t border-zinc-200/50">
                  <div className="w-48 h-8 flex overflow-hidden opacity-80 select-none">
                    {[1, 2, 4, 1, 3, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 1].map((w, idx) => (
                      <div key={idx} style={{ width: `${w * 2}px` }} className={`h-full ${idx % 2 === 0 ? 'bg-zinc-800' : 'bg-transparent'}`} />
                    ))}
                  </div>
                  <span className="text-[8px] text-zinc-400 mt-1 uppercase font-mono tracking-widest">METRIC-POS-VERIFIED-2026</span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'tip': {
        const billAmount = Number(inputs.billAmount || 0);
        const tipPercentage = Number(inputs.tipPercentage || 0);
        const numPeople = Number(inputs.numPeople || 1);
        const tipAmount = getResultValue('tipAmount');
        const grandTotal = getResultValue('grandTotal');
        const share = getResultValue('share');

        const getTipEmoji = () => {
          if (tipPercentage < 12) return { emoji: '😐', label: 'Modest Tip' };
          if (tipPercentage < 18) return { emoji: '🙂', label: 'Friendly Diner' };
          if (tipPercentage < 22) return { emoji: '😄', label: 'Satisfied Diner' };
          return { emoji: '🤩', label: 'Generous Host!' };
        };
        const feedback = getTipEmoji();

        return (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left inputs column */}
            <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6 border-l-4 border-l-amber-500">
              <div className="border-b border-zinc-100 pb-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-sm font-sans">
                  Dine-In Bill Splitter
                </span>
                <h3 className="text-sm font-bold text-zinc-900 font-heading mt-2">Bistro Accounting</h3>
              </div>

              <div className="space-y-4">
                {calculator.inputs.map((field) => (
                  <div key={field.id} className="relative">
                    {field.type === 'select' ? (
                      <SelectField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    ) : (
                      <InputField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    )}
                  </div>
                ))}
              </div>

              {/* Quick tip percentage helper buttons */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-sans block">Quick Tip Presets</span>
                <div className="flex gap-1.5 flex-wrap">
                  {[10, 15, 18, 20, 25].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => handleInputChange('tipPercentage', pct)}
                      className={`px-3 py-1 text-xs font-bold rounded-sm border cursor-pointer focus:outline-none transition-all ${tipPercentage === pct ? 'bg-amber-500 border-amber-500 text-white shadow-2xs' : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <ActionButtons
                onCalculate={handleCalculate}
                onReset={handleReset}
                onClear={handleClear}
                isCalculating={isCalculating}
                isResetting={isResetting}
              />
            </div>

            {/* Right Col display results */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6">
              <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans flex items-center gap-2">
                  Diner Shared Split Voucher
                </h3>
                <span className="text-xs">{feedback.emoji} <strong className="font-semibold text-zinc-800 font-sans">{feedback.label}</strong></span>
              </div>

              {/* Share ticket billboard */}
              <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-sm text-center flex flex-col justify-center items-center space-y-1 relative overflow-hidden">
                <div className="absolute right-0 top-0 p-3 text-amber-500/10 pointer-events-none">
                  <Utensils className="w-16 h-16" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 font-sans">Share cost per diner guest</span>
                <span className="text-4xl font-extrabold text-amber-600 font-mono tracking-tight">{getResultFormatted('share')}</span>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold font-mono">Grand Total split among {numPeople} guests</span>
              </div>

              {/* Bill details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-zinc-200 rounded-sm flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Accrued tip amount</span>
                  <span className="text-lg font-bold text-zinc-950 font-mono mt-1 block">{getResultFormatted('tipAmount')}</span>
                </div>
                <div className="p-4 border border-zinc-200 rounded-sm flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Grand Invoice total</span>
                  <span className="text-lg font-bold text-zinc-950 font-mono mt-1 block">{getResultFormatted('grandTotal')}</span>
                </div>
              </div>

              {/* Guest visual list */}
              <div className="space-y-2 border-t border-zinc-100 pt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-sans block">Split guests seat chart ({numPeople} Guests)</span>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: Math.min(12, numPeople) }).map((_, idx) => (
                    <div key={idx} className="w-7 h-7 bg-zinc-100 border border-zinc-200/60 rounded-full flex items-center justify-center text-zinc-600 text-[10px] font-bold font-mono shadow-2xs hover:bg-amber-100 transition-colors" title={`Guest ${idx + 1}`}>
                      G{idx + 1}
                    </div>
                  ))}
                  {numPeople > 12 && (
                    <div className="w-7 h-7 bg-zinc-950 text-white rounded-full flex items-center justify-center text-[10px] font-mono font-bold">
                      +{numPeople - 12}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'vat': {
        const amount = Number(inputs.amount || 0);
        const vatRate = Number(inputs.vatRate || 0);
        const vatAmount = getResultValue('vatAmount');
        const netAmount = results.find(r => r.id === 'netAmount')?.value || 0;
        const grossAmount = results.find(r => r.id === 'grossAmount')?.value || 0;
        const mode = inputs.mode || 'add';

        return (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Inputs block */}
            <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6 border-l-4 border-l-zinc-700">
              <div className="border-b border-zinc-100 pb-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-800 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-sm font-sans">
                  VAT Fiscal Matrix
                </span>
                <h3 className="text-sm font-bold text-zinc-900 font-heading mt-2">Tax Matrix Settings</h3>
              </div>

              <div className="space-y-4">
                {calculator.inputs.map((field) => (
                  <div key={field.id}>
                    {field.type === 'select' ? (
                      <SelectField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    ) : (
                      <InputField field={field} value={inputs[field.id]} onChange={(val) => handleInputChange(field.id, val)} error={errors[field.id]} />
                    )}
                  </div>
                ))}
              </div>

              <ActionButtons
                onCalculate={handleCalculate}
                onReset={handleReset}
                onClear={handleClear}
                isCalculating={isCalculating}
                isResetting={isResetting}
              />
            </div>

            {/* Right Col Outputs ledger */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-sm p-6 shadow-2xs space-y-6">
              <div className="border-b border-zinc-100 pb-3 flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-zinc-400" />
                  Fiscal Revenue Audit Ledger
                </h3>
                <span className="text-[9px] px-2 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-sm font-mono font-bold">MODE: {mode === 'add' ? 'ADD VAT' : 'EXTRACT VAT'}</span>
              </div>

              {/* Accountant style formal statement */}
              <div className="border border-zinc-200 rounded-sm p-6 bg-zinc-50/50 font-mono text-xs text-zinc-700 space-y-4">
                <div className="text-center font-bold text-zinc-900 uppercase text-sm border-b border-zinc-200 pb-2">
                  TAX AUDIT LEDGER STATEMENT
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between">
                    <span>Net Amount (Excl. VAT):</span>
                    <span className="font-semibold text-zinc-900">{formatCurrency(Number(netAmount), 'USD')}</span>
                  </div>

                  <div className="flex justify-between border-b border-zinc-200/50 pb-2">
                    <span>VAT Tax Charge Rate:</span>
                    <span className="font-semibold text-zinc-900">{vatRate}%</span>
                  </div>

                  <div className="flex justify-between font-semibold">
                    <span>VAT Capital Due:</span>
                    <span>+{formatCurrency(vatAmount, 'USD')}</span>
                  </div>

                  <div className="flex justify-between font-bold text-zinc-950 border-t border-zinc-950 border-b-4 border-double border-zinc-950 py-3 mt-4 text-sm">
                    <span>GROSS TOTAL (Incl. VAT):</span>
                    <span>{formatCurrency(Number(grossAmount), 'USD')}</span>
                  </div>
                </div>

                <div className="text-[9px] text-zinc-400 text-center leading-relaxed pt-2 border-t border-zinc-200/30">
                  Certified VAT computation compliant with international accounting standards.
                </div>
              </div>
            </div>
          </div>
        );
      }

      default: {
        return (
          <>
            {/* Left Side: Parameters Form */}
            <div
              className="lg:col-span-6 bg-white border border-zinc-200 rounded-sm p-5 md:p-6 shadow-2xs flex flex-col space-y-5"
              id="inputs-card-container"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3" id="input-card-header">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans">
                  Configuration Parameters
                </h2>
              </div>

              <div className="space-y-4" id="inputs-fields-list">
                {calculator.inputs.map((field) => (
                  <div key={field.id}>
                    {field.type === 'select' ? (
                      <SelectField
                        field={field}
                        value={inputs[field.id]}
                        onChange={(val) => handleInputChange(field.id, val)}
                        error={errors[field.id]}
                      />
                    ) : (
                      <InputField
                        field={field}
                        value={inputs[field.id]}
                        onChange={(val) => handleInputChange(field.id, val)}
                        error={errors[field.id]}
                      />
                    )}
                  </div>
                ))}
              </div>

              <ActionButtons
                onCalculate={handleCalculate}
                onReset={handleReset}
                onClear={handleClear}
                isCalculating={isCalculating}
                isResetting={isResetting}
              />
            </div>

            {/* Right Side: Results Card */}
            <div className="lg:col-span-6 h-full min-h-[380px] flex flex-col">
              <ResultCard
                results={results}
                inputs={inputs}
                inputConfigs={calculator.inputs}
                calculatorName={calculator.name}
                onReset={handleReset}
                isLoading={isCalculating || isResetting}
              />
            </div>
          </>
        );
      }
    }
  };

  return (
    <div className="py-8 md:py-12 max-w-[95%] w-[95%] mx-auto px-4 print:py-0" id={`calc-engine-${calculator.id}`}>
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1.5 text-[10px] sm:text-[11px] font-sans text-zinc-400 mb-4 print:hidden" id="calculator-breadcrumbs">
        <button onClick={() => window.location.href = '/'} className="hover:text-zinc-950 transition-colors cursor-pointer focus:outline-none">Home</button>
        <span className="text-zinc-300">&gt;</span>
        <span className="text-zinc-500 font-medium">{calculator.category}</span>
        <span className="text-zinc-300">&gt;</span>
        <span className="text-zinc-600 font-semibold truncate max-w-[150px] sm:max-w-none">{calculator.name}</span>
      </nav>

      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-950 mb-6 group font-sans focus:outline-none print:hidden cursor-pointer"
        id="btn-back-to-list"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-1" />
        Back to Home
      </button>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-zinc-200 pb-8 mb-8" id="calculator-hero">
        <div className="space-y-2.5 max-w-2xl" id="hero-left">
          <div className="flex items-center space-x-2.5" id="hero-category">
            <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-800 text-[10px] font-semibold uppercase tracking-wider rounded-sm font-sans border border-zinc-200/50">
              {calculator.category}
            </span>
          </div>
          <h1 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-zinc-900 font-heading flex items-center gap-2">
            <IconComponent className="w-6 h-6 text-zinc-900 shrink-0" />
            {calculator.name}
          </h1>
          <p className="text-sm text-zinc-600 font-sans leading-relaxed">
            {calculator.shortDescription}
          </p>
        </div>
      </div>

      {/* Parameters Config & Results Grid */}
      <div className="mb-12">
        {isPageLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="main-calc-grid">
            <div className="lg:col-span-6">
              <CalculatorCardSkeleton />
            </div>
            <div className="lg:col-span-6 h-full min-h-[380px] flex flex-col">
              <ResultCardSkeleton />
            </div>
          </div>
        ) : (
          renderSpecializedLayout()
        )}
      </div>

      {/* Formula & Case Study Side-by-Side Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12" id="formula-and-example-row">
        <FormulaSection formula={calculator.formula} />
        <ExampleSection example={calculator.example} />
      </div>

      {/* Interactive Q&A (FAQ Accordion) */}
      <FAQSection faqs={calculator.faqs} />

      {/* Related System Directory Links */}
      <div className="border-t border-zinc-200 pt-10 print:hidden" id="related-section">
        <div className="flex items-center justify-between mb-6" id="related-header">
          <h2 className="text-sm font-bold text-zinc-900 font-heading uppercase tracking-wider text-zinc-400">
            Related Calculators
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="related-grid">
          {relatedCalculators.map((rel) => {
            const RelIcon = calcIcons[rel.id] || Percent;
            return (
              <button
                key={rel.id}
                onClick={() => onNavigateToCalculator(rel.id)}
                className="w-full text-left bg-white border border-zinc-200 p-4 rounded-sm hover:shadow-2xs transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-zinc-950/10 cursor-pointer flex flex-col justify-between h-40"
                id={`related-card-${rel.id}`}
              >
                <div className="space-y-1.5" id={`related-content-${rel.id}`}>
                  <RelIcon className="w-5 h-5 text-zinc-400" />
                  <h3 className="text-xs font-bold text-zinc-900 font-heading line-clamp-1">
                    {rel.name}
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-sans line-clamp-2 leading-relaxed">
                    {rel.shortDescription}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-wider font-sans mt-2 block">
                  Open Calculator →
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
