'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  const router = useRouter();
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    // Show icon after text appears
    const iconTimer = setTimeout(() => {
      setShowIcon(true);
    }, 300);

    // Redirect after 4 seconds
    const redirectTimer = setTimeout(() => {
      router.push('/buyer/suggested');
    }, 4000);

    return () => {
      clearTimeout(iconTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className={`h-16 mb-8 transition-opacity duration-500 ${showIcon ? 'opacity-100' : 'opacity-0'}`}>
          <CheckCircle className="h-20 w-20 text-custom-green mx-auto" />
        </div>
        <h1 className="text-4xl font-semibold text-gray-900 mb-4 animate-fade-in">
          Congratulations!
        </h1>
        <p className="text-xl text-gray-600 animate-fade-in">
          Your job has successfully been posted
        </p>
      </div>
    </div>
  );
}
