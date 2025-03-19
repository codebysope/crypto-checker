import { useState, useEffect } from 'react';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  const addToWatchlist = (crypto) => {
    setWatchlist(prev => {
      const updated = [...prev, crypto.id];
      localStorage.setItem('watchlist', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromWatchlist = (cryptoId) => {
    setWatchlist(prev => {
      const updated = prev.filter(id => id !== cryptoId);
      localStorage.setItem('watchlist', JSON.stringify(updated));
      return updated;
    });
  };

  return { watchlist, addToWatchlist, removeFromWatchlist };
} 