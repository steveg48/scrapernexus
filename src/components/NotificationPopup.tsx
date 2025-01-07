'use client';

import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export default function NotificationPopup({ isOpen, onClose, onSubscribe }: NotificationPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-6 w-6 text-[#3c8dd5]" />
          <h2 className="text-xl font-semibold">Get instant job alerts</h2>
        </div>
        
        <ul className="list-none space-y-2 text-left mb-6">
          <li>• 30 days of priority job alerts</li>
          <li>• Personalized based on your previous proposals</li>
          <li>• Sent by email, mobile app, and right here on the platform</li>
        </ul>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
          >
            Maybe later
          </button>
          <button
            onClick={onSubscribe}
            className="flex-1 px-4 py-2 bg-[#14a800] text-white rounded-full hover:bg-[#14a800]/90"
          >
            Try it now
          </button>
        </div>
      </div>
    </div>
  );
}
