import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMarketData, useTopCryptos, formatNumber, formatPercentage } from '../hooks/useCryptoData';
import CryptoChart from '../components/CryptoChart';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState('24h');
  const { data: marketData, isLoading: isLoadingMarket } = useMarketData();
  const { data: topCryptos, isLoading: isLoadingCryptos } = useTopCryptos(20);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Market Overview Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          variants={itemVariants}
          className="p-6 bg-dark-card rounded-xl border border-dark-border shadow-lg hover:shadow-glow transition-shadow duration-300"
        >
          <h2 className="text-lg font-semibold mb-2 text-gray-300">Market Cap</h2>
          <p className="text-3xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
            {isLoadingMarket ? 'Loading...' : formatNumber(marketData?.total_market_cap?.usd || 0)}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="p-6 bg-dark-card rounded-xl border border-dark-border shadow-lg hover:shadow-glow transition-shadow duration-300"
        >
          <h2 className="text-lg font-semibold mb-2 text-gray-300">24h Volume</h2>
          <p className="text-3xl font-bold bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent">
            {isLoadingMarket ? 'Loading...' : formatNumber(marketData?.total_volume?.usd || 0)}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="p-6 bg-dark-card rounded-xl border border-dark-border shadow-lg hover:shadow-glow transition-shadow duration-300"
        >
          <h2 className="text-lg font-semibold mb-2 text-gray-300">BTC Dominance</h2>
          <p className="text-3xl font-bold bg-gradient-to-r from-accent-yellow to-accent-red bg-clip-text text-transparent">
            {isLoadingMarket ? 'Loading...' : `${marketData?.market_cap_percentage?.btc.toFixed(1)}%`}
          </p>
        </motion.div>
      </section>

      {/* Chart Section */}
      <motion.section
        variants={itemVariants}
        className="bg-dark-card p-6 rounded-xl border border-dark-border shadow-lg"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
            Bitcoin Price
          </h2>
          <div className="flex flex-wrap gap-2">
            {['1h', '24h', '7d', '30d', '1y'].map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeFilter === filter
                    ? 'bg-accent-blue text-white shadow-glow'
                    : 'bg-dark-hover text-gray-400 hover:text-white'
                }`}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </div>
        <CryptoChart cryptoId="bitcoin" timeFilter={timeFilter} />
      </motion.section>

      {/* Top Cryptocurrencies Section */}
      <motion.section
        variants={itemVariants}
        className="bg-dark-card p-6 rounded-xl border border-dark-border shadow-lg"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent mb-6">
          Top Cryptocurrencies
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">#</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Name</th>
                <th className="text-right py-4 px-4 text-gray-400 font-medium">Price</th>
                <th className="text-right py-4 px-4 text-gray-400 font-medium">24h %</th>
                <th className="text-right py-4 px-4 text-gray-400 font-medium">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingCryptos ? (
                <tr>
                  <td colSpan="5" className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-2 h-2 bg-accent-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </td>
                </tr>
              ) : (
                topCryptos?.map((crypto, index) => (
                  <motion.tr
                    key={crypto.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-dark-border hover:bg-dark-hover transition-colors duration-200"
                  >
                    <td className="py-4 px-4 text-gray-300">{index + 1}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="relative">
                          <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                          <div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-purple opacity-0 hover:opacity-20 rounded-full transition-opacity duration-200" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-white">{crypto.name}</p>
                          <p className="text-sm text-gray-400">{crypto.symbol.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 font-medium text-white">
                      {formatNumber(crypto.current_price)}
                    </td>
                    <td className={`text-right py-4 px-4 font-medium ${
                      crypto.price_change_percentage_24h > 0 ? 'text-accent-green' : 'text-accent-red'
                    }`}>
                      {formatPercentage(crypto.price_change_percentage_24h)}
                    </td>
                    <td className="text-right py-4 px-4 font-medium text-white">
                      {formatNumber(crypto.market_cap)}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.section>
    </motion.div>
  );
} 