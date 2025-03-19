import { useState } from 'react';

export function useRecentViews() {
  const [recentViews, setRecentViews] = useState(() => {
    const saved = localStorage.getItem('recentViews');
    return saved ? JSON.parse(saved) : [];
  });

  const addToRecent = (crypto) => {
    setRecentViews(prev => {
      const filtered = prev.filter(item => item.id !== crypto.id);
      const updated = [crypto, ...filtered].slice(0, 5);
      localStorage.setItem('recentViews', JSON.stringify(updated));
      return updated;
    });
  };

  return { recentViews, addToRecent };
} 