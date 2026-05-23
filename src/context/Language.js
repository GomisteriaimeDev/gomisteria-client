import React, { createContext, useContext, useState, useEffect } from 'react';

const defaultLanguageContext = {
  currentLanguage: "sq",
  setLanguage: (lang) => {},
};

const LanguageContext = createContext(defaultLanguageContext);

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState("");

  const setLanguage = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem("language", lang);
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") || "sq";
    setCurrentLanguage(storedLanguage);
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
