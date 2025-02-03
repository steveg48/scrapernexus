'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getJobPostingStore } from '@/lib/jobPostingStore';
import { ArrowLeft } from 'lucide-react';

export default function BudgetPage() {
  const router = useRouter();
  const [budgetType, setBudgetType] = useState<'hourly' | 'fixed'>('fixed');
  const [fromRate, setFromRate] = useState('');
  const [toRate, setToRate] = useState('');
  const [fixedRate, setFixedRate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializePage = async () => {
      try {
        const store = getJobPostingStore();
        await store.initialize();
        const savedBudget = await store.getField<any>('budget');
        if (savedBudget) {
          setBudgetType(savedBudget.type);
          if (savedBudget.type === 'hourly') {
            setFromRate(savedBudget.fromRate);
            setToRate(savedBudget.toRate);
          } else {
            setFixedRate(savedBudget.fixedRate);
          }
        }
      } catch (error) {
        console.error('Error loading budget:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, []);

  const handleNext = async () => {
    try {
      const store = getJobPostingStore();
      await store.initialize();

      if (budgetType === 'hourly' && fromRate && toRate) {
        await store.saveField('budget', {
          type: budgetType,
          fromRate: fromRate.replace(/,/g, ''),
          toRate: toRate.replace(/,/g, '')
        });
      } else if (budgetType === 'fixed' && fixedRate) {
        await store.saveField('budget', {
          type: budgetType,
          fixedRate: fixedRate.replace(/,/g, '')
        });
      }
      router.push('/buyer/post-job/skills');
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const formatCurrency = (value: string) => {
    // Remove any non-digit characters
    const digits = value.replace(/\D/g, '');
    // Format with commas
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleCurrencyInput = (value: string, setter: (value: string) => void) => {
    setter(formatCurrency(value));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Progress indicator */}
          <div className="mb-8 text-gray-500">
            3/5 • Job post
          </div>

          <div className="grid grid-cols-2 gap-12 relative">
            {/* Left Column */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                Tell us about your budget
              </h1>
              <p className="text-gray-600">
                This will help us match you with talent that fits your budget.
                You can always negotiate with freelancers later.
              </p>
            </div>

            {/* Right Column */}
            <div>
              <div className="space-y-6">
                {/* Budget Type Selection */}
                <div className="space-y-4">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      budgetType === 'hourly'
                        ? 'border-custom-green bg-custom-green/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setBudgetType('hourly')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-gray-900 font-medium">Pay by the hour</h3>
                        <p className="text-sm text-gray-500">Pay hourly for ongoing work</p>
                      </div>
                      <div className="h-4 w-4 border border-gray-300 rounded-full flex items-center justify-center">
                        {budgetType === 'hourly' && (
                          <div className="h-2 w-2 bg-custom-green rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      budgetType === 'fixed'
                        ? 'border-custom-green bg-custom-green/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setBudgetType('fixed')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-gray-900 font-medium">Pay a fixed price</h3>
                        <p className="text-sm text-gray-500">Pay a fixed price for the entire project</p>
                      </div>
                      <div className="h-4 w-4 border border-gray-300 rounded-full flex items-center justify-center">
                        {budgetType === 'fixed' && (
                          <div className="h-2 w-2 bg-custom-green rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget
                  </label>
                  {budgetType === 'hourly' ? (
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                          type="text"
                          value={fromRate}
                          onChange={(e) => handleCurrencyInput(e.target.value, setFromRate)}
                          className="pl-7 pr-3 py-2 w-full border border-gray-200 rounded-lg focus:ring-custom-green focus:border-custom-green"
                          placeholder="From"
                        />
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                          type="text"
                          value={toRate}
                          onChange={(e) => handleCurrencyInput(e.target.value, setToRate)}
                          className="pl-7 pr-3 py-2 w-full border border-gray-200 rounded-lg focus:ring-custom-green focus:border-custom-green"
                          placeholder="To"
                        />
                      </div>
                      <span className="text-gray-500">/hr</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="text"
                        value={fixedRate}
                        onChange={(e) => handleCurrencyInput(e.target.value, setFixedRate)}
                        className="pl-7 pr-3 py-2 w-full border border-gray-200 rounded-lg focus:ring-custom-green focus:border-custom-green"
                        placeholder="Enter amount"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => router.push('/buyer/post-job/description')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={
                budgetType === 'hourly'
                  ? !fromRate || !toRate
                  : !fixedRate
              }
              className={`px-6 py-2 text-sm font-medium rounded-md ${
                (budgetType === 'hourly' && fromRate && toRate) ||
                (budgetType === 'fixed' && fixedRate)
                  ? 'bg-custom-green text-white hover:bg-custom-green/90'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
