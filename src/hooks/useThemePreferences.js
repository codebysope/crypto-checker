import { useState } from 'react';

export function useThemePreferences() {
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('themePreferences');
    return saved ? JSON.parse(saved) : {
      chartColors: 'default',
      showVolume: true,
      timeFormat: '24h'
    };
  });

  const updatePreference = (key, value) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('themePreferences', JSON.stringify(updated));
      return updated;
    });
  };

  return { preferences, updatePreference };
} 