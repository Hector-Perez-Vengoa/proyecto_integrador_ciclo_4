import React, { useState } from "react";

const menuItems = [
  { label: "Dashboard", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6m-6 0H7m6 0v6m0 0H7m6 0h6" /></svg>
  ) },
  { label: "Usuarios", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  ) },
  { label: "Reservas", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ) },
  { label: "Aulas", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3m10-5v4a1 1 0 001 1h3m-7 4v4m0 0H7a2 2 0 01-2-2v-5a2 2 0 012-2h10a2 2 0 012 2v5a2 2 0 01-2 2h-5z" /></svg>
  ) },
  { label: "Historial", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ) },
];

const Sidebar = ({ onMenuClick, active }) => {
  const [open, setOpen] = useState(true);
  return (
    <aside className={`h-screen bg-white border-r shadow-lg flex flex-col transition-all duration-500 ${open ? 'w-60' : 'w-16'} z-30`}>
      <div className="flex items-center justify-between px-4 py-5 border-b">
        <span className={`text-xl font-bold text-blue-700 transition-all duration-300 ${open ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Admin</span>
        <button onClick={() => setOpen(o => !o)} className="ml-2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all">
          <svg className={`w-5 h-5 transition-transform ${open ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
      <nav className="flex-1 mt-4">
        <ul className="space-y-1">
          {menuItems.map((item, idx) => (
            <li key={item.label}>
              <button
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all ${active === idx ? 'bg-blue-100 text-blue-700' : ''}`}
                onClick={() => onMenuClick && onMenuClick(idx)}
              >
                {item.icon}
                <span className={`transition-all duration-300 ${open ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
