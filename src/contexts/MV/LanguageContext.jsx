import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const getLanguage = () => {
    const language = window.localStorage.getItem("language");
    return language ? language : "en";
  };

  const getDirection = () => {
    const language = window.localStorage.getItem("language");
    return language === "ar" ? "rtl" : "ltr";
  };

  const [language, setLanguage] = useState(getLanguage()); // Default language is English

  const languageData = {
    en: require("../../translations/MV/english.json"),
    ar: require("../../translations/MV/arabic.json"),
  };

  const changeLanguage = (newLanguage) => {
    if (Object.keys(languageData).includes(newLanguage)) {
      setLanguage(newLanguage);
      window.localStorage.setItem("language", newLanguage);
    } else {
      console.error(`Unsupported language: ${newLanguage}`);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        languageData,
        getLanguage,
        getDirection,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }

  const { language, languageData, changeLanguage, getLanguage, getDirection } =
    context;

  const translate = (key) => {
    const keys = key.split(".");
    let translatedText = languageData[language];

    keys.forEach((k) => {
      translatedText = translatedText[k];
    });

    return translatedText || key;
  };

  return {
    translate,
    changeLanguage,
    currentLanguage: language,
    getLanguage,
    getDirection,
  };
};
