import { useQuery } from '@tanstack/react-query';
import { getCryptoDetails } from '../services/cryptoApi';

export function useCryptoDetails(id) {
  return useQuery({
    queryKey: ['cryptoDetails', id],
    queryFn: () => getCryptoDetails(id),
    enabled: !!id,
    staleTime: 60000, // Consider data stale after 1 minute
    cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
} 