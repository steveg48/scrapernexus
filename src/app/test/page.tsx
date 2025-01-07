'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';

export default function TestPage() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {showPopup && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowPopup(false)} />
          
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Test Popup</h2>
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          console.log('Opening popup');
          setShowPopup(true);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Open Popup
      </button>
    </div>
  );
}
