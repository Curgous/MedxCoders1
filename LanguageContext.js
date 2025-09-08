import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the language context
export const LanguageContext = createContext({
  language: 'en',
  changeLanguage: () => {},
});

// LanguageProvider component to wrap the whole app
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLang = await AsyncStorage.getItem('user-language');
        if (storedLang) {
          setLanguage(storedLang);
        }
      } catch (error) {
        console.error('Failed to load language.', error);
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (newLang) => {
    try {
      setLanguage(newLang);
      await AsyncStorage.setItem('user-language', newLang);
    } catch (error) {
      console.error('Failed to save language.', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
