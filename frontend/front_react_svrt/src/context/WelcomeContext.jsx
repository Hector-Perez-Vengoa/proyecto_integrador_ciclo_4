// src/context/WelcomeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const WelcomeContext = createContext();

export const useWelcome = () => {
  const context = useContext(WelcomeContext);
  if (!context) {
    throw new Error('useWelcome must be used within a WelcomeProvider');
  }
  return context;
};

export const WelcomeProvider = ({ children }) => {
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [shouldShowWelcome, setShouldShowWelcome] = useState(false);

  // Verificar si ya vio el welcome en esta sesión
  useEffect(() => {
    const sessionWelcome = sessionStorage.getItem('hasSeenWelcome');
    const lastWelcomeTime = localStorage.getItem('lastWelcomeTime');
    const now = Date.now();
    
    // Si ya vio el welcome en esta sesión, no mostrar
    if (sessionWelcome === 'true') {
      setHasSeenWelcome(true);
    } else {
      // Si no lo ha visto en esta sesión, verificar si es necesario mostrarlo
      // Solo mostrar si han pasado más de 24 horas desde la última vez
      if (!lastWelcomeTime || now - parseInt(lastWelcomeTime) > 24 * 60 * 60 * 1000) {
        setShouldShowWelcome(true);
      }
    }
  }, []);

  const markWelcomeAsSeen = () => {
    setHasSeenWelcome(true);
    setShouldShowWelcome(false);
    sessionStorage.setItem('hasSeenWelcome', 'true');
    localStorage.setItem('lastWelcomeTime', Date.now().toString());
  };

  const resetWelcomeForNewSession = () => {
    setHasSeenWelcome(false);
    setShouldShowWelcome(true);
    sessionStorage.removeItem('hasSeenWelcome');
  };

  const shouldShowWelcomeModal = (isProfileIncomplete) => {
    return !hasSeenWelcome && shouldShowWelcome && isProfileIncomplete;
  };

  return (
    <WelcomeContext.Provider value={{
      hasSeenWelcome,
      shouldShowWelcome,
      shouldShowWelcomeModal,
      markWelcomeAsSeen,
      resetWelcomeForNewSession
    }}>
      {children}
    </WelcomeContext.Provider>
  );
};
