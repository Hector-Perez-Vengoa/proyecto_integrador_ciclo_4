// src/hooks/useSidebar.js
import { useState } from 'react';

export const useSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({ 
    reservas: true, 
    reglamento: false 
  });

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  return {
    sidebarOpen,
    openMenus,
    toggleSidebar,
    toggleMenu
  };
};