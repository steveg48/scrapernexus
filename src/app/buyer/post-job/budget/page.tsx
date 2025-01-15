'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Tag, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { getJobPostingStore } from '@/lib/jobPostingStore';

export default function BudgetPage() {
  const [budgetType, setBudgetType] = useState<'hourly' | 'fixed' | null>(null);
  const [fromRate, setFromRate] = useState<string>('15.00');
  const [toRate, setToRate] = useState<string>('35.00');
  const [fixedRate, setFixedRate] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const store = getJobPostingStore();
    const storedBudget = store.getField<{
      type: 'hourly' | 'fixed' | null;
      fromRate?: string;
      toRate?: string;
      fixedRate?: string;
    }>('budget');

    if (storedBudget) {
      setBudgetType(storedBudget.type || null);
      setFromRate(storedBudget.fromRate || '15.00');
      setToRate(storedBudget.toRate || '35.00');
      setFixedRate(storedBudget.fixedRate || '0');
    }
    setIsLoading(false);
  }, []);

  const formatNumber = (value: string) => {
    // Remove any non-digit characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    // Parse the number and format with commas
    const number = parseFloat(cleanValue);
    if (isNaN(number)) return '0';
    return number.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    });
  };

  const handleFixedRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumber(e.target.value);
    setFixedRate(formattedValue);
  };

  const handleFromRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumber(e.target.value);
    setFromRate(formattedValue);
  };

  const handleToRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumber(e.target.value);
    setToRate(formattedValue);
  };

  const handleNext = () => {
    if (budgetType === 'hourly' && fromRate && toRate) {
      const store = getJobPostingStore();
      store.saveField('budget', {
        type: budgetType,
        fromRate: fromRate.replace(/,/g, ''),
        toRate: toRate.replace(/,/g, '')
      });
      router.push('/buyer/post-job/skills');
    } else if (budgetType === 'fixed' && fixedRate) {
      const store = getJobPostingStore();
      store.saveField('budget', {
        type: budgetType,
        fixedRate: fixedRate.replace(/,/g, '')
      });
      router.push('/buyer/post-job/skills');
    }
  };

  const handleBudgetTypeChange = (type: 'hourly' | 'fixed') => {
    setBudgetType(type);
    // Reset rates when switching types
    if (type === 'hourly') {
      setFixedRate('0');
    } else {
      setFromRate('15.00');
      setToRate('35.00');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Progress indicator */}
          <div className="mb-8">
            <p className="text-sm text-gray-600">5/6 Job post</p>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold text-gray-900">
              Tell us about your budget.
            </h1>
            
            <p className="text-gray-600">
              This will help us match you to talent within your range.
            </p>

            {/* Budget type selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Hourly rate option */}
              <button
                onClick={() => handleBudgetTypeChange('hourly')}
                className={`p-6 rounded-xl border ${
                  budgetType === 'hourly'
                    ? 'border-custom-green ring-1 ring-custom-green'
                    : 'border-gray-200 hover:border-gray-300'
                } text-left relative group transition-all`}
              >
                <div className="absolute right-4 top-4">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    budgetType === 'hourly'
                      ? 'border-custom-green'
                      : 'border-gray-300'
                  }`}>
                    {budgetType === 'hourly' && (
                      <div className="w-4 h-4 bg-custom-green rounded-full" />
                    )}
                  </div>
                </div>
                
                <Clock className="h-6 w-6 text-gray-900 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900">Hourly rate</h2>
              </button>

              {/* Fixed price option */}
              <button
                onClick={() => handleBudgetTypeChange('fixed')}
                className={`p-6 rounded-xl border ${
                  budgetType === 'fixed'
                    ? 'border-custom-green ring-1 ring-custom-green'
                    : 'border-gray-200 hover:border-gray-300'
                } text-left relative group transition-all`}
              >
                <div className="absolute right-4 top-4">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    budgetType === 'fixed'
                      ? 'border-custom-green'
                      : 'border-gray-300'
                  }`}>
                    {budgetType === 'fixed' && (
                      <div className="w-4 h-4 bg-custom-green rounded-full" />
                    )}
                  </div>
                </div>
                
                <Tag className="h-6 w-6 text-gray-900 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900">Fixed price</h2>
              </button>
            </div>

            {/* Rate inputs - only show for hourly */}
            {budgetType === 'hourly' && (
              <div className="space-y-6">
                <div className="flex items-center gap-8">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From
                    </label>
                    <div className="relative rounded-md">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="text"
                        value={fromRate}
                        onChange={handleFromRateChange}
                        className="block w-full pl-7 pr-12 py-2 rounded-md border-gray-200 focus:ring-custom-green focus:border-custom-green text-right"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">/hr</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To
                    </label>
                    <div className="relative rounded-md">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="text"
                        value={toRate}
                        onChange={handleToRateChange}
                        className="block w-full pl-7 pr-12 py-2 rounded-md border-gray-200 focus:ring-custom-green focus:border-custom-green text-right"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">/hr</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  This is the average rate for similar projects.
                </p>

                <p className="text-gray-600">
                  Professionals tend to charge <span className="text-gray-900">$15 - $35</span>/hour (USD) for graphic design projects like yours. Experts may charge higher rates.
                </p>
              </div>
            )}

            {/* Fixed price inputs */}
            {budgetType === 'fixed' && (
              <div className="space-y-6">
                <p className="text-gray-600">
                  Set a price for the project and pay at the end, or you can divide the project into milestones and pay as each milestone is completed.
                </p>

                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    What is the best cost estimate for your project?
                  </h2>
                  <p className="text-gray-600 mb-4">
                    You can negotiate this cost and create milestones when you chat with your freelancer.
                  </p>
                  
                  <div className="relative rounded-md w-48">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="text"
                      value={fixedRate}
                      onChange={handleFixedRateChange}
                      className="block w-full pl-7 pr-4 py-2 rounded-md border-gray-200 focus:ring-custom-green focus:border-custom-green text-right"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <button className="text-custom-green hover:text-custom-green/90 font-medium">
                    Not ready to set a budget?
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={handleNext}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                (budgetType === 'hourly' && fromRate && toRate) || 
                (budgetType === 'fixed' && fixedRate !== '0')
                  ? 'bg-custom-green hover:bg-custom-green/90 text-white cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next: Description
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
