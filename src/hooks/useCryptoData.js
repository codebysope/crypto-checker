import { useQuery } from '@tanstack/react-query';
import { getMarketData, getTopCryptos, getCryptoChart } from '../services/cryptoApi';

export function useMarketData() {
  return useQuery({
    queryKey: ['marketData'],
    queryFn: getMarketData,
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useTopCryptos(limit = 20) {
  return useQuery({
    queryKey: ['topCryptos', limit],
    queryFn: () => getTopCryptos(limit),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useCryptoChart(id, days = 1) {
  return useQuery({
    queryKey: ['cryptoChart', id, days],
    queryFn: () => getCryptoChart(id, days),
    refetchInterval: 60000, // Refetch every minute
  });
}

// Utility function to format large numbers
export const formatNumber = (num) => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toFixed(2)}`;
};

// Utility function to format percentage changes
export const formatPercentage = (num) => {
  return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
}; 