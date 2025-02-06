import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Welcome to Card Generator</h2>
          <button
            onClick={handleDismiss}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>
        <div className="prose dark:prose-invert">
          <p className="text-gray-600 dark:text-gray-300">
            This application helps you generate valid debit card numbers for testing purposes.
            Simply specify the quantity of cards you need, and download them in a pipe-separated format.
          </p>
          <div className="text-gray-600 dark:text-gray-300 mt-2">
            <p className="mb-2">All generated cards:</p>
            <ul className="list-disc ml-6">
              <li>Start with prefix 465861</li>
              <li>Have expiry date 12/2030</li>
              <li>Have CVV 123</li>
              <li>Are validated using the Luhn algorithm</li>
            </ul>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}