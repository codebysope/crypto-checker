import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

const api = axios.create({
  baseURL: COINGECKO_API_URL,
  timeout: 10000,
});

export const getMarketData = async () => {
  const response = await api.get('/global');
  return response.data.data;
};

export const getTopCryptos = async (limit = 20) => {
  const response = await api.get('/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: limit,
      page: 1,
      sparkline: false,
    },
  });
  return response.data;
};

export const getCryptoChart = async (id, days = 1) => {
  const response = await api.get(`/coins/${id}/market_chart`, {
    params: {
      vs_currency: 'usd',
      days,
    },
  });
  return response.data;
};

export const getCryptoNews = async () => {
  // Note: You'll need to sign up for a news API service
  // This is a placeholder that would need to be implemented with your chosen news API
  return [];
}; 