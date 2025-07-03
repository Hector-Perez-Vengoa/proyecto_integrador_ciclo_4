import React from "react";

const DashboardCard = ({ title, value, icon, color = "bg-blue-500", trend, percentage }) => (
  <div className={`card-hover relative overflow-hidden p-6 rounded-2xl shadow-custom text-white transition-custom ${color}`}>
    {/* Patrón de fondo decorativo */}
    <div className="absolute top-0 right-0 w-20 h-20 opacity-20">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="20" r="20" fill="currentColor" />
        <circle cx="80" cy="50" r="15" fill="currentColor" />
        <circle cx="30" cy="70" r="10" fill="currentColor" />
      </svg>
    </div>
    
    <div className="relative z-10 flex items-center justify-between">
      <div className="flex-1">
        <div className="text-white/80 text-sm font-medium mb-1">{title}</div>
        <div className="text-3xl font-bold mb-2">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        
        {/* Indicador de tendencia opcional */}
        {trend && percentage && (
          <div className="flex items-center text-sm">
            <svg 
              className={`w-4 h-4 mr-1 ${trend === 'up' ? 'text-green-200' : 'text-red-200'}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              {trend === 'up' ? (
                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 112 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              )}
            </svg>
            <span className="text-white/90">{percentage}% este mes</span>
          </div>
        )}
      </div>
      
      <div className="ml-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  </div>
);

export default DashboardCard;
