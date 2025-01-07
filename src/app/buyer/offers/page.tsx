'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Mock function to check for pending offers - replace with actual API call
const checkPendingOffers = async () => {
  // TODO: Replace with actual API call to check pending offers
  return false; // For now, always return false to demonstrate redirection
};

export default function PendingOffersPage() {
  const router = useRouter();

  useEffect(() => {
    const checkOffers = async () => {
      const hasPendingOffers = await checkPendingOffers();
      if (!hasPendingOffers) {
        router.push('/buyer/jobs');
      }
    };

    checkOffers();
  }, [router]);

  // Return null or loading state since this page will redirect if there are no offers
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Checking pending offers...</h1>
      </div>
    </div>
  );
}
