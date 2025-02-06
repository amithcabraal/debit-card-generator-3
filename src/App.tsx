import React, { useState } from 'react';
import { generateCardNumber } from './utils/luhn';
import { Header } from './components/Header';
import { WelcomeModal } from './components/WelcomeModal';
import { ThemeProvider } from './components/ThemeProvider';
import { Download, AlertCircle } from 'lucide-react';

function App() {
  const [quantity, setQuantity] = useState<number>(1);
  const [prefix, setPrefix] = useState<string>('465861');
  const [expiryMonth, setExpiryMonth] = useState<string>('12');
  const [expiryYear, setExpiryYear] = useState<string>('2030');
  const [cvv, setCvv] = useState<string>('123');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>('');

  const validateInputs = () => {
    if (!/^\d{6}$/.test(prefix)) {
      setError('Prefix must be exactly 6 digits');
      return false;
    }
    if (!/^\d{2}$/.test(expiryMonth) || parseInt(expiryMonth) < 1 || parseInt(expiryMonth) > 12) {
      setError('Expiry month must be between 01 and 12');
      return false;
    }
    if (!/^\d{4}$/.test(expiryYear)) {
      setError('Expiry year must be a 4-digit year');
      return false;
    }
    if (!/^\d{3}$/.test(cvv)) {
      setError('CVV must be exactly 3 digits');
      return false;
    }
    setError('');
    return true;
  };

  const generateCards = () => {
    if (!validateInputs()) return;

    setIsGenerating(true);
    setProgress(0);
    const cards = new Set<string>();
    const maxAttempts = quantity * 10; // Prevent infinite loops
    let attempts = 0;
    
    while (cards.size < quantity && attempts < maxAttempts) {
      const cardNumber = generateCardNumber(prefix);
      cards.add(cardNumber);
      attempts++;
      
      // Update progress based on unique cards generated
      const currentProgress = Math.min(99, Math.floor((cards.size / quantity) * 100));
      setProgress(currentProgress);
    }

    if (cards.size < quantity) {
      setError(`Could only generate ${cards.size} unique numbers. Try a different prefix.`);
      setIsGenerating(false);
      setProgress(0);
      return;
    }

    const cardLines = Array.from(cards).map((cardNumber, index) => {
      const lineNumber = (index + 1).toString().padStart(7, '0');
      return `${lineNumber}|${cardNumber}|${expiryMonth}|${expiryYear}|${cvv}`;
    });
    
    const blob = new Blob([cardLines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_cards.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setProgress(100);
    setTimeout(() => {
      setIsGenerating(false);
      setProgress(0);
    }, 500);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <WelcomeModal />
        
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Generate Unique Debit Card Numbers
            </h2>
            
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-center">
                    <AlertCircle className="text-red-500 mr-2" size={20} />
                    <p className="text-red-700 dark:text-red-200">{error}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Number of Cards to Generate
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max="1000000"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(1000000, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label htmlFor="prefix" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Card Prefix (6 digits)
                  </label>
                  <input
                    type="text"
                    id="prefix"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="465861"
                    className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Expiry Month (MM)
                  </label>
                  <input
                    type="text"
                    id="expiryMonth"
                    value={expiryMonth}
                    onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                    placeholder="12"
                    className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Expiry Year (YYYY)
                  </label>
                  <input
                    type="text"
                    id="expiryYear"
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="2030"
                    className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    CVV (3 digits)
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="123"
                    className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    disabled={isGenerating}
                  />
                </div>
              </div>

              {isGenerating && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              <button
                onClick={generateCards}
                disabled={isGenerating}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Download className="mr-2" size={20} />
                {isGenerating ? `Generating (${progress}%)...` : 'Generate and Download'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;