import React from "react";
import PropTypes from "prop-types";

const DashboardCard = ({ title, value, icon, color = "bg-blue-500" }) => (
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
      </div>
      
      <div className="ml-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  </div>
);

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string
};

export default DashboardCard;
