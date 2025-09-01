import React, { createContext, useState, useEffect } from 'react';
import { fetchSettings } from '../services/apiService';

export const SettingsConstants = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSettings = async () => {
      const data = await fetchSettings();
      setSettings(data);
      setLoading(false);
    };
    getSettings();
  }, []);

  return (
    <SettingsConstants.Provider value={{ settings, loading }}>
      {children}
    </SettingsConstants.Provider>
  );
};
