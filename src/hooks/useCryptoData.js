import { useQuery } from '@tanstack/react-query';
import { getMarketData, getTopCryptos, getCryptoChart } from '../services/cryptoApi';

export function useMarketData() {
  return useQuery({
    queryKey: ['marketData'],
    queryFn: getMarketData,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}

export function useTopCryptos(limit = 20) {
  return useQuery({
    queryKey: ['topCryptos', limit],
    queryFn: () => getTopCryptos(limit),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  });
}

export function useCryptoChart(id, timeRange = '24h', retryKey = 0) {
  return useQuery({
    queryKey: ['cryptoChart', id, timeRange, retryKey],
    queryFn: () => getCryptoChart(id, timeRange),
    refetchInterval: timeRange === '1h' ? 30000 : 60000, // Refetch more frequently for shorter time ranges
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 30000),
    staleTime: timeRange === '1h' ? 15000 : 30000, // Data becomes stale faster for shorter time ranges
    cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: timeRange === '1h' || timeRange === '24h', // Only refetch on window focus for short time ranges
  });
}

// Utility function to format large numbers
export const formatNumber = (num) => {
  if (!num) return '$0.00';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toFixed(2)}`;
};

// Utility function to format percentage changes
export const formatPercentage = (num) => {
  if (!num) return '0.00%';
  return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
}; 