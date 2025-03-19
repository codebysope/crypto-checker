import axios from 'axios';

const COINGECKO_API_URL = import.meta.env.VITE_COINGECKO_API_URL;
const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
const CRYPTOCOMPARE_API_KEY = import.meta.env.VITE_CRYPTOCOMPARE_API_KEY;
const CRYPTOCOMPARE_API_URL = import.meta.env.VITE_CRYPTOCOMPARE_API_URL;

// Create axios instance for CoinGecko API
const cryptoApi = axios.create({
  baseURL: COINGECKO_API_URL,
  timeout: 10000,
  headers: {
    'x-cg-demo-api-key': COINGECKO_API_KEY
  }
});

// Create axios instance for CryptoCompare API
const cryptoCompareApi = axios.create({
  baseURL: CRYPTOCOMPARE_API_URL,
  timeout: 10000,
  params: {
    api_key: CRYPTOCOMPARE_API_KEY
  }
});

// Helper function for retrying API calls with exponential backoff
const retryApiCall = async (apiCall, maxRetries = 3) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await apiCall();
    } catch (error) {
      retries++;
      if (retries === maxRetries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
    }
  }
};

export const getMarketData = async () => {
  try {
    // Get global market data
    const globalData = await retryApiCall(() => 
      cryptoApi.get('/global')
    );

    // Get Bitcoin data
    const btcData = await retryApiCall(() => 
      cryptoApi.get('/simple/price', {
        params: {
          ids: 'bitcoin',
          vs_currencies: 'usd',
          include_24hr_vol: true,
          include_market_cap: true
        }
      })
    );

    return {
      total_market_cap: { usd: globalData.data.data.total_market_cap.usd },
      total_volume: { usd: globalData.data.data.total_volume.usd },
      btc_price: btcData.data.bitcoin.usd,
      market_cap_percentage: {
        btc: globalData.data.data.market_cap_percentage.btc
      }
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw new Error('Failed to fetch market data');
  }
};

export const getTopCryptos = async (limit = 20) => {
  try {
    const response = await retryApiCall(() => 
      cryptoApi.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h'
        }
      })
    );

    return response.data.map(coin => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      volume_24h: coin.total_volume,
      high_24h: coin.high_24h,
      low_24h: coin.low_24h,
    }));
  } catch (error) {
    console.error('Error fetching top cryptos:', error);
    throw new Error('Failed to fetch top cryptocurrencies');
  }
};

export const getCryptoChart = async (symbol, interval = '24h') => {
  try {
    const intervalMap = {
      '1h': { days: 1, interval: 'minutely' },
      '24h': { days: 1, interval: 'hourly' },
      '7d': { days: 7, interval: 'hourly' },
      '30d': { days: 30, interval: 'daily' },
      '1y': { days: 365, interval: 'daily' }
    };

    const { days } = intervalMap[interval];
    
    const response = await retryApiCall(() => 
      cryptoApi.get(`/coins/${symbol}/ohlc`, {
        params: {
          vs_currency: 'usd',
          days
        }
      })
    );

    const data = response.data;
    
    return {
      prices: data.map(item => ({
        timestamp: item[0], // timestamp
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4],
        volume: 0 // CoinGecko OHLC endpoint doesn't provide volume data
      })),
      volumes: data.map(item => ({
        timestamp: item[0],
        volume: 0,
        quoteVolume: 0
      }))
    };
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw new Error(`Failed to fetch chart data: ${error.message}`);
  }
};

// News categories
const newsCategories = {
  ALL: 'all',
  TRADING: 'Trading',
  TECHNOLOGY: 'Technology',
  REGULATION: 'Regulation',
  MINING: 'Mining',
  DEFI: 'DeFi',
  NFT: 'NFT',
};

export const getCryptoNews = async (category = 'ALL', limit = 12) => {
  try {
    const response = await cryptoCompareApi.get('/news/', {
      params: {
        lang: 'EN',
        categories: category !== 'ALL' ? category : undefined,
        feeds: 'cryptocompare,cointelegraph,coindesk',
        sortOrder: 'latest',
        extraParams: 'CryptoVision',
        limit: limit * 2 // Fetch more to ensure we have enough after filtering
      }
    });

    // Process and clean the data
    const articles = response.data.Data.map(article => ({
      id: article.id,
      guid: article.guid,
      published_on: article.published_on,
      imageurl: article.imageurl || 'https://images.cryptocompare.com/news/default.png',
      title: article.title,
      url: article.url,
      body: article.body,
      tags: article.tags ? article.tags.split('|').filter(Boolean) : [],
      categories: article.categories ? 
        article.categories.split('|')
          .filter(Boolean)
          .map(cat => cat.trim())
          .filter(cat => cat.length > 0) : 
        [],
      source: article.source_info?.name || article.source,
      source_info: {
        name: article.source_info?.name || article.source,
        lang: article.source_info?.lang || 'en',
        img: article.source_info?.img
      },
      upvotes: article.upvotes || 0,
      downvotes: article.downvotes || 0,
      views: article.views || 0,
      score: (article.upvotes || 0) - (article.downvotes || 0)
    }));

    // Filter out duplicates and articles without required fields
    const uniqueArticles = articles.filter((article, index, self) =>
      index === self.findIndex((a) => a.guid === article.guid) &&
      article.title &&
      article.body &&
      article.published_on
    );

    // Sort articles by date (latest first)
    const sortedArticles = uniqueArticles.slice(0, limit);

    return {
      articles: sortedArticles,
      categories: {
        ALL: 'all',
        TRADING: 'Trading',
        TECHNOLOGY: 'Technology',
        REGULATION: 'Regulation',
        MINING: 'Mining',
        DEFI: 'DeFi',
        NFT: 'NFT',
        METAVERSE: 'Metaverse',
        GAMING: 'Gaming'
      }
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return { articles: [], categories: {} };
  }
};

export const getCryptoDetails = async (id) => {
  try {
    const response = await retryApiCall(() => 
      cryptoApi.get(`/coins/${id}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false
        }
      })
    );

    const data = response.data;
    return {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      description: data.description,
      image: data.image.large,
      current_price: data.market_data.current_price.usd,
      market_cap: data.market_data.market_cap.usd,
      market_cap_rank: data.market_cap_rank,
      total_volume: data.market_data.total_volume.usd,
      high_24h: data.market_data.high_24h.usd,
      low_24h: data.market_data.low_24h.usd,
      price_change_24h: data.market_data.price_change_24h,
      price_change_percentage_24h: data.market_data.price_change_percentage_24h,
      circulating_supply: data.market_data.circulating_supply,
      total_supply: data.market_data.total_supply,
      max_supply: data.market_data.max_supply,
      ath: data.market_data.ath.usd,
      ath_change_percentage: data.market_data.ath_change_percentage.usd,
      ath_date: data.market_data.ath_date.usd,
      atl: data.market_data.atl.usd,
      atl_change_percentage: data.market_data.atl_change_percentage.usd,
      atl_date: data.market_data.atl_date.usd,
      categories: data.categories,
      links: {
        homepage: data.links.homepage,
        blockchain_site: data.links.blockchain_site,
        official_forum_url: data.links.official_forum_url,
        chat_url: data.links.chat_url,
        announcement_url: data.links.announcement_url,
        twitter_screen_name: data.links.twitter_screen_name,
        facebook_username: data.links.facebook_username,
        telegram_channel_identifier: data.links.telegram_channel_identifier,
        subreddit_url: data.links.subreddit_url,
        repos_url: data.links.repos_url,
        github: data.links.repos_url.github,
      }
    };
  } catch (error) {
    console.error('Error fetching crypto details:', error);
    throw new Error('Failed to fetch cryptocurrency details');
  }
}; 