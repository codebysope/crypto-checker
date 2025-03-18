import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-dark-bg text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="fixed inset-0 bg-dark-grid bg-[size:20px_20px] opacity-5 pointer-events-none" />
      <nav className="fixed top-0 w-full bg-dark-card/80 backdrop-blur-xl border-b border-dark-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple animate-glow" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                  CryptoVision
                </h1>
              </motion.div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-dark-hover text-accent-yellow hover:text-accent-blue transition-colors duration-200"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isDarkMode ? 'dark' : 'light'}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-xl"
                  >
                    {isDarkMode ? '🌞' : '🌙'}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="bg-dark-card/80 backdrop-blur-xl border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-400">
            Data provided by{' '}
            <a
              href="https://www.coingecko.com/en/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue hover:text-accent-purple transition-colors duration-200"
            >
              CoinGecko API
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
} 