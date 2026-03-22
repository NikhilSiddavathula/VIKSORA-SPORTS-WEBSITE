import React, { createContext, useContext, useState, useEffect } from 'react';

// Create translation context
const TranslationContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
});

// Translation data
const translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About Us',
    games: 'Games',
    fitness: 'Fitness',
    trainers: 'Trainers',
    nutrition: 'Nutrition',
    store: 'Store',
    sponsorship: 'Sponsorship',
    collaborations: 'Collaborations',
    contact: 'Contact Us',

    // Common
    explore: 'Explore',
    logout: 'Logout',
    login: 'Login',
    signup: 'Sign Up',
    search: 'Search',

    // Language
    language: 'Language',
    english: 'English',
    telugu: 'Telugu',
    hindi: 'Hindi',

    // Placeholder
    searchPlaceholder: 'Search for trainers, courses, or more...',
  },
  te: {
    // Navigation
    home: 'హోమ్',
    about: 'మా గురించి',
    games: 'ఆటలు',
    fitness: 'ఫిట్నెస్',
    trainers: '�్రేయస్కరులు',
    nutrition: 'పోషకాహారం',
    store: 'దుకాణం',
    sponsorship: 'స్పాన్సర్‌షిప్',
    collaborations: 'సహకార ప్రయత్నాలు',
    contact: 'మాకు సంప్రదించండి',

    // Common
    explore: 'అన్వేషించండి',
    logout: 'లాగ్అవుట్',
    login: 'లాగ్ఇన్ చేయండి',
    signup: 'సైన్ అప్ చేయండి',
    search: 'శోధన',

    // Language
    language: 'భాష',
    english: 'ఆంగ్లం',
    telugu: 'తెలుగు',
    hindi: 'హిందీ',

    // Placeholder
    searchPlaceholder: '�్రేయస్కరులు, కోర్సులు లేదా మరిన్ని కోసం శోధించండి...',
  },
  hi: {
    // Navigation
    home: 'होम',
    about: 'हमारे बारे में',
    games: 'खेल',
    fitness: 'फिटनेस',
    trainers: 'प्रशिक्षक',
    nutrition: 'पोषण',
    store: 'स्टोर',
    sponsorship: 'स्पॉन्सरशिप',
    collaborations: 'सहयोग',
    contact: 'संपर्क करें',

    // Common
    explore: 'एक्सप्लोर',
    logout: 'लॉगआउट',
    login: 'लॉगिन',
    signup: 'साइन अप',
    search: 'खोज',

    // Language
    language: 'भाषा',
    english: 'अंग्रेजी',
    telugu: 'तेलुगु',
    hindi: 'हिंदी',

    // Placeholder
    searchPlaceholder: 'प्रशिक्षकों, कोर्सेस या अधिक के लिए खोजें...',
  },
};

// Translation provider component
export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  const handleSetLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  // Translation function
  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook for using translation
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
