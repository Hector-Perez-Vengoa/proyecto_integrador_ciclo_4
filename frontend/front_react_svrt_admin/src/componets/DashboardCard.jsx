import React from "react";

const DashboardCard = ({ title, value, icon, color = "bg-blue-500" }) => (
  <div className={`flex items-center p-5 rounded-xl shadow-md ${color} text-white transition-transform hover:scale-105 cursor-pointer`}>
    <div className="mr-4 text-3xl">{icon}</div>
    <div>
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  </div>
);

export default DashboardCard;
